import { render } from '../render';
import layoutBgWithDonationBar from './img/layouts/4x3-4p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import ThemeProvider from './components/theme-provider';
import DonationBar from './components/donation-bar';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';
import { useEffect, useRef, Fragment } from 'react';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBgWithDonationBar});
  margin: 0;
  padding: 0;
  text-align: center;
`;

const Donations = styled.div`
  position: fixed;
  width: 1920px;
  height: 44px;
  bottom: 0px;
`;

const TimerDiv = styled.div`
  position: fixed;
  top: 100px;
  left: 580px;
  width: 760px;
`;

const RunInfoDiv = styled.div`
  position: fixed;
  top: 10px;
  left: 580px;
  width: 760px;
`;

const Player1Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 435px;
  left: 0px;
  width: 580px;
`;

const Player2Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 435px;
  right: 0px;
  width: 580px;
`;

const Player3Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 925px;
  left: 0px;
  width: 580px;
`;

const Player4Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 925px;
  right: 0px;
  width: 580px;
`;

const MediaBoxDiv = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 675px;
  left: 580px;
  width: 760px;
  height: 290px;
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
  
  const lastSentSources = useRef<Record<string, string>>({});
  const relayState = activeRun?.teams ?.map(team => team.relayPlayerID).join('|');
  
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

  return (
    <ThemeProvider>
      <LayoutContainer>
        <MediaBoxDiv>
          <MediaBox useTopBorder />
          <Commentators />
          <Reader />
        </MediaBoxDiv>
        <Player1Name>
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
        </Player1Name>
        <Player2Name>
          {(() => {
              if (activeRun) {
                if (activeRun.relay) {
                  if (activeRun.teams[1]) {
                    const currentRelayRunner = getCurrentRelayRunner(activeRun.teams[1]);
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
        </Player2Name>
        <Player3Name>
          {(() => {
              if (activeRun) {
                if (activeRun.relay) {
                  if (activeRun.teams[2]) {
                    const currentRelayRunner = getCurrentRelayRunner(activeRun.teams[2]);
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
        </Player3Name>
        <Player4Name>
          {(() => {
              if (activeRun) {
                if (activeRun.relay) {
                  if (activeRun.teams[3]) {
                    const currentRelayRunner = getCurrentRelayRunner(activeRun.teams[3]);
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
        </Player4Name>
        <RunInfoDiv>
          <RunInfo fontSize={48} />
        </RunInfoDiv>
        <TimerDiv>
          <Timer fontSize={80} />
        </TimerDiv>
        <Donations>
          <DonationBar />
        </Donations>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
