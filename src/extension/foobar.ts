import axios from 'axios';
import { get as nodecg } from './util/nodecg';
import type { NodeCG } from 'nodecg/types/server';
const log = new (nodecg() as NodeCG).Logger(`${nodecg().bundleName}:foobar`);

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
    }).catch((error) => {
      log.error('Błąd przy (od)pauzowaniu foobara: ' + error.message);
    });
  }

  mute() {
    axios({
      method: 'POST',
      url: `${this.address}/api/player?isMuted=true`,
      headers: {
        Accept: 'application/json',
      },
    }).catch((error) => {
      log.error('Błąd przy wyciszaniu foobara: ' + error.message);
    });
  }

  unmute() {
    axios({
      method: 'POST',
      url: `${this.address}/api/player?isMuted=false`,
      headers: {
        Accept: 'application/json',
      },
    }).catch((error) => {
      log.error('Błąd przy odciszaniu foobara: ' + error.message);
    });
  }

  async getSong(): Promise<string> {
    try {
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
    } catch (error: any) {
      log.error('Błąd otrzymywania piosenki: ' + error.message);
      return 'Brak piosenki';
    }
  }
}

export default FoobarControl;
