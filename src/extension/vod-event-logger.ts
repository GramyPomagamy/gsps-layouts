import { Hosterka, ObsData, Reader } from 'src/types/generated';
import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';
import { RunDataActiveRun } from 'speedcontrol/src/types';
import fs from 'fs';

const nodecg = get();
const logger = new TaggedLogger('VODEventLogger');
const obsDataReplicant = nodecg.Replicant<ObsData>('obsData');
const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);
const hosterkaReplicant = nodecg.Replicant<Hosterka>('hosterka');
const readerReplicant = nodecg.Replicant<Reader>('reader');

function write(json: any) {
  if (!(obsDataReplicant.value?.recording && obsDataReplicant.value?.recordingPath)) {
    logger.warn(
      'Not recording or improperly configured recording path. ' +
        [obsDataReplicant.value?.recording, obsDataReplicant.value?.recordingPath].join(', ')
    );
    return;
  }

  const outputPath = obsDataReplicant.value?.recordingPath + '.jsonl';

  json.vodTimestampMs = obsDataReplicant.value!.recordingDuration;
  json.utcTimestampMs = new Date().getTime();
  const data = JSON.stringify(json);

  logger.debug('Writing', data);
  fs.appendFileSync(outputPath, data + '\n');
}

function getRunInfo(): object {
  if (!activeRunReplicant.value) {
    return {};
  }
  const run = activeRunReplicant.value!;

  return {
    game: run.game,
    category: run.category,
    teams: run.teams,
  };
}

function getHosts(): string[] {
  if (!hosterkaReplicant.value) {
    return [];
  }

  const info = hosterkaReplicant.value!;
  const hosts = [];

  info.hostL.name && hosts.push(info.hostL.name);
  info.hostR.name && hosts.push(info.hostR.name);

  return hosts;
}

nodecg.listenFor('OBSSceneChanged', (data, ack) => {
  try {
    let eventData = {
      type: 'sceneSwitched',
      scene: data.sceneName,
      run: getRunInfo(),
      hosts: getHosts(),
    };
    write(eventData);

    if (ack && !ack.handled) {
      ack(null, { ok: true });
    }
  } catch (err) {
    logger.error('Failed to handle OBSSceneChanged:', err);
    if (ack && !ack.handled) {
      ack(err instanceof Error ? err.message : 'Unknown error');
    }
  }
});

nodecg.listenFor('OBSHostAudioMuted', (data, ack) => {
  try {
    let eventData = {
      type: 'hostMicMuteToggled',
      muted: data.isMuted,
      name: readerReplicant.value && readerReplicant.value.name,
    };
    write(eventData);

    if (ack && !ack.handled) {
      ack(null, { ok: true });
    }
  } catch (err) {
    logger.error('Failed to handle OBSHostAudioMuted:', err);
    if (ack && !ack.handled) {
      ack(err instanceof Error ? err.message : 'Unknown error');
    }
  }
});

nodecg.listenFor('OBSVideoPlayed', (data, ack) => {
  try {
    let eventData = {
      type: 'videoPlayed',
      video: data,
    };
    write(eventData);

    if (ack && !ack.handled) {
      ack(null, { ok: true });
    }
  } catch (err) {
    logger.error('Failed to handle OBSVideoPlayed:', err);
    if (ack && !ack.handled) {
      ack(err instanceof Error ? err.message : 'Unknown error');
    }
  }
});

nodecg.listenFor('setDonationAsRead', (data, ack) => {
  try {
    let eventData = {
      type: 'donationRead',
      donation: data,
    };
    write(eventData);

    if (ack && !ack.handled) {
      ack(null, { ok: true });
    }
  } catch (err) {
    logger.error('Failed to handle setDonationAsRead:', err);
    if (ack && !ack.handled) {
      ack(err instanceof Error ? err.message : 'Unknown error');
    }
  }
});
