import { describe, expect, it, vi, beforeEach } from "vitest";
import axios from "axios";
import { FoobarControl } from "../../../extension/util/foobar";
import { type TaggedLogger } from "../../../extension/util/tagged-logger";

vi.mock("axios");

const mockLogger: TaggedLogger = {
  error: vi.fn(),
} as unknown as TaggedLogger;

describe("FoobarControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSongInfo", () => {
    it("returns song info when artist and title are present", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          player: {
            activeItem: {
              columns: ["Artist Name", "Song Title"],
              duration: 180,
              position: 45,
            },
          },
        },
      });

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Artist Name - Song Title",
        duration: 180,
        position: 45,
      });
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8880/api/player?columns=%25artist%25%2C%25title%25"
      );
    });

    it("returns 'Brak piosenki' when artist column is empty", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          player: {
            activeItem: {
              columns: ["", "Song Title"],
              duration: 180,
              position: 45,
            },
          },
        },
      });

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Brak piosenki",
        duration: 0,
        position: 0,
      });
    });

    it("returns 'Brak piosenki' when title column is empty", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          player: {
            activeItem: {
              columns: ["Artist Name", ""],
              duration: 180,
              position: 45,
            },
          },
        },
      });

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Brak piosenki",
        duration: 0,
        position: 0,
      });
    });

    it("returns 'Brak piosenki' when columns array is empty", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          player: {
            activeItem: {
              columns: [],
              duration: 180,
              position: 45,
            },
          },
        },
      });

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Brak piosenki",
        duration: 0,
        position: 0,
      });
    });

    it("returns 'Brak piosenki' and logs error when request fails with Error", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Brak piosenki",
        duration: 0,
        position: 0,
      });
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Błąd otrzymywania piosenki: Network error"
      );
    });

    it("returns 'Brak piosenki' and logs error when request fails with non-Error", async () => {
      vi.mocked(axios.get).mockRejectedValue("string error");

      const foobar = new FoobarControl("http://localhost:8880", mockLogger);
      const result = await foobar.getSongInfo();

      expect(result).toEqual({
        displayName: "Brak piosenki",
        duration: 0,
        position: 0,
      });
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Błąd otrzymywania piosenki: string error"
      );
    });
  });
});

