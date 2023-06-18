import { klona } from 'klona/json';
import { BundleNodecgInstance } from './util/nodecg';

/** Code relating to the media box. */
export const mediaBox = (nodecg: BundleNodecgInstance) => {
  const mediaBoxAssets = nodecg.Replicant('assets:media-box');
  const mediaBoxBreakAssets = nodecg.Replicant('assets:media-box-break');
  const currentMediaBoxItem = nodecg.Replicant('mediaBoxItem');
  const currentMediaBoxBreakItem = nodecg.Replicant('mediaBoxItemBreak');
  let currentItemIndex = 0;
  let currentBreakItemIndex = 0;

  function showNextMediaBoxItem() {
    if (mediaBoxAssets.value && mediaBoxAssets.value.length > 0) {
      console.log('setting item');
      currentItemIndex++;
      if (currentItemIndex >= mediaBoxAssets.value.length) {
        currentBreakItemIndex = 0;
      }
      console.log(currentItemIndex);
      const asset = mediaBoxAssets.value[currentItemIndex];
      console.log(asset);
      if (asset && asset.ext) {
        console.log('asset found: ', asset);
        const isVideo = asset.ext.includes('mp4' || 'MP4');
        currentMediaBoxItem.value = {
          type: isVideo ? 'video' : 'image',
          asset: klona(asset),
        };
        return;
      }
    }
  }

  function showNextBreakMediaBoxItem() {
    if (mediaBoxBreakAssets.value && mediaBoxBreakAssets.value.length > 0) {
      console.log('setting break item');
      currentBreakItemIndex++;
      if (currentBreakItemIndex >= mediaBoxBreakAssets.value.length) {
        currentBreakItemIndex = 0;
      }
      const asset = mediaBoxBreakAssets.value[currentBreakItemIndex];
      if (asset && asset.ext) {
        console.log('asset found: ', asset);
        const isVideo = asset.ext.includes('mp4' || 'MP4');
        currentMediaBoxBreakItem.value = {
          type: isVideo ? 'video' : 'image',
          asset: klona(asset),
        };
        return;
      }
    }
  }

  nodecg.listenFor('mediaBox:showNextBreakItem', () => {
    showNextBreakMediaBoxItem();
  });

  nodecg.listenFor('mediaBox:showNextItem', () => {
    showNextMediaBoxItem();
  });
};
