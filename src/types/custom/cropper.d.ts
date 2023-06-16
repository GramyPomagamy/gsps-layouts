import { WindowInfo } from '../generated';

export interface Cropper {
  url: string;
  name: string;
  sceneName: string;
  sourceName: string;
  windows?: WindowInfo;
}
