import { render } from '../render';
import layoutBg from './img/layouts/3x2-1p.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { RunDataPlayer, RunDataTeam } from '../../../../nodecg-speedcontrol/src/types';
import { Fragment } from 'react';
import ThemeProvider from './components/theme-provider';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
`;

const Info = styled.div`
  width: 373px;
  height: 630px;
  position: fixed;
  top: 396px;
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`;

const Names = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-bottom: 10px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  const getCurrentRelayRunner = (team: RunDataTeam) => {
    let currentRelayRunner: RunDataPlayer | undefined;

    team.players.forEach((player: RunDataPlayer) => {
      if (player.id === team.relayPlayerID) {
        currentRelayRunner = player;
      }
    });
    return currentRelayRunner;
  };

  return (
    <ThemeProvider>
      <LayoutContainer>
        <Info>
          <Names>
            {(() => {
              if (activeRun) {
                if (activeRun.relay) {
                  if (activeRun.teams[0]) {
                    const currentRelayRunner = getCurrentRelayRunner(activeRun.teams[0]);
                    if (currentRelayRunner != undefined) {
                      return (
                        <>
                          <Nameplate player={currentRelayRunner} />
                        </>
                      );
                    } else {
                      return <></>;
                    }
                  } else {
                    return <></>;
                  }
                } else {
                  return (
                    <>
                      {activeRun.teams.map((team) => {
                        return (
                          <Fragment key={team.id}>
                            {team.players.map((player) => {
                              return <Nameplate key={player.name} player={player} />;
                            })}
                          </Fragment>
                        );
                      })}
                    </>
                  );
                }
              } else {
                return <></>;
              }
            })()}

            <Commentators />
            <Reader />
          </Names>

          <RunInfo fontSize={44} />
          <Timer fontSize={64} />
          <MediaBox useTopBorder />
        </Info>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
