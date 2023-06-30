import { RunDataArray } from '../../../nodecg-speedcontrol/src/types';
import { OengusImportStatus } from '../../../nodecg-speedcontrol/src/types/schemas';
import { get } from './util/nodecg';

const nodecg = get();
const oengusImportStatus = nodecg.Replicant<OengusImportStatus>(
  'oengusImportStatus',
  'nodecg-speedcontrol'
);
const runDataArray = nodecg.Replicant<RunDataArray>('runDataArray', 'nodecg-speedcontrol');

const defaultGame = 'Games + Demos';

oengusImportStatus.on('change', (newVal, oldVal) => {
  if (nodecg.bundleConfig.autoUpdateGameAfterImport) {
    if (oldVal && oldVal.importing === true && newVal && newVal.importing === false) {
      runDataArray.value!.forEach((run) => {
        if (run.game) {
          run.gameTwitch =
            typeof run.customData['gameTwitchName'] != 'undefined'
              ? run.customData['gameTwitchName']
              : defaultGame;
        }
      });
    }
  }
});
