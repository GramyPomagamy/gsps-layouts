import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { TaggedLogger } from './util/tagged-logger';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import fs from 'fs';
import { stringify } from 'csv-stringify';

const log = new TaggedLogger('VoD Timestamp');
const config = (nodecg().bundleConfig as Configschema).obs;

nodecg().listenFor('createVoDTimeStamp', ({ timestamp, run }) => {
  if (config.timestamps?.enabled) {
    createVoDTimeStamp(timestamp, run);
  }
});

function createVoDTimeStamp(timestamp: number, run: RunDataActiveRun) {
  const date = new Date();
  const fileName =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    '.csv';
  const path = config.timestamps?.csv_folder_path! + '\\' + fileName;

  if (!fs.existsSync(config.timestamps?.csv_folder_path!)) {
    fs.mkdirSync(config.timestamps?.csv_folder_path!, { recursive: true });
  }

  if (run && run.game) {
    stringify(
      [
        {
          timestamp,
          game: run.game,
          category: run.category,
          players: formatPlayers(run),
        },
      ],
      {
        header: false,
      },
      (err, output) => {
        if (err) {
          log.error(`Błąd przy przygotowaniu danych do pliku CSV! ${err}`);
          return;
        } else {
          try {
            fs.appendFileSync(path, output);
            log.info('Zapisano timestamp do pliku CSV');
          } catch (err) {
            log.error(`Błąd przy zapisywaniu pliku CSV! ${err}`);
          }
        }
      }
    );
  } else {
    log.info('Brak obecnej gry!');
  }
}

function formatPlayers(run: RunDataActiveRun) {
  return (
    run.teams
      .map(
        (team) =>
          team.name || team.players.map((player) => player.name).join(', ')
      )
      .join(' vs. ') || 'Bez gracza'
  );
}
