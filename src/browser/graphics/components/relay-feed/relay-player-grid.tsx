import { Fragment } from 'react';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import Nameplate from '../nameplate';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';

const getCurrentRelayRunner = (team: RunDataTeam): RunDataPlayer | undefined =>
  team.players.find((player) => player.id === team.relayPlayerID);

type RelayPlayerGridProps = {
  activeRun: RunDataActiveRun | undefined;
  containers: readonly React.ComponentType<React.PropsWithChildren>[];
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
