import axios from 'axios';
import { get as nodecg } from './util/nodecg';
import type { NodeCG } from 'nodecg/types/server';
const log = new (nodecg() as NodeCG).Logger(`${nodecg().bundleName}:OBS`);

class FoobarControl {
    address: string;

    constructor(address: string) {
        this.address = address;
    }

    togglePause() {
        axios({
            method: 'POST',
            url: `${this.address}/api/player/pause/toggle`,
            headers: {
                Accept: 'application/json',
            },
        });
    }

    mute() {
        axios({
            method: 'POST',
            url: `${this.address}/api/player?isMuted=true`,
            headers: {
                Accept: 'application/json',
            },
        });
    }

    unmute() {
        axios({
            method: 'POST',
            url: `${this.address}/api/player?isMuted=false`,
            headers: {
                Accept: 'application/json',
            },
        });
    }

    getSong(): string {
        let song: string = 'Brak piosenki';

        axios({
            method: 'GET',
            url: `${this.address}/api/player?columns=${encodeURIComponent(
                '%artist%,%title%'
            )}`,
            responseType: 'json',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response: any) => {
                song = `${response.data.player.activeItem.columns[0]} - ${response.data.player.activeItem.columns[1]}`;
            })
            .catch((err) => {
                log.error(`Błąd w otrzymywaniu piosenki od foobara: ${err}`);
            });

        return song;
    }
}

export default FoobarControl;
