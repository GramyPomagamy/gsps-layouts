import { render } from '../render';
import layoutBg from './img/layouts/3x4-2p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import DonationBar from './components/donation-bar';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import {
  RunDataPlayer,
  RunDataTeam,
  Timer as TimerType,
} from '../../../../nodecg-speedcontrol/src/types';
import { Fragment, useEffect, useState } from 'react';
import ThemeProvider from './components/theme-provider';
import FinishTime from './components/finish-time';

const LayoutContainer = styled.div<{ showDonationBar: boolean }>`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
  text-align: center;
`;

const Info = styled.div<{ showDonationBar: boolean }>`
  width: 439px;
  height: 719px;
  position: fixed;
  top: 0px;
  left: 741px;
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
`;

const Donations = styled.div`
  position: fixed;
  width: 1920px;
  height: 44px;
  bottom: 0px;
  left: 0px;
`;

const Team1FinishTime = styled.div`
  position: fixed;
  top: 685px;
  left: 589px;
`;

const Team2FinishTime = styled.div`
  position: fixed;
  top: 0px;
  right: 589px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [showDonationBar] = useReplicant<boolean>('showDonationBar', true);
  const [timer] = useReplicant<TimerType | undefined>('timer', undefined, {
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

  const [placements, setPlacements] = useState<
    {
      place: number;
      placementData: [
        string,
        {
          time: string;
          state: 'forfeit' | 'completed';
          milliseconds: number;
          timestamp: number;
        }
      ];
    }[]
  >([]);

  function team1Placement() {
    let place = 1;
    if (placements.length > 0) {
      placements.forEach((placement) => {
        if (placement.placementData[0] === activeRun!.teams[0]!.id) {
          place = placement.place;
        }
      });
    }
    return place;
  }

  function team2Placement() {
    let place = 1;
    if (placements.length > 0) {
      placements.forEach((placement) => {
        if (placement.placementData[0] === activeRun!.teams[1]!.id) {
          place = placement.place;
        }
      });
    }
    return place;
  }

  useEffect(() => {
    if (typeof timer === 'undefined') return;

    setPlacements(
      Object.entries(timer.teamFinishTimes)
        .sort(([, a], [, b]) => a.milliseconds - b.milliseconds)
        .map((p, i) => ({ place: i + 1, placementData: p }))
    );
  }, [timer]);

  return (
    <ThemeProvider>
      <LayoutContainer showDonationBar={showDonationBar}>
        <Info showDonationBar={showDonationBar}>
          <Names>
            {activeRun && (
              <>
                {activeRun.teams[0] && (
                  <>
                    {activeRun.teams.length === 1 ? (
                      <>
                        {activeRun.teams.map((team) => {
                          return (
                            <Fragment key={team.id}>
                              {team.players.map((player, index) => {
                                if (index % 2 == 0) {
                                  return <Nameplate key={player.name} player={player} />;
                                } else {
                                  return <></>;
                                }
                              })}
                            </Fragment>
                          );
                        })}
                        {activeRun.teams[0].players.length < 5 && <Commentators />}
                      </>
                    ) : (
                      <>
                        {activeRun.teams[0].players.map((player) => {
                          return (
                            <Fragment key={player.id}>
                              <Nameplate key={player.name} player={player} />
                            </Fragment>
                          );
                        })}
                        {activeRun.teams[0].players.length < 5 && <Commentators />}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Names>

          <RunInfo fontSize={50} />
          <Timer fontSize={64} />
          <MediaBox useTopBorder />
          <Names style={{ borderTop: '5px solid #5f3ac2' }}>
            <Reader />
            {activeRun && (
              <>
                {activeRun.teams[1] ? (
                  <>
                    {activeRun.teams[1].players.map((player) => {
                      return (
                        <Fragment key={player.id}>
                          <Nameplate key={player.name} player={player} />
                        </Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <>
                      {activeRun.teams.map((team) => {
                        return (
                          <Fragment key={team.id}>
                            {team.players.map((player, index) => {
                              if (index % 2 != 0) {
                                return <Nameplate key={player.name} player={player} />;
                              } else {
                                return <></>;
                              }
                            })}
                          </Fragment>
                        );
                      })}
                    </>
                  </>
                )}
              </>
            )}
          </Names>
        </Info>
        {activeRun &&
          timer &&
          activeRun.teams[0] &&
          activeRun.teams.length > 1 &&
          timer.teamFinishTimes[activeRun.teams[0].id] != undefined &&
          timer.teamFinishTimes[activeRun.teams[0].id]!.state === 'completed' && (
            <Team1FinishTime>
              <FinishTime
                side="right"
                place={team1Placement()}
                time={timer.teamFinishTimes[activeRun.teams[0].id]!.time}
              />
            </Team1FinishTime>
          )}
        {activeRun &&
          timer &&
          activeRun.teams[1] &&
          timer.teamFinishTimes[activeRun.teams[1].id] != undefined &&
          timer.teamFinishTimes[activeRun.teams[1].id]!.state === 'completed' && (
            <Team2FinishTime>
              <FinishTime
                side="left"
                place={team2Placement()}
                time={timer.teamFinishTimes[activeRun.teams[1].id]!.time}
              />
            </Team2FinishTime>
          )}
        {showDonationBar && (
          <Donations>
            <DonationBar />
          </Donations>
        )}
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
