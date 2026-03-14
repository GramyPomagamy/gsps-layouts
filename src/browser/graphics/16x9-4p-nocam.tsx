import { render } from '../render';
import layoutBgWithDonationBar from './img/layouts/16x9-4p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun, Timer as TimerType } from 'speedcontrol/src/types/schemas';
import { useEffect, useState } from 'react';
import ThemeProvider from './components/theme-provider';
import DonationBar from './components/donation-bar';
import FinishTime from './components/finish-time';

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
  top: 375px;
  left: 770px;
  width: 380px;
`;

const RunInfoDiv = styled.div`
  position: fixed;
  top: 275px;
  left: 770px;
  width: 380px;
`;

const Player1Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 435px;
  left: 0px;
  width: 770px;
`;

const Player2Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 435px;
  right: 0px;
  width: 770px;
`;

const Player3Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 925px;
  left: 0px;
  width: 770px;
`;

const Player4Name = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 925px;
  right: 0px;
  width: 770px;
`;

const Team1FinishTime = styled.div`
  position: fixed;
  top: 438px;
  left: 614px;
`;

const Team2FinishTime = styled.div`
  position: fixed;
  top: 438px;
  right: 614px;
`;

const Team3FinishTime = styled.div`
  position: fixed;
  top: 930px;
  left: 614px;
`;

const Team4FinishTime = styled.div`
  position: fixed;
  top: 930px;
  right: 614px;
`;

const MediaBoxDiv = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 485px;
  left: 770px;
  width: 380px;
  height: 440px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [timer] = useReplicant<TimerType | undefined>('timer', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
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

  function team3Placement() {
    let place = 1;
    if (placements.length > 0) {
      placements.forEach((placement) => {
        if (placement.placementData[0] === activeRun!.teams[2]!.id) {
          place = placement.place;
        }
      });
    }
    return place;
  }

  function team4Placement() {
    let place = 1;
    if (placements.length > 0) {
      placements.forEach((placement) => {
        if (placement.placementData[0] === activeRun!.teams[3]!.id) {
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
      <LayoutContainer>
        <MediaBoxDiv>
          <MediaBox useTopBorder />
          <Commentators />
          <Reader />
        </MediaBoxDiv>
        <Player1Name>
          {activeRun?.teams[0] && (
            <>
              {activeRun.teams[0].players.map((player) => (
                <Nameplate player={player} />
              ))}
            </>
          )}
        </Player1Name>
        <Player2Name>
          {activeRun?.teams[1] && (
            <>
              {activeRun.teams[1].players.map((player) => (
                <Nameplate player={player} />
              ))}
            </>
          )}
        </Player2Name>
        <Player3Name>
          {activeRun?.teams[2] && (
            <>
              {activeRun.teams[2].players.map((player) => (
                <Nameplate player={player} />
              ))}
            </>
          )}
        </Player3Name>
        <Player4Name>
          {activeRun?.teams[3] && (
            <>
              {activeRun.teams[3].players.map((player) => (
                <Nameplate player={player} />
              ))}
            </>
          )}
        </Player4Name>
        {activeRun &&
          timer &&
          activeRun.teams[0] &&
          activeRun.teams.length > 1 &&
          timer.teamFinishTimes[activeRun.teams[0].id] != undefined &&
          timer.teamFinishTimes[activeRun.teams[0].id]!.state === 'completed' && (
            <Team1FinishTime>
              <FinishTime
                side="left"
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
                side="right"
                place={team2Placement()}
                time={timer.teamFinishTimes[activeRun.teams[1].id]!.time}
              />
            </Team2FinishTime>
          )}

        {activeRun &&
          timer &&
          activeRun.teams[2] &&
          timer.teamFinishTimes[activeRun.teams[2].id] != undefined &&
          timer.teamFinishTimes[activeRun.teams[2].id]!.state === 'completed' && (
            <Team3FinishTime>
              <FinishTime
                side="left"
                place={team3Placement()}
                time={timer.teamFinishTimes[activeRun.teams[2].id]!.time}
              />
            </Team3FinishTime>
          )}
        {activeRun &&
          timer &&
          activeRun.teams[3] &&
          timer.teamFinishTimes[activeRun.teams[3].id] != undefined &&
          timer.teamFinishTimes[activeRun.teams[3].id]!.state === 'completed' && (
            <Team4FinishTime>
              <FinishTime
                side="right"
                place={team4Placement()}
                time={timer.teamFinishTimes[activeRun.teams[3].id]!.time}
              />
            </Team4FinishTime>
          )}

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
