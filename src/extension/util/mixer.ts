import OSC from "osc-js";

export interface XAirMixerConfig {
  address: string;
  port: number;
  localPort?: number;
}

export type MeterLevels = Record<string, number>;

export class Mixer {
  private osc: OSC;
  private channelIdToName: Record<string, string>;
  private channelNameToId: Record<string, string>;
  private lastMetersUpdate: number = 0;

  private metersCallback?: (levels: MeterLevels) => void;
  private connectedCallback?: (info: string) => void;
  private errorCallback?: (error: Error) => void;
  private debugCallback?: (message: string) => void;

  constructor(config: XAirMixerConfig, channelMapping: Record<string, string>) {
    this.channelIdToName = channelMapping;
    this.channelNameToId = Object.entries(channelMapping).reduce(
      (acc, [id, name]) => {
        acc[name] = id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const settings = {
      type: "udp4",
      open: {
        host: "0.0.0.0",
        port: config.localPort ?? 41234,
        exclusive: true,
      },
      send: {
        host: config.address,
        port: config.port,
      },
    };

    this.osc = new OSC({ plugin: new OSC.DatagramPlugin(settings) });
    this.setupOscHandlers();
  }

  private setupOscHandlers(): void {
    this.osc.on("open", () => {
      const xinfo = new OSC.Message("/xinfo");
      this.osc.send(xinfo);
      this.scheduleMeters();
    });

    this.osc.on("error", (message: unknown) => {
      if (this.errorCallback) {
        this.errorCallback(
          message instanceof Error ? message : new Error(String(message)),
        );
      }
    });

    this.osc.on("/xinfo", (message: { args: unknown[] }) => {
      if (this.connectedCallback) {
        this.connectedCallback(`Connected to mixer: ${message.args}`);
      }
    });

    this.osc.on("/meters/2", (message: { args: Uint8Array[] }) => {
      this.handleMetersMessage(message);
    });

    this.osc.on("*", (message: { address: string; args: unknown[] }) => {
      if (message.address.startsWith("/meters")) {
        return;
      }
      if (this.debugCallback) {
        this.debugCallback(`catchall: ${message.address} ${message.args}`);
      }
    });
  }

  private handleMetersMessage(message: { args: Uint8Array[] }): void {
    /* meters come as an array of u8. First there's an i32 that specifies the number of the i16 fields
       that come afterwards. We can skip the first 4 bytes because the protocol limits the payload for us.
       /meters/2 consists of 16 analog inputs, 2 aux inputs, and 18 usb inputs */
    const u8Array = message.args?.[0];
    if (!u8Array) {
      // If data is missing or malformed, gracefully exit this handler
      return;
    }
    const buffer = new DataView(
      u8Array.buffer,
      u8Array.byteOffset,
      u8Array.byteLength,
    );
    const i16Array: number[] = [];
    for (let i = 4; i < buffer.byteLength; i += 2) {
      i16Array.push(buffer.getInt16(i, true));
    }
    const analogIn = i16Array.slice(0, 16).map(this.meterToDb);

    const levels: MeterLevels = {};
    for (const [i, v] of analogIn.entries()) {
      const channelId = (i + 1).toString();
      const inputName =
        this.channelIdToName[channelId as keyof typeof this.channelIdToName] ??
        channelId;
      if (inputName !== channelId) {
        levels[inputName] = v;
      }
    }

    this.lastMetersUpdate = Date.now();

    if (this.metersCallback) {
      this.metersCallback(levels);
    }
  }

  private meterToDb(v: number): number {
    return v / 256;
  }

  private scheduleMeters(): void {
    /* There are multiple "meters" levels available, see "X AIR Remote Control Protocol.pdf"
       on our drive https://drive.google.com/drive/folders/1Pmsiciq8zUkp-SP54CvPH52esTP2x7Id
       for details. `/meters/2` gives us information about input signal levels for all channels.
       Each activation of `/meters` command will result in 200 responses from the mixer.
       We have to use the undocumented `/renew` to reset the counter on the device.
       X AIR Edit does that roughly every 1 second, but that seems excessive. */

    const meters = new OSC.Message("/meters", "/meters/2");
    this.osc.send(meters);

    setInterval(() => {
      if (Date.now() - this.lastMetersUpdate > 10000) {
        this.osc.send(meters);
        if (this.debugCallback) {
          this.debugCallback("re-requesting meters");
        }
      } else {
        const renewMeters = new OSC.Message("/renew", "/meters/2");
        if (this.debugCallback) {
          this.debugCallback("renewing meters");
        }
        this.osc.send(renewMeters);
      }
    }, 2000);
  }

  connect(): void {
    this.osc.open();
  }

  close(): void {
    this.osc.close();
  }

  muteChannel(channelName: string): void {
    const channelId = this.channelNameToId[channelName];
    if (channelId === undefined) {
      if (this.errorCallback) {
        this.errorCallback(new Error(`Can't find channel ${channelName}`));
      }
      return;
    }
    const padded = String(channelId).padStart(2, "0");
    const command = new OSC.Message(`/ch/${padded}/mix/on`, 0);
    if (this.debugCallback) {
      this.debugCallback(`Muting ${channelName} (${padded})`);
    }
    this.osc.send(command);
  }

  unmuteChannel(channelName: string): void {
    const channelId = this.channelNameToId[channelName];
    if (channelId === undefined) {
      if (this.errorCallback) {
        this.errorCallback(new Error(`Can't find channel ${channelName}`));
      }
      return;
    }
    const padded = String(channelId).padStart(2, "0");
    const command = new OSC.Message(`/ch/${padded}/mix/on`, 1);
    if (this.debugCallback) {
      this.debugCallback(`Unmuting ${channelName} (${padded})`);
    }
    this.osc.send(command);
  }

  onMeters(callback: (levels: MeterLevels) => void): void {
    this.metersCallback = callback;
  }

  onConnected(callback: (info: string) => void): void {
    this.connectedCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  onDebug(callback: (message: string) => void): void {
    this.debugCallback = callback;
  }

  getChannelNames(): string[] {
    return Object.values(this.channelIdToName);
  }
}
