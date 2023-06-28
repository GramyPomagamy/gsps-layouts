import { klona } from 'klona/json';
import { NodeCGServer } from './util/nodecg';
import { Asset, LogoCycle, MediaBoxItem } from '../types/custom';

/** Code relating to the media box. */
export const mediaBox = (nodecg: NodeCGServer) => {
  const mediaBoxAssets = nodecg.Replicant<Asset[]>('assets:media-box');
  const mediaBoxBreakAssets = nodecg.Replicant<Asset[]>('assets:media-box-break');
  const currentMediaBoxItem = nodecg.Replicant<MediaBoxItem>('mediaBoxItem');
  const currentMediaBoxBreakItem = nodecg.Replicant<MediaBoxItem>('mediaBoxItemBreak');
  const logoCycles = nodecg.Replicant<LogoCycle[]>('logoCycles', { defaultValue: [] });
  const logoCyclesBreak = nodecg.Replicant<LogoCycle[]>('logoCyclesBreak', { defaultValue: [] });
  
  let currentItemIndex = 0;
  let currentBreakItemIndex = 0;
  let imageTimeout: NodeJS.Timeout;
  let breakImageTimeout: NodeJS.Timeout;

  function showNextMediaBoxItem() {
    clearTimeout(imageTimeout);
    if (mediaBoxAssets.value && mediaBoxAssets.value.length > 0) {
      currentItemIndex++;
      if (currentItemIndex >= mediaBoxAssets.value.length) {
        currentItemIndex = 0;
      }
      const asset = mediaBoxAssets.value[currentItemIndex];
      if (asset && asset.ext) {
        imageTimeout = setTimeout(showNextMediaBoxItem, 5000);
        currentMediaBoxItem.value = {
          asset: klona(asset),
        };
        return;
      }
    }
  }

  function showNextBreakMediaBoxItem() {
    clearTimeout(breakImageTimeout);
    if (mediaBoxBreakAssets.value && mediaBoxBreakAssets.value.length > 0) {
      currentBreakItemIndex++;
      if (currentBreakItemIndex >= mediaBoxBreakAssets.value.length) {
        currentBreakItemIndex = 0;
      }
      const asset = mediaBoxBreakAssets.value[currentBreakItemIndex];
      if (asset && asset.ext) {
        breakImageTimeout = setTimeout(showNextMediaBoxItem, 5000);
        currentMediaBoxBreakItem.value = { asset: klona(asset) };
        return;
      }
    }
  }

  nodecg.listenFor('mediaBox:showNextBreakItem', showNextBreakMediaBoxItem);
  nodecg.listenFor('mediaBox:showNextItem', showNextMediaBoxItem);

  // Set first item on layout bootup
  setTimeout(() => {
    showNextBreakMediaBoxItem();
    showNextMediaBoxItem();
  }, 1000);
};
