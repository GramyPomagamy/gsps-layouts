import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { TaggedLogger } from './util/tagged-logger';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import fs from 'fs';
import { stringify } from 'csv-stringify';
import path from 'path';

const log = new TaggedLogger('VoD Timestamp');
const config = (nodecg().bundleConfig as Configschema).obs;

nodecg().listenFor(
  'createVoDTimeStamp',
  ({ timestamp, run, recordingName }) => {
    if (config.timestamps?.enabled) {
      createVoDTimeStamp(timestamp, run, recordingName);
    }
  }
);

function createVoDTimeStamp(
  timestamp: number,
  run: RunDataActiveRun,
  recordingName: string
) {
  const fileName = getFileName(recordingName) + '.csv';
  const path = getDirectory(recordingName) + '\\' + fileName;

  if (run && run.game) {
    stringify(
      [
        {
          timestamp,
          game: run.game,
          category: run.category,
          players: formatPlayers(run),
          twitch: formatTwitch(run),
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
          team.name || team.players.map((player) => player.name).join(';')
      )
      .join(';') || 'Bez gracza'
  );
}

function formatTwitch(run: RunDataActiveRun) {
  return run.teams
    .map(
      (team) =>
        team.name ||
        team.players.map((player) => player.social.twitch).join(';')
    )
    .join(';');
}

function getFileName(filePath: string) {
  return path.parse(filePath).name;
}

function getDirectory(filePath: string) {
  return path.parse(filePath).dir;
}
