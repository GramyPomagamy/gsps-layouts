import { render } from '../render';
import layoutBg from './img/layouts/4x3-2p.png';
import layoutBgWithDonationBar from './img/layouts/4x3-2p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import {
  RunDataActiveRun,
} from 'speedcontrol/src/types/schemas';
import { Fragment } from 'react';
import ThemeProvider from './components/theme-provider';
import DonationBar from './components/donation-bar';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';

const LayoutContainer = styled.div<{ showDonationBar: boolean }>`
  width: 1920px;
  height: 1030px;
  background-image: url(${(props) => (props.showDonationBar ? layoutBgWithDonationBar : layoutBg)});
  margin: 0;
  padding: 0;
  text-align: center;
`;

const BottomLeft = styled.div<{ showDonationBar: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0px;
  top: 722px;
  width: 679px;
  height: ${(props) => (props.showDonationBar ? '256px' : '294px')};
  justify-content: space-between;
`;

const BottomRight = styled.div<{ showDonationBar: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 1242px;
  top: 722px;
  width: 678px;
  height: ${(props) => (props.showDonationBar ? '264px' : '304px')};
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
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [showDonationBar] = useReplicant<boolean>('showDonationBar', true);

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
        <BottomLeft showDonationBar={showDonationBar}>
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

          <RunInfo fontSize={40} />
          <Timer fontSize={56} />
        </BottomLeft>
        <BottomRight showDonationBar={showDonationBar}>
          <MediaBox />
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
