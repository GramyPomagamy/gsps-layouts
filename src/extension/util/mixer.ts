import EventEmitter from "events";
import OSC from "osc-js";

type MixerOptions = {
  open: {
    exclusive: boolean;
    host: string;
    port: number;
  };
  send: {
    host: string;
    port: number;
  };
  type: string;
};

export class Mixer extends EventEmitter {
  private readonly osc: OSC;

  constructor(options: MixerOptions) {
    super();
    this.osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });

    this.osc.on("open", () => {
      this.osc.send(new OSC.Message("/xinfo"));
    });
  }
}
