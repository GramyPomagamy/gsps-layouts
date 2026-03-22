import { type Asset } from "@gsps-layouts/types";

export class Videos {
  private _assets: Asset[];
  private _currentVideoIndex: number;
  private _lastVideo: Asset | undefined;

  constructor(
    videoAssets: Asset[] | undefined,
    currentIndex: number,
    lastVideo: Asset | undefined,
  ) {
    if (videoAssets === undefined) {
      videoAssets = [];
    }

    this._assets = videoAssets.slice(0);
    this._lastVideo = lastVideo;
    this._currentVideoIndex = currentIndex;
    this.shuffleVideos();
  }

  public getCurrentIndex(): number {
    return this._currentVideoIndex;
  }

  public getLastPlayedVideo(): Asset | undefined {
    return this._lastVideo;
  }

  public getNextVideo(): Asset | undefined {
    const nextVideo = this._assets[this._currentVideoIndex];
    ++this._currentVideoIndex;
    this._lastVideo = nextVideo;
    if (this._currentVideoIndex >= this._assets.length) {
      this.shuffleVideos();
    }
    return nextVideo;
  }

  public addNewVideo(video: Asset | undefined): void {
    if (video !== undefined) this._assets.push(video);
  }

  private shuffleVideos(): void {
    let currentIndex = this._assets.length;
    //shuffle
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      const tmp = this._assets[currentIndex];
      this._assets[currentIndex] = this._assets[randomIndex] as Asset;
      this._assets[randomIndex] = tmp as Asset;
    }
    //make sure video will not be played 2 times in a row
    if (this._lastVideo !== undefined && this._assets[0] === this._lastVideo) {
      const tmp = this._assets[0];
      this._assets[0] = this._assets[this._assets.length - 1] as Asset;
      this._assets[this._assets.length - 1] = tmp;
    }
    this._currentVideoIndex = 0;
  }
}
