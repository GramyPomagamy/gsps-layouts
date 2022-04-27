"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("./util/replicants");
const nodecg_1 = require("./util/nodecg");
const google_spreadsheet_1 = require("google-spreadsheet");
const tagged_logger_1 = require("./util/tagged-logger");
const googleConfig = (0, nodecg_1.get)().bundleConfig.google;
let sheets;
if (googleConfig.enabled) {
    sheets = new google_spreadsheet_1.GoogleSpreadsheet(googleConfig.spreadsheetId);
    sheets.loadInfo();
    sheets.useServiceAccountAuth({
        client_email: googleConfig.service_email,
        private_key: googleConfig.private_key,
    });
}
const log = new tagged_logger_1.TaggedLogger('highlighter');
function makeHighlight() {
    if (googleConfig.enabled) {
        const sheet = sheets.sheetsByTitle['Raw'];
        const timestamp = formatTime(Date.now());
        const timer = replicants_1.timerReplicant.value.time;
        const run = getCurrentGame();
        const scene = replicants_1.obsDataReplicant.value.scene;
        try {
            sheet.addRow([timestamp, run, timer, scene || 'Brak sceny']).then(() => {
                log.info('Highlight wykonany poprawnie');
            });
        }
        catch (err) {
            log.error(`Błąd przy dodawaniu danych do arkusza: ${err}`);
        }
    }
    else {
        log.error('Robienie highlightów jest obecnie wyłączone w konfiguracji');
    }
}
function getCurrentGame() {
    let run = 'Brak ustawionej gry';
    if (replicants_1.activeRunReplicant.value.game) {
        run = replicants_1.activeRunReplicant.value.game;
    }
    if (replicants_1.activeRunReplicant.value.category) {
        run += ' ' + replicants_1.activeRunReplicant.value.category;
    }
    return run;
}
function formatTime(timestamp) {
    const raw = new Date(timestamp);
    const formatted = raw.toISOString();
    return formatted;
}
(0, nodecg_1.get)().listenFor('makeHighlight', makeHighlight);
