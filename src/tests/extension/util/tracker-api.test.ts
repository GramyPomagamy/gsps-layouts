import { describe, expect, it, vi, beforeEach } from "vitest";
import { TrackerApi } from "../../../extension/util/tracker-api";
import rawBidsJson from "../../data/tracker/bids/raw_bids_all.json" with { type: "json" };
import toReadJson from "../../data/tracker/donations/to_read.json" with { type: "json" };
import donationBidsJson from "../../data/tracker/donations/donation_bids.json" with { type: "json" };
import recentlyReadJson from "../../data/tracker/donations/recently_read.json" with { type: "json" };
import rawPrizesJson from "../../data/tracker/prizes/raw_prizes.json" with { type: "json" };

const mockAxiosGet = vi.fn();
const mockAxiosPost = vi.fn();
const mockGetCookies = vi.fn();

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: mockAxiosGet,
      post: mockAxiosPost,
    })),
  },
}));

vi.mock("axios-cookiejar-support", () => ({
  wrapper: vi.fn((client) => client),
}));

vi.mock("tough-cookie", () => ({
  CookieJar: class MockCookieJar {
    getCookies = mockGetCookies;
  },
}));

describe("TrackerApi", () => {
  let trackerApi: TrackerApi;

  beforeEach(() => {
    vi.clearAllMocks();
    trackerApi = new TrackerApi({
      rootUrl: "https://tracker.example.com",
      eventId: 1,
    });
  });

  describe("login", () => {
    it("should throw error when login page is not accessible", async () => {
      mockAxiosGet.mockResolvedValueOnce({ status: 500 });

      await expect(
        trackerApi.login({ username: "user", password: "pass" })
      ).rejects.toThrow("Brak dostępu do strony logowania trackera");
    });

    it("should throw error when session cookie is not set after login", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "test-token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([]);

      await expect(
        trackerApi.login({ username: "user", password: "pass" })
      ).rejects.toThrow(
        "Zalogowanie się nie powiodło, czy użytkownik/hasło są poprawne?"
      );
    });

    it("should login successfully when session cookie is set", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "test-token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);

      await expect(
        trackerApi.login({ username: "user", password: "pass" })
      ).resolves.toBeUndefined();
    });

    it("should send correct login request with csrf token", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "my-csrf-token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);

      await trackerApi.login({ username: "testuser", password: "testpass" });

      expect(mockAxiosPost).toHaveBeenCalledWith(
        "https://tracker.example.com/admin/login",
        {
          username: "testuser",
          password: "testpass",
          csrfmiddlewaretoken: "my-csrf-token",
        },
        {
          headers: { referer: "https://tracker.example.com/admin/login" },
          maxRedirects: 0,
          validateStatus: expect.any(Function),
        }
      );
    });
  });

  describe("getBids", () => {
    it("should fetch and process bids correctly", async () => {
      mockAxiosGet
        .mockResolvedValueOnce({ data: rawBidsJson })
        .mockResolvedValueOnce({ data: rawBidsJson });

      const result = await trackerApi.getBids();

      expect(result.allBids).toHaveLength(2);
      expect(result.currentBids).toHaveLength(2);

      const firstBid = result.allBids[0];
      expect(firstBid.id).toBe(1);
      expect(firstBid.type).toBe("choice");
      expect(firstBid.options).toHaveLength(2);
      expect(firstBid.rawTotal).toBe(90);
      expect(firstBid.total).toBe("90 zł");

      expect(firstBid.options[0].rawTotal).toBe(60);
      expect(firstBid.options[1].rawTotal).toBe(30);

      const secondBid = result.allBids[1];
      expect(secondBid.id).toBe(2);
      expect(secondBid.type).toBe("challenge");
      expect(secondBid.options).toHaveLength(0);
    });

    it("should sort bids by run end time", async () => {
      mockAxiosGet
        .mockResolvedValueOnce({ data: rawBidsJson })
        .mockResolvedValueOnce({ data: rawBidsJson });

      const result = await trackerApi.getBids();

      expect(result.allBids[0].id).toBe(1);
      expect(result.allBids[1].id).toBe(2);
    });
  });

  describe("getDonationsToRead", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.getDonationsToRead()).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should fetch and process donations with bids", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet
        .mockResolvedValueOnce({ data: toReadJson })
        .mockResolvedValueOnce({ data: donationBidsJson });

      const result = await trackerApi.getDonationsToRead();

      expect(result).toHaveLength(2);

      const firstDonation = result[0];
      expect(firstDonation.id).toBe(101);
      expect(firstDonation.name).toBe("Test Value requestedalias");
      expect(firstDonation.amount).toBe(25.5);
      expect(firstDonation.comment).toBe("Test Value comment");
      expect(firstDonation.bid).toHaveLength(2);
      expect(firstDonation.bid?.[0].id).toBe(3);
      expect(firstDonation.bid?.[0].amount).toBe(15.5);

      const secondDonation = result[1];
      expect(secondDonation.id).toBe(102);
      expect(secondDonation.name).toBe("Anonim");
      expect(secondDonation.comment).toBeUndefined();
    });

    it("should sort donations by timestamp ascending", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet
        .mockResolvedValueOnce({ data: toReadJson })
        .mockResolvedValueOnce({ data: [] });

      const result = await trackerApi.getDonationsToRead();

      expect(result[0].id).toBe(101);
      expect(result[1].id).toBe(102);
    });
  });

  describe("markDonationAsRead", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.markDonationAsRead(123)).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should throw error when request fails", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({ status: 500 });

      await expect(trackerApi.markDonationAsRead(123)).rejects.toThrow(
        "Failed to set donation as read. Status code: 500"
      );
    });

    it("should mark donation as read successfully", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({ status: 200 });

      await expect(trackerApi.markDonationAsRead(123)).resolves.toBeUndefined();

      expect(mockAxiosGet).toHaveBeenLastCalledWith(
        "https://tracker.example.com/edit?type=donation&id=123&readstate=READ&commentstate=APPROVED"
      );
    });
  });

  describe("getDonationsToAcceptCount", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.getDonationsToAcceptCount()).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should return count of donations to accept", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({
        data: [{}, {}, {}],
      });

      const result = await trackerApi.getDonationsToAcceptCount();
      expect(result).toBe(3);
    });
  });

  describe("getBidsToAcceptCount", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.getBidsToAcceptCount()).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should filter out bids with zero total", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({
        data: [
          { fields: { total: "10.00" } },
          { fields: { total: "0.00" } },
          { fields: { total: "5.00" } },
        ],
      });

      const result = await trackerApi.getBidsToAcceptCount();
      expect(result).toBe(2);
    });
  });

  describe("getTotal", () => {
    it("should return formatted and raw total", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        data: { agg: { total_amount: 12345.67 } },
      });

      const result = await trackerApi.getTotal();

      expect(result.raw).toBe(12345.67);
      expect(result.formatted).toBe("12345.67 zł");
    });

    it("should handle null total_amount", async () => {
      mockAxiosGet.mockResolvedValueOnce({
        data: { agg: { total_amount: null } },
      });

      const result = await trackerApi.getTotal();

      expect(result.raw).toBe(0);
      expect(result.formatted).toBe("0.00 zł");
    });
  });

  describe("getPrizes", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.getPrizes()).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should fetch and process prizes, filtering by ACCEPTED state", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({ data: rawPrizesJson });

      const result = await trackerApi.getPrizes();

      expect(result).toHaveLength(2);

      const firstPrize = result[0];
      expect(firstPrize.id).toBe(301);
      expect(firstPrize.name).toBe("Test Value name");
      expect(firstPrize.provided).toBe("Test Value provider");
      expect(firstPrize.minimumBid).toBe(10);
      expect(firstPrize.image).toBe("Test Value image");
      expect(firstPrize.startTime).toBe(Date.parse("2024-01-02T17:00:00Z"));
      expect(firstPrize.endTime).toBe(Date.parse("2024-01-02T20:00:00Z"));

      const secondPrize = result[1];
      expect(secondPrize.id).toBe(302);
      expect(secondPrize.provided).toBeUndefined();
      expect(secondPrize.image).toBeUndefined();
      expect(secondPrize.startTime).toBe(Date.parse("2024-01-03T10:00:00Z"));
      expect(secondPrize.endTime).toBe(Date.parse("2024-01-03T12:00:00Z"));
    });
  });

  describe("getRecentlyReadDonations", () => {
    it("should throw error when not logged in", async () => {
      await expect(trackerApi.getRecentlyReadDonations()).rejects.toThrow(
        "You're not logged in! Run the 'login' method first!"
      );
    });

    it("should return formatted recently read donations", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      mockAxiosGet.mockResolvedValueOnce({ data: recentlyReadJson });

      const result = await trackerApi.getRecentlyReadDonations();

      expect(result).toHaveLength(2);

      expect(result[0].id).toBe(201);
      expect(result[0].name).toBe("Test Value requestedalias");
      expect(result[0].amount).toBe(41);

      expect(result[1].id).toBe(202);
      expect(result[1].name).toBe("Anonim");
      expect(result[1].amount).toBe(5);
    });

    it("should limit results to 25 donations", async () => {
      // Login first
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { csrfToken: "token" },
      });
      mockAxiosPost.mockResolvedValueOnce({ status: 302 });
      mockGetCookies.mockResolvedValueOnce([{ key: "tracker_session" }]);
      await trackerApi.login({ username: "user", password: "pass" });

      const manyDonations = Array.from({ length: 50 }, (_, i) => ({
        pk: i,
        model: "tracker.donation",
        fields: {
          requestedvisibility: "ALIAS",
          requestedalias: `Donor ${i}`,
          amount: "10.00",
        },
      }));

      mockAxiosGet.mockResolvedValueOnce({ data: manyDonations });

      const result = await trackerApi.getRecentlyReadDonations();

      expect(result).toHaveLength(25);
    });
  });

  describe("getData", () => {
    it("should fetch data from the correct URL", async () => {
      mockAxiosGet.mockResolvedValueOnce({ data: { test: "data" } });

      const result = await trackerApi.getData<{ test: string }>(
        "/search?type=test"
      );

      expect(mockAxiosGet).toHaveBeenCalledWith(
        "https://tracker.example.com/search?type=test"
      );
      expect(result).toEqual({ test: "data" });
    });
  });
});
