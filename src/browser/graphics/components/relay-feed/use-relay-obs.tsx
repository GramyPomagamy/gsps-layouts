import { useEffect, useRef } from 'react';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import { getCurrentRelayRunner } from './get-relay';

export const useRelayOBS = (activeRun: RunDataActiveRun | undefined) => {
  const lastSentSources = useRef<Record<string, string>>({});
  const relayState = activeRun?.teams ?.map((team) => team.relayPlayerID) .join('|');

  useEffect(() => {
    if (!activeRun?.relay) {
      return;
    }

    activeRun.teams.forEach((team, index) => {
      const runner = getCurrentRelayRunner(team);

      if (!runner) {
        return;
      }

      const sceneName = `Multitrack ${index + 1}`;
      const sourceName = runner.name;

      if (lastSentSources.current[sceneName] === sourceName) {
        return;
      }
	  
      lastSentSources.current[sceneName] = sourceName;
      nodecg.sendMessage('show-source', {sceneName, sourceName,});
    });
  }, [relayState]);
};