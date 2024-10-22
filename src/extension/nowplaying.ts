'use strict';

import { get } from './util/nodecg';
import FoobarControl from './foobar';
import { Song } from 'src/types/generated';

const nodecg = get();
const config = nodecg.bundleConfig.foobar;
const foobar = new FoobarControl(config.address!);
const songReplicant = nodecg.Replicant<Song>('song');

async function GetSong() {
  if (config.enabled) {
    songReplicant.value = await foobar.getSong();
  } else {
    songReplicant.value = '';
  }
}

setInterval(GetSong, 3000);
