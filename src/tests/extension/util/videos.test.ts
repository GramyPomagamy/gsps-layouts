import { describe, expect, it } from "vitest";
import { Videos } from "../../../extension/util/videos";
import type { Asset } from "../../../types";

const createAsset = (name: string): Asset => ({
  base: "",
  namespace: "gsps-layouts",
  category: "videos",
  ext: "mp4",
  name,
  sum: "",
  url: `${name}.mp4`,
});

describe("Videos", () => {
  describe("constructor", () => {
    it("initializes with empty asset list when no videos are provided", () => {
      const videos = new Videos(undefined, 5, undefined);

      expect(videos.getCurrentIndex()).toBe(0);
      expect(videos["_assets"]).toEqual([]);
      expect(videos.getLastPlayedVideo()).toBeUndefined();
    });

    it("copies provided assets and stores last video", () => {
      const asset1 = createAsset("video-1");
      const asset2 = createAsset("video-2");
      const originalAssets = [asset1, asset2];

      const videos = new Videos(originalAssets, 3, asset2);

      // Mutate original array to ensure internal copy is used
      originalAssets.push(createAsset("video-3"));

      const internalAssets = videos["_assets"] as Asset[];
      expect(internalAssets).toHaveLength(2);
      expect(internalAssets).toContain(asset1);
      expect(internalAssets).toContain(asset2);
      expect(videos.getLastPlayedVideo()).toBe(asset2);
      // current index is reset by shuffle
      expect(videos.getCurrentIndex()).toBe(0);
    });

    it("does not place last video as first after shuffle", () => {
      const asset1 = createAsset("video-1");
      const asset2 = createAsset("video-2");
      const asset3 = createAsset("video-3");

      const videos = new Videos([asset1, asset2, asset3], 0, asset2);

      expect(videos.getLastPlayedVideo()).toBe(asset2);
      // The first asset after shuffling should never be the last played one
      expect(videos["_assets"][0]).not.toBe(asset2);
    });
  });

  describe("getNextVideo", () => {
    it("returns undefined and keeps state consistent when there are no videos", () => {
      const videos = new Videos(undefined, 0, undefined);

      const next = videos.getNextVideo();

      expect(next).toBeUndefined();
      expect(videos.getLastPlayedVideo()).toBeUndefined();
      expect(videos.getCurrentIndex()).toBe(0);
    });

    it("returns videos sequentially and updates index and last video", () => {
      const asset1 = createAsset("video-1");
      const asset2 = createAsset("video-2");
      const videos = new Videos(undefined, 0, undefined);

      // Prepare internal state deterministically
      videos["_assets"] = [asset1, asset2];
      videos["_currentVideoIndex"] = 0;
      videos["_lastVideo"] = undefined;

      const first = videos.getNextVideo();
      expect(first).toBe(asset1);
      expect(videos.getLastPlayedVideo()).toBe(asset1);
      expect(videos.getCurrentIndex()).toBe(1);

      const second = videos.getNextVideo();
      expect(second).toBe(asset2);
      expect(videos.getLastPlayedVideo()).toBe(asset2);
      // After reaching the end, videos are shuffled and index is reset
      expect(videos.getCurrentIndex()).toBe(0);
    });
  });

  describe("addNewVideo", () => {
    it("adds a new video to the internal list", () => {
      const videos = new Videos(undefined, 0, undefined);
      const asset = createAsset("new-video");

      videos.addNewVideo(asset);

      const internalAssets = videos["_assets"] as Asset[];
      expect(internalAssets).toHaveLength(1);
      expect(internalAssets[0]).toBe(asset);
    });

    it("ignores undefined video", () => {
      const videos = new Videos(undefined, 0, undefined);

      videos.addNewVideo(undefined);

      expect(videos["_assets"]).toEqual([]);
    });
  });
});


