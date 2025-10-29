import { render } from '../render';
import layoutBg from './img/layouts/16x9-1p.png';
import layoutBgWithDonationBar from './img/layouts/16x9-1p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import { Timer as TimerEl } from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import { Fragment } from 'react';
import ThemeProvider from './components/theme-provider';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';
import DonationBar from './components/donation-bar';
import { GenericReplicant } from 'src/types/custom/genericReplicant';

const LayoutContainer = styled.div<{ showDonationBar: boolean }>`
  width: 1920px;
  height: 1030px;
  background-image: url(${(props) => (props.showDonationBar ? layoutBgWithDonationBar : layoutBg)});
  margin: 0;
  padding: 0;
`;

const LeftSide = styled.div<{ showDonationBar: boolean }>`
  position: fixed;
  width: ${(props) => (props.showDonationBar ? '557px' : '477px')};
  height: ${(props) => (props.showDonationBar ? '547px' : '587px')};
  top: 439px;
  left: 0px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const BottomRight = styled.div<{ showDonationBar: boolean }>`
  position: fixed;
  width: ${(props) => (props.showDonationBar ? '1357px' : '1539px')};
  height: 213px;
  left: ${(props) => (props.showDonationBar ? '561px' : '481px')};
  top: ${(props) => (props.showDonationBar ? '770px' : '813px')};
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 0.7fr;
  grid-template-rows: 0.8fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
  justify-content: center;
`;

const Run = styled(RunInfo)`
  grid-area: 1 / 1 / 2 / 2;
`;

const Timer = styled(TimerEl)`
  grid-area: 2 / 2 / 2 / 1;
`;

const AchievementsNumberDiv = styled.div`
  grid-area: 1 / 2 / 2 / 3;
  font-size: 2.125rem;
`;

const AchievementsNameFlex = styled.div`
  grid-area: 2 / 2 / 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 2.125rem;
`;


const Donations = styled.div`
  position: fixed;
  width: 1920px;
  height: 44px;
  bottom: 0px;
`;


export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [showDonationBar] = useReplicant<boolean>('showDonationBar', true);
  const [genericReplicant] = useReplicant<GenericReplicant>('genericReplicant', {});

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
      <LayoutContainer showDonationBar={showDonationBar}>
        <LeftSide showDonationBar={showDonationBar}>
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
          <MediaBox />
        </LeftSide>
        <BottomRight showDonationBar={showDonationBar}>
          <Run fontSize={56} hideSecondaryGameInfo={true}/>
          <AchievementsNumberDiv>Postęp: {genericReplicant['number']}</AchievementsNumberDiv>
          <AchievementsNameFlex>
            <div>Ostatnio Zdobyte:</div>
            <div>{genericReplicant['lastAchieved']}</div>
          </AchievementsNameFlex>
          <Timer fontSize={72} />
        </BottomRight>
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
