import { describe, expect, it, vi, beforeEach } from "vitest";
import { ObsControl } from "../../../extension/util/obs-control";
import type { ObsData, WindowInfo } from "../../../types";

type CropperInfo = ObsData["croppers"][number];

const createCropperInfo = (
  overrides: Partial<CropperInfo> = {}
): CropperInfo => ({
  url: "http://example.com",
  name: "Test Cropper",
  sceneName: "Test Scene",
  sourceName: "Test Source",
  ...overrides,
});

const createWindowInfo = (overrides: Partial<WindowInfo> = {}): WindowInfo => ({
  pid: 1234,
  processName: "test-process",
  windowTitle: "Test Window",
  x: 0,
  y: 0,
  w: 1920,
  h: 1080,
  ...overrides,
});

describe("ObsControl", () => {
  let obsControl: ObsControl;
  let mockCall: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    obsControl = new ObsControl({
      hostAudio: "Host Audio",
      intermissionVideo: "Intermission Video",
    });
    mockCall = vi.fn();
    // Replace the inherited call method with our mock
    Object.defineProperty(obsControl, "call", {
      value: mockCall,
      writable: true,
    });
  });

  describe("cropSource", () => {
    it("calculates crop values correctly for a centered window", async () => {
      const cropperInfo = createCropperInfo();
      const windowInfo = createWindowInfo({
        x: 100,
        y: 50,
        w: 800,
        h: 600,
      });

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 123 })
        .mockResolvedValueOnce({
          sceneItemTransform: { width: 1920, height: 1080 },
        })
        .mockResolvedValueOnce(undefined);

      await obsControl.cropSource({ cropperInfo, windowInfo });

      expect(mockCall).toHaveBeenNthCalledWith(1, "GetSceneItemId", {
        sceneName: "Test Scene",
        sourceName: "Test Source",
      });

      expect(mockCall).toHaveBeenNthCalledWith(2, "GetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 123,
      });

      expect(mockCall).toHaveBeenNthCalledWith(3, "SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 123,
        sceneItemTransform: {
          cropTop: 50, // y
          cropBottom: 430, // 1080 - 50 - 600
          cropLeft: 100, // x
          cropRight: 1020, // 1920 - 100 - 800
        },
      });
    });

    it("calculates zero crop when window fills entire source", async () => {
      const cropperInfo = createCropperInfo();
      const windowInfo = createWindowInfo({
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
      });

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 1 })
        .mockResolvedValueOnce({
          sceneItemTransform: { width: 1920, height: 1080 },
        })
        .mockResolvedValueOnce(undefined);

      await obsControl.cropSource({ cropperInfo, windowInfo });

      expect(mockCall).toHaveBeenLastCalledWith("SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 1,
        sceneItemTransform: {
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 0,
          cropRight: 0,
        },
      });
    });

    it("handles window at bottom-right corner", async () => {
      const cropperInfo = createCropperInfo();
      const windowInfo = createWindowInfo({
        x: 1000,
        y: 500,
        w: 920,
        h: 580,
      });

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 42 })
        .mockResolvedValueOnce({
          sceneItemTransform: { width: 1920, height: 1080 },
        })
        .mockResolvedValueOnce(undefined);

      await obsControl.cropSource({ cropperInfo, windowInfo });

      expect(mockCall).toHaveBeenLastCalledWith("SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 42,
        sceneItemTransform: {
          cropTop: 500,
          cropBottom: 0, // 1080 - 500 - 580
          cropLeft: 1000,
          cropRight: 0, // 1920 - 1000 - 920
        },
      });
    });
  });

  describe("crop4By3", () => {
    it("calculates 4:3 pillarbox margins for 16:9 source", async () => {
      const cropperInfo = createCropperInfo();

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 456 })
        .mockResolvedValueOnce({
          sceneItemTransform: { width: 1920, height: 1080 },
        })
        .mockResolvedValueOnce(undefined);

      await obsControl.crop4By3({ cropperInfo });

      expect(mockCall).toHaveBeenLastCalledWith("SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 456,
        sceneItemTransform: {
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 240, // 1920 / 8
          cropRight: 240, // 1920 / 8
        },
      });
    });

    it("calculates margins for different source widths", async () => {
      const cropperInfo = createCropperInfo();

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 789 })
        .mockResolvedValueOnce({
          sceneItemTransform: { width: 1280, height: 720 },
        })
        .mockResolvedValueOnce(undefined);

      await obsControl.crop4By3({ cropperInfo });

      expect(mockCall).toHaveBeenLastCalledWith("SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 789,
        sceneItemTransform: {
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 160, // 1280 / 8
          cropRight: 160, // 1280 / 8
        },
      });
    });
  });

  describe("resetCrop", () => {
    it("sets all crop values to zero", async () => {
      const cropperInfo = createCropperInfo();

      mockCall
        .mockResolvedValueOnce({ sceneItemId: 999 })
        .mockResolvedValueOnce(undefined);

      await obsControl.resetCrop({ cropperInfo });

      expect(mockCall).toHaveBeenNthCalledWith(1, "GetSceneItemId", {
        sceneName: "Test Scene",
        sourceName: "Test Source",
      });

      expect(mockCall).toHaveBeenNthCalledWith(2, "SetSceneItemTransform", {
        sceneName: "Test Scene",
        sceneItemId: 999,
        sceneItemTransform: {
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 0,
          cropRight: 0,
        },
      });
    });
  });

  describe("getRecordingPath", () => {
    it("returns path from output settings", async () => {
      mockCall
        .mockResolvedValueOnce({
          outputs: [{ outputName: "simple_file_output" }],
        })
        .mockResolvedValueOnce({
          outputSettings: { path: "/recordings/output.mkv" },
        });

      const result = await obsControl.getRecordingPath();

      expect(result).toBe("/recordings/output.mkv");
    });

    it("returns empty string when no outputs exist", async () => {
      mockCall.mockResolvedValueOnce({ outputs: [] });

      const result = await obsControl.getRecordingPath();

      expect(result).toBe("");
    });

    it("returns empty string when output has no path setting", async () => {
      mockCall
        .mockResolvedValueOnce({
          outputs: [{ outputName: "some_output" }],
        })
        .mockResolvedValueOnce({
          outputSettings: { someOtherSetting: "value" },
        });

      const result = await obsControl.getRecordingPath();

      expect(result).toBe("");
    });

    it("returns last found path when multiple outputs exist", async () => {
      mockCall
        .mockResolvedValueOnce({
          outputs: [
            { outputName: "output1" },
            { outputName: "output2" },
            { outputName: "output3" },
          ],
        })
        .mockResolvedValueOnce({
          outputSettings: { path: "/first/path.mkv" },
        })
        .mockResolvedValueOnce({
          outputSettings: {},
        })
        .mockResolvedValueOnce({
          outputSettings: { path: "/last/path.mkv" },
        });

      const result = await obsControl.getRecordingPath();

      expect(result).toBe("/last/path.mkv");
    });
  });

  describe("getRecordingStatus", () => {
    it("transforms OBS response to expected format", async () => {
      mockCall.mockResolvedValueOnce({
        outputActive: true,
        outputDuration: 123456,
      });

      const result = await obsControl.getRecordingStatus();

      expect(mockCall).toHaveBeenCalledWith("GetRecordStatus");
      expect(result).toEqual({
        isRecording: true,
        recordingDuration: 123456,
      });
    });

    it("returns false and zero duration when not recording", async () => {
      mockCall.mockResolvedValueOnce({
        outputActive: false,
        outputDuration: 0,
      });

      const result = await obsControl.getRecordingStatus();

      expect(result).toEqual({
        isRecording: false,
        recordingDuration: 0,
      });
    });
  });
});
