'use strict';

import { get as nodecg } from './util/nodecg';
import { songReplicant } from './util/replicants';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import FoobarControl from './foobar';

const config = (nodecg().bundleConfig as Configschema).foobar;
const foobar = new FoobarControl(config.address);

function GetSong() {
    if (config.enabled) {
        songReplicant.value = foobar.getSong();
    }
}

setInterval(GetSong, 1000);
