import needle from 'needle';
import type { NeedleResponse } from 'needle';
import { TaggedLogger } from './util/tagged-logger';

class FoobarControl {
  address: string;
  log: TaggedLogger;

  constructor(address: string) {
    this.address = address;
    this.log = new TaggedLogger('foobar');
  }

  togglePause() {
    needle('post', `${this.address}/api/player/pause/toggle`, {}).catch((error) => {
      this.log.error('Błąd przy (od)pauzowaniu foobara: ' + error.message);
    });
  }

  mute() {
    needle('post', `${this.address}/api/player?isMuted=true`, {}).catch((error) => {
      this.log.error('Błąd przy wyciszaniu foobara: ' + error.message);
    });
  }

  unmute() {
    needle('post', `${this.address}/api/player?isMuted=false`, {}).catch((error) => {
      this.log.error('Błąd przy odciszaniu foobara: ' + error.message);
    });
  }

  /** Sets the foobar volume in dB. Use the foobar2000 UI for reference on what values to use.
   * @param volume - The volume in dB. 0 is full volume.
   */
  setVolume(volume: number) {
    needle('post', `${this.address}/api/player?volume=${volume}`, {}).catch((error) => {
      this.log.error('Błąd przy ustawianiu głośności: ' + error.message)
    })
  }

  async getSongInfo(): Promise<[string, number, number]> {
    try {
      const playerInfo: NeedleResponse = await needle(
        'get',
        `${this.address}/api/player?columns=${encodeURIComponent('%artist%,%title%')}`
      );
      if (
        playerInfo.body.player.activeItem.columns[0] &&
        playerInfo.body.player.activeItem.columns[1]
      ) {
        const displayName = `${playerInfo.body.player.activeItem.columns[0]} - ${playerInfo.body.player.activeItem.columns[1]}`;
        const position = playerInfo.body.player.activeItem.position;
        const duration = playerInfo.body.player.activeItem.duration;
        return [displayName, position, duration];
      } else {
        return ['Brak piosenki', 0, 0];
      }
    } catch (error: any) {
      this.log.error('Błąd otrzymywania piosenki: ' + error.message);
      return ['Brak piosenki', 0, 0];
    }
  }
}

export default FoobarControl;
