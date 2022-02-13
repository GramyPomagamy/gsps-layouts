import {
  timerReplicant,
  activeRunReplicant,
  obsDataReplicant,
} from './util/replicants';
import { get as nodecg } from './util/nodecg';
import type { NodeCG } from 'nodecg/types/server';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const googleConfig = (nodecg().bundleConfig as Configschema).google;

const sheets = new GoogleSpreadsheet(googleConfig.spreadsheetId);
sheets.loadInfo();
sheets.useServiceAccountAuth({
  client_email: googleConfig.service_email,
  private_key: googleConfig.private_key,
});
const log = new (nodecg() as NodeCG).Logger(
  `${nodecg().bundleName}:highlighter`
);

function makeHighlight() {
  if (googleConfig.enabled) {
    const sheet = sheets.sheetsByTitle['Raw'];
    const timestamp = formatTime(Date.now());
    const timer = timerReplicant.value.time;
    const run = getCurrentGame();
    const scene = obsDataReplicant.value.scene;

    try {
      sheet.addRow([timestamp, run, timer, scene || 'Brak sceny']).then(() => {
        log.info('Highlight wykonany poprawnie');
      });
    } catch (err) {
      log.error(`Błąd przy dodawaniu danych do arkusza: ${err}`);
    }
  } else {
    log.error('Robienie highlightów jest obecnie wyłączone w konfiguracji');
  }
}

function getCurrentGame() {
  let run: string = 'Brak ustawionej gry';
  if (activeRunReplicant.value.game) {
    run = activeRunReplicant.value.game;
  }
  if (activeRunReplicant.value.category) {
    run += ' ' + activeRunReplicant.value.category;
  }
  return run;
}

function formatTime(timestamp: number) {
	const raw = new Date(timestamp);
	const formatted = raw.toISOString();
	return formatted;
}

nodecg().listenFor('makeHighlight', makeHighlight);
