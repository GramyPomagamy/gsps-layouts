import OSC from 'osc-js';
import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';
import { Channel } from 'src/types/custom';

const nodecg = get();

const config = nodecg.bundleConfig.mixer;
const log = new TaggedLogger('mixer');
const channelIdToName = {
  "1": "H1",
  "2": "H2",
  "3": "H3",
  "4": "H4",
  "9": "Host1",
  "10": "Host2",
  "16": "Host3",
  "5": "Gra1",
  "7": "Gra2",
  "11": "Donacje",
};
const channelNameToId = Object.entries(channelIdToName).reduce((acc, [id, name]) => {
  acc[name] = id;
  return acc;
}, {} as Record<string, string>);
const mixerSignalLevels = nodecg.Replicant<{ [key in keyof typeof channelNameToId]: number }>('mixerSignalLevels', {
  defaultValue: Object.keys(channelNameToId).reduce((acc, name) => {
    acc[name] = -Infinity
    return acc;
  }, {"": -Infinity} as Record<string, number>)
});


nodecg.Replicant<{ [key in keyof typeof channelNameToId]: number }>('mixerThresholdLevels', {
  defaultValue: Object.keys(channelNameToId).reduce((acc, name) => {
    acc[name] = -30
    return acc;
  }, {"": +Infinity} as Record<string, number>)
});


let osc : OSC | undefined = undefined;

if (config.enabled) {
  const settings = {
    type: 'udp4',
    open: {
      host: '0.0.0.0',
      port: 41234,
      exclusive: true
    },
    send: {
      host: config.address,
      port: config.port,
    }
  }
  osc = new OSC({ plugin: new OSC.DatagramPlugin(settings) })
  osc.open()

  osc.on("open", function () {
    const xinfo = new OSC.Message("/xinfo")
    osc!.send(xinfo);

    scheduleMeters();
  });

  osc.on('error', (message: any) => {
    log.error(message)
  })

  osc.on("/xinfo", function (message: any) {
    log.info(`Connected to mixer: ${message.args}`);
  })

  osc.on("/meters/2", (message: any) => {
    /* meters come as an array of u8. First there's an i32 that specifies the number of the i16 fields
       that come afterwards. We can skip the first 4 bytes because the protocol limits the payload for us.
       /meters/2 consists of 16 analog inputs, 2 aux inputs, and 18 usb inputs */
    const u8Array = message.args[0];
    const buffer = new DataView(u8Array.buffer, u8Array.byteOffset, u8Array.byteLength);
    let i16Array = [];
    for (let i = 4; i < buffer.byteLength; i += 2) {
        i16Array.push(buffer.getInt16(i, true));
    }
    const analogIn = i16Array.slice(0, 16).map(meterToDb)
    for (const [i, v] of analogIn.entries()) {
      const channelId = (i + 1).toString();
      const inputName = channelIdToName[channelId as keyof typeof channelIdToName] || channelId;
      if (inputName != channelId) {
        mixerSignalLevels.value![inputName as Channel] = v;
      }
    }
  })

  osc.on("*", function (message: any) {
    if (message.address.startsWith("/meters")) {
        return
    }
    log.debug(`catchall: ${message.address} ${message.args}`);
  });

  nodecg.listenFor('intermissionStarted', onIntermission);
}

function onIntermission() {
  const channelsToMute = ['H1', 'H2', 'H3', 'H4', 'Gra1', 'Gra2', 'Host1', 'Host2', 'Host3'];
  for (let channelName of channelsToMute) {
    muteChannel(channelName);
  }
}

function muteChannel(channelName: string) {
  const channelId = channelNameToId[channelName];
  if (channelId == undefined) {
    log.error(`Can't find channel ${channelName}`)
    return;
  }
  const padded = String(channelId).padStart(2, "0")

  // alternatively we could mute via fader on main like:
  // const command = new OSC.Message(`/ch/${padded}/mix/fader`, 0)

  const command = new OSC.Message(`/ch/${padded}/mix/on`, 0)
  log.debug(`Muting ${channelName} (${padded})`)
  osc!.send(command);
}

function meterToDb(v: number): number {
  return v / 256;
}

function scheduleMeters() {
  /* There are multiple "meters" levels available, see "X AIR Remote Control Protocol.pdf"
     on our drive https://drive.google.com/drive/folders/1Pmsiciq8zUkp-SP54CvPH52esTP2x7Id
     for details. `/meters/2` gives us information about input signal levels for all channels.
     Each activation of `/meters` command will result in 200 responses from the mixer.
     We have to use the undocumented `/renew` to reset the counter on the device.
     X AIR Edit does that roughly every 1 second, but that seems excessive. */

  const meters = new OSC.Message("/meters", "/meters/2")
  osc!.send(meters);

  setInterval(() => {
      const renewMeters = new OSC.Message("/renew", "/meters/2")
      log.debug("renewing meters")
      osc!.send(renewMeters);
  }, 2000)
}

// TODO add a way to manually retrigger /meters/ in case udp drops the packet? button in panel? would we have to cancel the /renew?
