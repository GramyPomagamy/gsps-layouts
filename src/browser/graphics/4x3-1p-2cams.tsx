import { render } from '../render';
import layoutBg from './img/layouts/4x3-1p-2cams.png';
import layoutBgWithDonationBar from './img/layouts/4x3-1p-2cams-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import DonationBar from './components/donation-bar';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';
import { Fragment } from 'react';
import ThemeProvider from './components/theme-provider';

const LayoutContainer = styled.div<{ showDonationBar: boolean }>`
  width: 1920px;
  height: 1030px;
  background-image: url(${(props) => (props.showDonationBar ? layoutBgWithDonationBar : layoutBg)});
  margin: 0;
  padding: 0;
`;

const Info = styled.div<{ showDonationBar: boolean }>`
  width: ${(props) => (props.showDonationBar ? '603px' : '543px')};
  height: 536px;
  position: fixed;
  bottom: 0px;
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

const Donations = styled.div`
  position: fixed;
  width: 1313px;
  height: 44px;
  bottom: 0px;
  left: 607px;
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
        <Info showDonationBar={showDonationBar}>
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
