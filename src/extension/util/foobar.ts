import axios from "axios";
import { TaggedLogger } from "./tagged-logger";

type FoobarResponse = {
  player: {
    activeItem: {
      columns: string[];
      duration: number;
      position: number;
    };
  };
};

type SongInfo = {
  displayName: string;
  duration: number;
  position: number;
};

export class FoobarControl {
  address: string;
  log: TaggedLogger;

  constructor(address: string) {
    this.address = address;
    this.log = new TaggedLogger("foobar");
  }

  togglePause() {
    axios.post(`${this.address}/api/player/pause/toggle`).catch((error) => {
      this.log.error("Błąd przy (od)pauzowaniu foobara: " + error.message);
    });
  }

  mute() {
    axios.post(`${this.address}/api/player?isMuted=true`).catch((error) => {
      this.log.error("Błąd przy wyciszaniu foobara: " + error.message);
    });
  }

  unmute() {
    axios.post(`${this.address}/api/player?isMuted=false`).catch((error) => {
      this.log.error("Błąd przy odciszaniu foobara: " + error.message);
    });
  }

  /** Sets the foobar volume in dB. Use the foobar2000 UI for reference on what values to use.
   * @param volume - The volume in dB. 0 is full volume.
   */
  setVolume(volume: number) {
    axios.post(`${this.address}/api/player?volume=${volume}`).catch((error) => {
      this.log.error("Błąd przy ustawianiu głośności: " + error.message);
    });
  }

  async getSongInfo(): Promise<SongInfo> {
    try {
      const playerInfo = await axios.get<FoobarResponse>(
        `${this.address}/api/player?columns=${encodeURIComponent("%artist%,%title%")}`,
      );
      if (
        playerInfo.data.player.activeItem.columns[0] &&
        playerInfo.data.player.activeItem.columns[1]
      ) {
        const displayName = `${playerInfo.data.player.activeItem.columns[0]} - ${playerInfo.data.player.activeItem.columns[1]}`;
        const position = playerInfo.data.player.activeItem.position;
        const duration = playerInfo.data.player.activeItem.duration;
        return { displayName, position, duration };
      } else {
        return { displayName: "Brak piosenki", position: 0, duration: 0 };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.log.error("Błąd otrzymywania piosenki: " + error.message);
      } else {
        this.log.error("Błąd otrzymywania piosenki: " + error);
      }

      return { displayName: "Brak piosenki", position: 0, duration: 0 };
    }
  }
}
