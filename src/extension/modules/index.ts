import { type NodeCGServer } from "@gsps-layouts/types";

export function defineModules(nodecg: NodeCGServer) {
  return {
    tracker: {
      name: "Tracker",
      enabled: nodecg.bundleConfig.tracker.enabled,
      config: {
        trackerConfig: nodecg.bundleConfig.tracker,
        socketConfig: nodecg.bundleConfig.donationSocket,
      },
      loadFn: () => import("./tracker.js"),
    },
    genericReplicant: {
      name: "Generic Replicant",
      enabled: nodecg.bundleConfig.genericReplicant.enabled,
      config: nodecg.bundleConfig.genericReplicant,
      loadFn: () => import("./generic-replicant.js"),
    },
    footpedal: {
      name: "Footpedal",
      enabled: nodecg.bundleConfig.footpedal.enabled,
      config: nodecg.bundleConfig.footpedal,
      loadFn: () => import("./footpedal.js"),
    },
    streamDeck: {
      name: "Stream Deck",
      enabled: nodecg.bundleConfig.sd.enabled,
      config: nodecg.bundleConfig.sd,
      loadFn: () => import("./sd.js"),
    },
    milestones: {
      name: "Milestones",
      enabled: nodecg.bundleConfig.milestones.enabled,
      config: nodecg.bundleConfig.milestones,
      loadFn: () => import("./milestones.js"),
    },
    nowPlaying: {
      name: "Now Playing",
      enabled: nodecg.bundleConfig.foobar.enabled,
      config: nodecg.bundleConfig.foobar,
      loadFn: () => import("./nowplaying.js"),
    },
    scheduling: {
      name: "Scheduling",
      enabled: nodecg.bundleConfig.autoUpdateGameAfterImport.enabled,
      config: nodecg.bundleConfig.autoUpdateGameAfterImport,
      loadFn: () => import("./scheduling.js"),
    },
    misc: {
      name: "Misc. Layout Functions",
      enabled: true,
      config: {},
      loadFn: () => import("./misc.js"),
    },
    obs: {
      name: "OBS Control",
      enabled: nodecg.bundleConfig.obs.enabled,
      config: {
        obsConfig: nodecg.bundleConfig.obs,
        foobarConfig: nodecg.bundleConfig.foobar,
        nodecgPort: nodecg.config.port,
      },
      loadFn: () => import("./obs.js"),
    },
    highlighter: {
      name: "Highlighter",
      enabled: nodecg.bundleConfig.highlighter.enabled,
      config: nodecg.bundleConfig.highlighter,
      loadFn: () => import("./highlighter.js"),
    },
    hostCountdown: {
      name: "Host Countdown",
      enabled: true,
      config: {},
      loadFn: () => import("./host-countdown.js"),
    },
    countdown: {
      name: "Countdown",
      enabled: true,
      config: {},
      loadFn: () => import("./countdown.js"),
    },
    featured: {
      name: "Featured Channels",
      enabled: nodecg.bundleConfig.twitchExt.enabled,
      config: nodecg.bundleConfig.twitchExt,
      loadFn: () => import("./featured.js"),
    },
    timestamps: {
      name: "Timestamps",
      enabled: nodecg.bundleConfig.obs.timestamps?.enabled ?? false,
      config: {},
      loadFn: () => import("./timestamps.js"),
    },
    mediaBox: {
      name: "Media Box",
      enabled: true,
      config: {},
      loadFn: () => import("./media-box.js"),
    },
    mixer: {
      name: "Mixer",
      enabled: nodecg.bundleConfig.mixer.enabled,
      config: nodecg.bundleConfig.mixer,
      loadFn: () => import("./mixer.js"),
    },
  };
}
