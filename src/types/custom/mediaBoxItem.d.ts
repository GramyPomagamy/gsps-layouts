import { Asset } from '.';

export type MediaBoxItem = {
  type: 'video' | 'image';
  asset: Asset;
  timeout?: number;
};
