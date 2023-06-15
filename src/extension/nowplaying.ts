'use strict';

import { NodeCG } from './util/nodecg';
import FoobarControl from './foobar';

/** Code relating to the current song playing in foobar2000. */
export const nowPlaying = (nodecg: NodeCG) => {
  const config = nodecg.bundleConfig.foobar;
  const foobar = new FoobarControl(config.address!, nodecg);
  const songReplicant = nodecg.Replicant('song');

  async function GetSong() {
    if (config.enabled) {
      songReplicant.value = await foobar.getSong();
    }
  }

  setInterval(GetSong, 3000);
};
