'use strict';

import { NodeCGServer } from './util/nodecg';
import FoobarControl from './foobar';
import { Song } from 'src/types/generated';

/** Code relating to the current song playing in foobar2000. */
export const nowPlaying = (nodecg: NodeCGServer) => {
  const config = nodecg.bundleConfig.foobar;
  const foobar = new FoobarControl(config.address!, nodecg);
  const songReplicant = nodecg.Replicant<Song>('song');

  async function GetSong() {
    if (config.enabled) {
      songReplicant.value = await foobar.getSong();
    }
  }

  setInterval(GetSong, 3000);
};
