import { TrackerSchemas } from "@gsps-layouts/schemas";
import { type Bids, type Tracker } from "@gsps-layouts/types";
import axios, { type AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { type z } from "zod";

type RawBids = z.infer<typeof TrackerSchemas.Bids>;

type FormattedChildBid = {
  description: string;
  id: number;
  name: string;
  parent: number;
  rawTotal: number;
  speedrun: number;
  total: string;
};

type FormattedParentBid = {
  allowUserOptions: boolean;
  category: string;
  description: string;
  game: string;
  goal?: string;
  goalMet?: boolean;
  id: number;
  longDescription: string;
  name: string;
  options: FormattedChildBid[];
  public: string;
  rawGoal?: number;
  rawTotal: number;
  runEndTime: number;
  runStartTime: number;
  state: string;
  total: string;
  type: "choice" | "challenge";
};

export class TrackerApi {
  private readonly rootUrl: string;
  private readonly eventId: number;
  private readonly cookieJar: CookieJar;
  private readonly axiosClient: AxiosInstance;
  private loggedIn = false;

  constructor({ rootUrl, eventId }: { eventId: number; rootUrl: string }) {
    this.rootUrl = rootUrl;
    this.eventId = eventId;

    this.cookieJar = new CookieJar();
    this.axiosClient = wrapper(
      axios.create({ jar: this.cookieJar, withCredentials: true }),
    );
  }

  public async login({
    username,
    password,
  }: {
    password: string;
    username: string;
  }): Promise<void> {
    const loginUrl = `${this.rootUrl}/admin/login`;

    const csrfTokenResp = await this.axiosClient.get(loginUrl);
    if (csrfTokenResp.status !== 200) {
      throw new Error("Brak dostępu do strony logowania trackera");
    }

    await this.axiosClient.post(
      loginUrl,
      {
        username,
        password,
        csrfmiddlewaretoken: csrfTokenResp.data.csrfToken,
      },
      {
        headers: {
          referer: loginUrl,
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      },
    );

    const cookies = await this.cookieJar.getCookies(loginUrl);
    const hasSessionCookie = cookies.some(
      (cookie) => cookie.key === "tracker_session",
    );

    if (!hasSessionCookie) {
      throw new Error(
        "Zalogowanie się nie powiodło, czy użytkownik/hasło są poprawne?",
      );
    }

    this.loggedIn = true;
  }

  public async getBids(): Promise<{ allBids: Bids; currentBids: Bids }> {
    const allBidsResp = await this.getData<RawBids>(
      `/search?type=allbids&event=${this.eventId}`,
    );
    const currentBidsResp = await this.getData<RawBids>(
      `/search?type=allbids&event=${this.eventId}&status=OPENED`,
    );

    const allBids = TrackerSchemas.Bids.parse(allBidsResp);
    const currentBids = TrackerSchemas.Bids.parse(currentBidsResp);

    return {
      allBids: this.processRawBids(allBids),
      currentBids: this.processRawBids(currentBids),
    };
  }

  public async getDonationsToRead(): Promise<Tracker.FormattedDonation[]> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const donationsToReadResp = await this.getData<Tracker.Donation[]>(
      `${this.rootUrl}/search?event=${this.eventId}&type=donation&feed=toread`,
    );

    const processedDonationsToRead =
      this.processToReadDonations(donationsToReadResp);

    return processedDonationsToRead;
  }

  public async getDonationBids(): Promise<Tracker.DonationBid[]> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const donationBidsResp = await this.getData<Tracker.DonationBid[]>(
      `${this.rootUrl}/search?event=${this.eventId}&type=donationbid`,
    );

    const parsedResp = TrackerSchemas.DonationBids.parse(donationBidsResp);

    return parsedResp;
  }

  public async markDonationAsRead(id: number): Promise<void> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const request = await this.axiosClient.get(
      `${this.rootUrl}/edit?type=donation&id=${id}` +
        "&readstate=READ&commentstate=APPROVED",
    );

    if (request.status !== 200) {
      throw new Error(
        `Failed to set donation as read. Status code: ${request.status}`,
      );
    }
  }

  public async getData<T>(endpoint: string): Promise<T> {
    const response = await this.axiosClient.get<T>(
      `${this.rootUrl}${endpoint}`,
    );

    return response.data;
  }

  private processToReadDonations(
    donations: Tracker.Donation[],
  ): Tracker.FormattedDonation[] {
    return donations
      .map((donation) => ({
        id: donation.pk,
        name:
          donation.fields.requestedvisibility === "ALIAS"
            ? donation.fields.requestedalias
            : "Anonim",
        amount: parseFloat(donation.fields.amount),
        comment:
          donation.fields.commentstate === "APPROVED"
            ? donation.fields.comment
            : undefined,
        timestamp: Date.parse(donation.fields.timereceived),
      }))
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) {
          return -1;
        }
        if (a.timestamp > b.timestamp) {
          return 1;
        }
        return 0;
      });
  }

  private processRawBids(bids: RawBids) {
    const parentBidsById: Record<number, FormattedParentBid> = {};
    const childBids: RawBids = [];

    bids
      .sort((a, b) => this.sortRawBidsByEarliestEndTime(a, b))
      .forEach((bid) => {
        const state = bid.fields.state.toLowerCase();
        if (state === "denied" || state === "pending") {
          return;
        }

        if (bid.fields.parent) {
          childBids.push(bid);
          return;
        }

        const rawTotal =
          bid.fields.total != null
            ? parseFloat(bid.fields.total.toString())
            : 0;

        const formattedParentBid: FormattedParentBid = {
          id: bid.pk,
          name: bid.fields.name,
          description:
            bid.fields.shortdescription ||
            `No shortdescription for bid #${bid.pk}`,
          longDescription:
            bid.fields.description || `No description for bid #${bid.pk}`,
          total: `${rawTotal} zł`,
          rawTotal,
          state: bid.fields.state,
          game: bid.fields.speedrun__display_name,
          category: bid.fields.speedrun__category,
          runStartTime: bid.fields.speedrun__starttime,
          runEndTime: bid.fields.speedrun__endtime,
          public: bid.fields.public,
          allowUserOptions: bid.fields.allowuseroptions,
          type: "challenge",
          options: [],
        };

        if (bid.fields.istarget === false) {
          formattedParentBid.options = [];
        } else {
          const goal =
            bid.fields.goal != null
              ? parseFloat(bid.fields.goal.toString())
              : 0;
          formattedParentBid.goalMet = rawTotal >= goal;
          formattedParentBid.goal = `${goal} zł`;
          formattedParentBid.rawGoal = goal;
        }

        parentBidsById[bid.pk] = formattedParentBid;
      });

    childBids.forEach((bid) => {
      const parent = parentBidsById[bid.fields.parent!];
      if (!parent) {
        return;
      }

      const formattedChildBid: FormattedChildBid = {
        id: bid.pk,
        parent: bid.fields.parent!,
        name: bid.fields.name,
        description: bid.fields.shortdescription,
        speedrun: bid.fields.speedrun,
        total: `${bid.fields.total != null ? parseFloat(bid.fields.total.toString()) : 0} zł`,
        rawTotal:
          bid.fields.total != null
            ? parseFloat(bid.fields.total.toString())
            : 0,
      };

      if (!parent.options) {
        parent.options = [];
      }
      parent.options.push(formattedChildBid);
    });

    let bidsArray: FormattedParentBid[] = Object.values(parentBidsById);

    bidsArray = bidsArray.map((bid) => ({
      ...bid,
      type: (bid.options?.length ?? 0) > 0 ? "choice" : "challenge",
    }));

    bidsArray.forEach((bid) => {
      if (bid.options && bid.options.length > 0) {
        bid.options.sort((a, b) => {
          if (a.rawTotal > b.rawTotal) return -1;
          if (a.rawTotal < b.rawTotal) return 1;
          return 0;
        });
      }
    });

    bidsArray.sort((a, b) => this.sortFormattedBidsByEarliestEndTime(a, b));

    return bidsArray;
  }

  private sortRawBidsByEarliestEndTime(
    a: { fields: { speedrun__endtime: number } },
    b: { fields: { speedrun__endtime: number } },
  ) {
    return a.fields.speedrun__endtime - b.fields.speedrun__endtime;
  }

  private sortFormattedBidsByEarliestEndTime(
    a: { runEndTime: number },
    b: { runEndTime: number },
  ) {
    return a.runEndTime - b.runEndTime;
  }
}
