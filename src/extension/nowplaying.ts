'use strict';

import { get } from './util/nodecg';
import FoobarControl from './foobar';
import { Song, SongProgress } from 'src/types/generated';

const nodecg = get();
const config = nodecg.bundleConfig.foobar;
const foobar = new FoobarControl(config.address!);
const songReplicant = nodecg.Replicant<Song>('song');
const songProgressReplicant = nodecg.Replicant<SongProgress>('songProgress', {defaultValue: {duration: 0, position: 0}});

async function GetSong() {
  if (config.enabled) {
    const [displayName, postion, duration] = await foobar.getSongInfo();

    songReplicant.value = displayName;
    songProgressReplicant.value.position = postion;
    songProgressReplicant.value.duration = duration;
  }
}

setInterval(GetSong, 500);
