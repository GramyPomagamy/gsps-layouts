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

    async getSong(): Promise<string> {
        let song: string = 'Brak piosenki';

        const playerInfo: any = await axios.get(
            `${this.address}/api/player?columns=${encodeURIComponent(
                '%artist%,%title%'
            )}`
        );

        if (
            playerInfo.data.player.activeItem.columns[0] &&
            playerInfo.data.player.activeItem.columns[1]
        ) {
            return `${playerInfo.data.player.activeItem.columns[0]} - ${playerInfo.data.player.activeItem.columns[1]}`;
        } else {
            return 'Brak piosenki';
        }
    }
}

export default FoobarControl;
