import { type Bids, type Tracker } from "@gsps-layouts/types";
import axios, { type AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { type z } from "zod";
import { TrackerSchemas } from "../schemas";
import { type TaggedLogger } from "./tagged-logger";

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

type DataFetchSuccess<T> = {
  data: T;
  status: number;
  success: true;
};

type DataFetchFailure<T> = {
  data?: T;
  status: number;
  success: false;
};

export class TrackerApi {
  private readonly rootUrl: string;
  private readonly eventId: number;
  private readonly cookieJar: CookieJar;
  private readonly axiosClient: AxiosInstance;
  private readonly logger: TaggedLogger;
  private loggedIn = false;

  constructor({
    rootUrl,
    eventId,
    logger,
  }: {
    eventId: number;
    logger: TaggedLogger;
    rootUrl: string;
  }) {
    this.rootUrl = rootUrl;
    this.eventId = eventId;
    this.logger = logger;

    this.cookieJar = new CookieJar();
    this.axiosClient = wrapper(
      axios.create({
        jar: this.cookieJar,
        withCredentials: true,
      }),
    );
  }

  public async login({
    username,
    password,
  }: {
    password: string;
    username: string;
  }): Promise<void> {
    const loginUrl = `${this.rootUrl}/admin/login/`;

    const csrfTokenResp = await this.axiosClient.get(loginUrl);
    if (csrfTokenResp.status !== 200) {
      throw new Error("Brak dostępu do strony logowania trackera");
    }
    const csrfCookies = await this.cookieJar.getCookies(loginUrl);
    const csrfToken = csrfCookies.find(
      (cookie) => cookie.key === "csrftoken",
    )?.value;

    if (!csrfToken) {
      throw new Error("Brak CSRF tokenu");
    }

    await this.axiosClient
      .post(
        loginUrl,
        new URLSearchParams({
          username,
          password,
          csrfmiddlewaretoken: csrfToken,
          next: "/admin/",
        }),
        {
          headers: {
            Referer: loginUrl,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          transformRequest: [(data) => new URLSearchParams(data).toString()],
        },
      )
      .catch((error) => {
        console.error(error);
        throw new Error("Błąd podczas logowania do trackera");
      });

    const cookies = await this.cookieJar.getCookies(this.rootUrl);
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
      `/search?type=allbids&event=${this.eventId}&state=OPENED`,
    );

    if (!allBidsResp.success) {
      this.logger.error("Failed to parse all bids response from tracker!");
      this.logger.error(`Status code: ${allBidsResp.status}`);
    }

    if (!currentBidsResp.success) {
      this.logger.error("Failed to parse all bids response from tracker!");
      this.logger.error(`Status code: ${currentBidsResp.status}`);
    }

    const allBidsParsed = TrackerSchemas.Bids.safeParse(
      allBidsResp.success ? allBidsResp.data : [],
    );
    const currentBidsParsed = TrackerSchemas.Bids.safeParse(
      currentBidsResp.success ? currentBidsResp.data : [],
    );

    if (!allBidsParsed.success) {
      this.logger.error("Failed to parse all bids response from tracker!");
      this.logger.error(`Errors: ${allBidsParsed.error}`);
    }

    if (!currentBidsParsed.success) {
      this.logger.error("Failed to parse all bids response from tracker!");
      this.logger.error(`Errors: ${currentBidsParsed.error}`);
    }

    const allBids = allBidsParsed.success ? allBidsParsed.data : [];
    const currentBids = currentBidsParsed.success ? currentBidsParsed.data : [];

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
      `/search?event=${this.eventId}&type=donation&feed=toread`,
    );

    const processedDonationsToRead = this.processToReadDonations(
      donationsToReadResp.success
        ? donationsToReadResp.data
        : ([] as Tracker.Donation[]),
    );

    const donationBids = await this.getDonationBids();

    for (const donation of processedDonationsToRead) {
      const matchingBids = donationBids.filter(
        (bid) => bid.fields.donation === donation.id,
      );
      donation.bid = matchingBids.map((bid) => ({
        id: bid.fields.bid,
        amount:
          bid.fields.amount != null ? parseFloat(bid.fields.amount) : undefined,
      }));
    }

    return processedDonationsToRead;
  }

  public async getDonationBids(): Promise<Tracker.DonationBid[]> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const donationBidsResp = await this.getData<Tracker.DonationBid[]>(
      `/search?event=${this.eventId}&type=donationbid`,
    );

    if (!donationBidsResp.success) {
      this.logger.error("Failed to get donation bids from tracker!");
      this.logger.error(`Status code: ${donationBidsResp.status}`);
      return [];
    }

    const parsedResp = TrackerSchemas.DonationBids.safeParse(
      donationBidsResp.data,
    );

    if (!parsedResp.success) {
      this.logger.error(
        "Failed to parse data from tracker regading donation bids!",
      );
      this.logger.error(`Errors: ${parsedResp.error}`);
      return [];
    }

    return parsedResp.data;
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
      this.logger.error(
        `Failed to set donation as read. Status code: ${request.status}`,
      );
      return;
    }
  }

  public async getDonationsToAcceptCount(): Promise<number> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const donationsToAcceptResp = await this.getData<unknown[]>(
      `/search?event=${this.eventId}&type=donation&commentstate=PENDING&transactionstate=COMPLETED`,
    );

    if (!donationsToAcceptResp.success) {
      this.logger.error("Failed to get donations to accept count!");
      this.logger.error(`Status code: ${donationsToAcceptResp.status}`);
      return 0;
    }

    return donationsToAcceptResp.data.length;
  }

  public async getBidsToAcceptCount(): Promise<number> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const bidsToAcceptResp = await this.getData<
      Array<{ fields: { total: string } }>
    >(`/search?event=${this.eventId}&type=bidtarget&state=PENDING`);

    if (!bidsToAcceptResp.success) {
      this.logger.error("Failed to get amount of bids to accept from tracker!");
      this.logger.error(`Status code: ${bidsToAcceptResp.status}`);
      return 0;
    }

    const filteredBids = bidsToAcceptResp.data.filter(
      (bid) => bid.fields.total !== "0.00",
    );

    return filteredBids.length;
  }

  public async getTotal(): Promise<{ formatted: string; raw: number }> {
    const totalResp = await this.getData<{ agg: { total_amount: number } }>(
      `/${this.eventId}?json`,
    );

    if (!totalResp.success) {
      this.logger.error("Failed to get total from tracker!");
      this.logger.error(`Status code: ${totalResp.status}`);
      return { raw: 0, formatted: "0 zł" };
    }

    const rawTotal = parseFloat(String(totalResp.data.agg.total_amount ?? 0));

    return {
      raw: rawTotal,
      formatted: `${rawTotal.toFixed(0)} zł`,
    };
  }

  public async getPrizes(): Promise<Tracker.FormattedPrize[]> {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const prizesResp = await this.getData<Tracker.Prize[]>(
      `/search?event=${this.eventId}&type=prize`,
    );

    if (!prizesResp.success) {
      this.logger.error("Failed to get prize data from tracker!");
      this.logger.error(`Status code: ${prizesResp.status}`);
      return [];
    }

    return this.processRawPrizes(prizesResp.data);
  }

  public async getRecentlyReadDonations(): Promise<
    Array<{ amount: number; id: number; name: string }>
  > {
    if (!this.loggedIn) {
      throw new Error("You're not logged in! Run the 'login' method first!");
    }

    const resp = await this.getData<Tracker.Donation[]>(
      `/search?event=${this.eventId}&type=donation&readstate=READ`,
    );

    if (!resp.success) {
      this.logger.error(
        `Failed to get recently read donations! Status code ${resp.status}`,
      );
      return [];
    }

    return resp.data.slice(0, 25).map((donation) => ({
      id: donation.pk,
      name:
        donation.fields.requestedvisibility === "ALIAS"
          ? donation.fields.requestedalias
          : "Anonim",
      amount: parseInt(parseFloat(donation.fields.amount).toFixed(0)),
    }));
  }

  public async getData<T>(
    endpoint: string,
  ): Promise<DataFetchSuccess<T> | DataFetchFailure<T>> {
    const response = await this.axiosClient.get<T>(
      `${this.rootUrl}${endpoint}`,
    );

    if (response.status === 200) {
      return {
        data: response.data,
        success: true,
        status: response.status,
      };
    }

    return {
      data: undefined,
      success: false,
      status: response.status,
    };
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
          category: bid.fields.speedrun__category ?? "",
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

  private processRawPrizes(
    rawPrizes: Tracker.Prize[],
  ): Tracker.FormattedPrize[] {
    return rawPrizes
      .filter((prize) => prize.fields.state === "ACCEPTED")
      .map((prize) => {
        const startTime =
          prize.fields.startrun__starttime ?? prize.fields.starttime;
        const endTime = prize.fields.endrun__endtime ?? prize.fields.endtime;
        return {
          id: prize.pk,
          name: prize.fields.name,
          provided: prize.fields.provider || undefined,
          minimumBid: parseFloat(prize.fields.minimumbid),
          image: prize.fields.image || undefined,
          startTime: startTime ? Date.parse(startTime) : undefined,
          endTime: endTime ? Date.parse(endTime) : undefined,
        };
      });
  }
}
