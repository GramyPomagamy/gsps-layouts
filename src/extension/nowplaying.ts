'use strict'

import { get as nodecg } from './util/nodecg'
import { songReplicant } from './util/replicants'
import fs from 'fs'
import type { Configschema } from '@gsps-layouts/types/schemas/configschema'

const FILE_PATH = (nodecg().bundleConfig as Configschema).nowPlayingFile

function GetSong() {
    let song = fs.readFileSync(FILE_PATH, 'utf8')
    songReplicant.value = song
}

setInterval(GetSong, 500)
