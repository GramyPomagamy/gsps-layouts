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
      loadFn: () => import("./tracker"),
    },
    genericReplicant: {
      name: "Generic Replicant",
      enabled: nodecg.bundleConfig.genericReplicant.enabled,
      config: nodecg.bundleConfig.genericReplicant,
      loadFn: () => import("./generic-replicant"),
    },
    footpedal: {
      name: "Footpedal",
      enabled: nodecg.bundleConfig.footpedal.enabled,
      config: nodecg.bundleConfig.footpedal,
      loadFn: () => import("./footpedal"),
    },
    streamDeck: {
      name: "Stream Deck",
      enabled: nodecg.bundleConfig.sd.enabled,
      config: nodecg.bundleConfig.sd,
      loadFn: () => import("./sd"),
    },
    milestones: {
      name: "Milestones",
      enabled: nodecg.bundleConfig.milestones.enabled,
      config: nodecg.bundleConfig.milestones,
      loadFn: () => import("./milestones"),
    },
    nowPlaying: {
      name: "Now Playing",
      enabled: nodecg.bundleConfig.foobar.enabled,
      config: nodecg.bundleConfig.foobar,
      loadFn: () => import("./nowplaying"),
    },
    scheduling: {
      name: "Scheduling",
      enabled: nodecg.bundleConfig.autoUpdateGameAfterImport.enabled,
      config: nodecg.bundleConfig.autoUpdateGameAfterImport,
      loadFn: () => import("./scheduling"),
    },
    misc: {
      name: "Misc. Layout Functions",
      enabled: true,
      config: {},
      loadFn: () => import("./misc"),
    },
    obs: {
      name: "OBS Control",
      enabled: nodecg.bundleConfig.obs.enabled,
      config: {
        obsConfig: nodecg.bundleConfig.obs,
        foobarConfig: nodecg.bundleConfig.foobar,
        nodecgPort: nodecg.config.port,
      },
      loadFn: () => import("./obs"),
    },
    highlighter: {
      name: "Highlighter",
      enabled: nodecg.bundleConfig.highlighter.enabled,
      config: nodecg.bundleConfig.highlighter,
      loadFn: () => import("./highlighter"),
    },
    hostCountdown: {
      name: "Host Countdown",
      enabled: true,
      config: {},
      loadFn: () => import("./host-countdown"),
    },
    countdown: {
      name: "Countdown",
      enabled: true,
      config: {},
      loadFn: () => import("./countdown"),
    },
    featured: {
      name: "Featured Channels",
      enabled: nodecg.bundleConfig.twitchExt.enabled,
      config: nodecg.bundleConfig.twitchExt,
      loadFn: () => import("./featured"),
    },
    timestamps: {
      name: "Timestamps",
      enabled: nodecg.bundleConfig.obs.timestamps?.enabled ?? false,
      config: {},
      loadFn: () => import("./timestamps"),
    },
    mediaBox: {
      name: "Media Box",
      enabled: true,
      config: {},
      loadFn: () => import("./media-box"),
    },
    mixer: {
      name: "Mixer",
      enabled: nodecg.bundleConfig.mixer.enabled,
      config: nodecg.bundleConfig.mixer,
      loadFn: () => import("./mixer"),
    },
  };
}
