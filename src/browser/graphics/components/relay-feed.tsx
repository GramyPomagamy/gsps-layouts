import { Fragment, useEffect, useRef } from 'react';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';
import Nameplate from './nameplate';

const getCurrentRelayRunner = (team: RunDataTeam): RunDataPlayer | undefined =>
  team.players.find((player) => player.id === team.relayPlayerID);
  
type RelayPlayerGridProps = {
  activeRun: RunDataActiveRun | undefined;
  containers: readonly React.ComponentType<React.PropsWithChildren>[];
};

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

export default function RelayPlayerGrid({activeRun, containers,}: RelayPlayerGridProps) {
  const renderPlayerName = (teamIndex: number): JSX.Element => {
    if (!activeRun) {
      return <></>;
    }

    if (!activeRun.relay) {
      return (
        <>
          {activeRun.teams.map((team) => (
            <Fragment key={team.id}>
              {team.players.map((player) => (
                <Nameplate
                  key={player.id}
                  player={player}
                />
              ))}
            </Fragment>
          ))}
        </>
      );
    }

    const team = activeRun.teams[teamIndex];

    if (!team) {
      return <></>;
    }

    const currentRelayRunner = getCurrentRelayRunner(team);

    if (!currentRelayRunner) {
      return <></>;
    }
    
	return (
      <Nameplate player={currentRelayRunner}/>
    );
  };

  return (
    <>
      {containers.map(
        (Container, index) => (
          <Container key={index}>
            {renderPlayerName(index)}
          </Container>
        )
      )}
    </>
  );
}
