import { describe, expect, it, vi, beforeEach } from "vitest";
import { Mixer, type MeterLevels } from "../../../extension/util/mixer";

// Mock osc-js
const mockSend = vi.fn();
const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockOn = vi.fn();

vi.mock("osc-js", () => {
  class MockMessage {
    address: string;
    args: unknown[];
    constructor(address: string, ...args: unknown[]) {
      this.address = address;
      this.args = args;
    }
  }

  class MockDatagramPlugin {
    constructor() {}
  }

  class MockOSC {
    static DatagramPlugin = MockDatagramPlugin;
    static Message = MockMessage;

    send = mockSend;
    open = mockOpen;
    close = mockClose;
    on = mockOn;

    constructor() {}
  }

  return { default: MockOSC };
});

const channelMapping: Record<string, string> = {
  "1": "H1",
  "2": "H2",
  "5": "Gra1",
  "9": "Host1",
};

describe("Mixer", () => {
  let mixer: Mixer;

  beforeEach(() => {
    vi.clearAllMocks();
    mixer = new Mixer({ address: "192.168.1.100", port: 10024 }, channelMapping);
  });

  describe("channel mapping", () => {
    it("builds reverse mapping from channel IDs to names", () => {
      expect(mixer.getChannelNames()).toEqual(["H1", "H2", "Gra1", "Host1"]);
    });
  });

  describe("muteChannel", () => {
    it("sends correct OSC message for single-digit channel", () => {
      mixer.muteChannel("H1");

      expect(mockSend).toHaveBeenCalledTimes(1);
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage.address).toBe("/ch/01/mix/on");
      expect(sentMessage.args).toEqual([0]);
    });

    it("sends correct OSC message for double-digit channel", () => {
      mixer.muteChannel("Host1");

      expect(mockSend).toHaveBeenCalledTimes(1);
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage.address).toBe("/ch/09/mix/on");
      expect(sentMessage.args).toEqual([0]);
    });

    it("calls error callback for unknown channel", () => {
      const errorCallback = vi.fn();
      mixer.onError(errorCallback);

      mixer.muteChannel("NonExistent");

      expect(errorCallback).toHaveBeenCalledWith(
        new Error("Can't find channel NonExistent"),
      );
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("does not throw when no error callback is registered", () => {
      expect(() => mixer.muteChannel("NonExistent")).not.toThrow();
    });
  });

  describe("unmuteChannel", () => {
    it("sends correct OSC message with value 1", () => {
      mixer.unmuteChannel("Gra1");

      expect(mockSend).toHaveBeenCalledTimes(1);
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage.address).toBe("/ch/05/mix/on");
      expect(sentMessage.args).toEqual([1]);
    });

    it("calls error callback for unknown channel", () => {
      const errorCallback = vi.fn();
      mixer.onError(errorCallback);

      mixer.unmuteChannel("Unknown");

      expect(errorCallback).toHaveBeenCalledWith(
        new Error("Can't find channel Unknown"),
      );
    });
  });

  describe("connect/close", () => {
    it("calls osc.open() on connect", () => {
      mixer.connect();
      expect(mockOpen).toHaveBeenCalled();
    });

    it("calls osc.close() on close", () => {
      mixer.close();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe("handleMetersMessage", () => {
    it("parses meter data and calls callback with named levels", () => {
      const metersCallback = vi.fn();
      mixer.onMeters(metersCallback);

      // Get the /meters/2 handler that was registered
      const metersHandler = mockOn.mock.calls.find(
        (call) => call[0] === "/meters/2",
      )?.[1];
      expect(metersHandler).toBeDefined();

      // Create mock meter data: 4 bytes header + 16 channels * 2 bytes each
      // Values: channel 1 = 256 (1dB), channel 2 = 512 (2dB), etc.
      const buffer = new ArrayBuffer(4 + 16 * 2);
      const view = new DataView(buffer);

      // Skip first 4 bytes (header)
      // Set channel values (little-endian i16)
      view.setInt16(4, 256, true); // Channel 1 -> H1: 1dB
      view.setInt16(6, 512, true); // Channel 2 -> H2: 2dB
      view.setInt16(8, 0, true); // Channel 3: not mapped
      view.setInt16(10, 0, true); // Channel 4: not mapped
      view.setInt16(12, 1280, true); // Channel 5 -> Gra1: 5dB
      // Channels 6-8 not mapped
      view.setInt16(20, -2560, true); // Channel 9 -> Host1: -10dB

      const u8Array = new Uint8Array(buffer);
      metersHandler({ args: [u8Array] });

      expect(metersCallback).toHaveBeenCalledWith({
        H1: 1,
        H2: 2,
        Gra1: 5,
        Host1: -10,
      });
    });

    it("handles empty/missing meter data gracefully", () => {
      const metersCallback = vi.fn();
      mixer.onMeters(metersCallback);

      const metersHandler = mockOn.mock.calls.find(
        (call) => call[0] === "/meters/2",
      )?.[1];

      // Call with empty args
      metersHandler({ args: [] });

      expect(metersCallback).not.toHaveBeenCalled();
    });

    it("only includes channels that have name mappings", () => {
      const metersCallback = vi.fn();
      mixer.onMeters(metersCallback);

      const metersHandler = mockOn.mock.calls.find(
        (call) => call[0] === "/meters/2",
      )?.[1];

      // Create buffer with all channels having same value
      const buffer = new ArrayBuffer(4 + 16 * 2);
      const view = new DataView(buffer);
      for (let i = 0; i < 16; i++) {
        view.setInt16(4 + i * 2, 256, true); // All channels = 1dB
      }

      metersHandler({ args: [new Uint8Array(buffer)] });

      const result: MeterLevels = metersCallback.mock.calls[0][0];

      // Should only have the 4 mapped channels
      expect(Object.keys(result)).toHaveLength(4);
      expect(result).toHaveProperty("H1");
      expect(result).toHaveProperty("H2");
      expect(result).toHaveProperty("Gra1");
      expect(result).toHaveProperty("Host1");
      // Should NOT have unmapped channels
      expect(result).not.toHaveProperty("3");
      expect(result).not.toHaveProperty("4");
    });
  });

  describe("meterToDb conversion", () => {
    it("converts raw meter values to dB correctly", () => {
      const metersCallback = vi.fn();
      mixer.onMeters(metersCallback);

      const metersHandler = mockOn.mock.calls.find(
        (call) => call[0] === "/meters/2",
      )?.[1];

      const buffer = new ArrayBuffer(4 + 16 * 2);
      const view = new DataView(buffer);

      // Test various values
      view.setInt16(4, 0, true); // 0 / 256 = 0 dB
      view.setInt16(6, -7680, true); // -7680 / 256 = -30 dB
      view.setInt16(12, -25600, true); // -25600 / 256 = -100 dB (near silence)

      metersHandler({ args: [new Uint8Array(buffer)] });

      const result: MeterLevels = metersCallback.mock.calls[0][0];
      expect(result.H1).toBe(0);
      expect(result.H2).toBe(-30);
      expect(result.Gra1).toBe(-100);
    });
  });

  describe("callbacks", () => {
    it("registers and calls debug callback", () => {
      const debugCallback = vi.fn();
      mixer.onDebug(debugCallback);

      mixer.muteChannel("H1");

      expect(debugCallback).toHaveBeenCalledWith("Muting H1 (01)");
    });

    it("registers connected callback", () => {
      const connectedCallback = vi.fn();
      mixer.onConnected(connectedCallback);

      // Get the /xinfo handler
      const xinfoHandler = mockOn.mock.calls.find(
        (call) => call[0] === "/xinfo",
      )?.[1];
      expect(xinfoHandler).toBeDefined();

      xinfoHandler({ args: ["XR18", "192.168.1.100", "Model"] });

      expect(connectedCallback).toHaveBeenCalledWith(
        "Connected to mixer: XR18,192.168.1.100,Model",
      );
    });
  });
});
