import { render } from '../render';
import layoutBgWithDonationBar from './img/layouts/graty.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import MediaBoxElement from './components/media-box';
import Nameplate from './components/nameplate';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import ThemeProvider from './components/theme-provider';
import DonationBar from './components/donation-bar';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBgWithDonationBar});
  margin: 0;
  padding: 0;
`;

const BottomRight = styled.div`
  position: fixed;
  width: 1489px;
  height: 143px;
  left: 433px;
  top: 840px;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
  justify-content: center;
`;

const Donations = styled.div`
  position: fixed;
  width: 1488px;
  height: 44px;
  bottom: 0px;
  right: 0px;
`;

const MediaBox = styled.div`
  position: fixed;
  width: 428px;
  height: 215px;
  bottom: 00px;
  left: 0px;
`;

const Player = styled(Nameplate)`
  flex: 1;
`;

const Player1 = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 202px;
  left: 20px;
  width: 393px;
  height: 40px;
`;

const Player2 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 478px;
  left: 20px;
  width: 393px;
  height: 40px;
`;

const Player3 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 754px;
  left: 20px;
  width: 393px;
  height: 40px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <ThemeProvider>
      <LayoutContainer>
        {activeRun && (
          <>
            {activeRun.teams[0] && activeRun.teams[0].players[0] && (
              <Player1>
                <Player player={activeRun.teams[0].players[0]} />
              </Player1>
            )}
            {activeRun.teams[1] && activeRun.teams[1].players[0] && (
              <Player2>
                <Player player={activeRun.teams[1].players[0]!} />
              </Player2>
            )}
            {activeRun.teams[2] && activeRun.teams[2].players[0] && (
              <Player3>
                <Player player={activeRun.teams[2].players[0]!} />
              </Player3>
            )}
          </>
        )}

        <MediaBox>
          <MediaBoxElement useTopBorder useFullHeight />
        </MediaBox>
        <BottomRight>
          <RunInfo fontSize={56} hideSecondaryGameInfo />
        </BottomRight>
        <Donations>
          <DonationBar />
        </Donations>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
