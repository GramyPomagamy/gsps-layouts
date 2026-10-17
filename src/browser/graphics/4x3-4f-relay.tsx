import { render } from '../render';
import layoutBgWithDonationBar from './img/layouts/4x3-4p-donationbar.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import ThemeProvider from './components/theme-provider';
import DonationBar from './components/donation-bar';
import RelayPlayerGrid from './components/relay-feed';

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
  top: 110px;
  left: 656px;
  width: 608px;
`;

const RunInfoDiv = styled.div`
  position: fixed;
  top: 20px;
  left: 656px;
  width: 608px;
`;

const PlayerName = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 303px;
`;

const Player1Name = styled(PlayerName)`
  top: 450px;
  left: 656px;
`;

const Player2Name = styled(PlayerName)`
  top: 450px;
  right: 656px;
`;

const Player3Name = styled(PlayerName)`
  top: 492px;
  left: 656px;
`;

const Player4Name = styled(PlayerName)`
  top: 492px;
  right: 656px;
`;

const MediaBoxDiv = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 532px;
  left: 656px;
  width: 608px;
  height: 452px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  
  const PlayerContainers = [
  Player1Name,
  Player2Name,
  Player3Name,
  Player4Name,
  ];

  return (
    <ThemeProvider>
      <LayoutContainer>
        <MediaBoxDiv>
          <MediaBox useTopBorder />
          <Commentators />
          <Reader />
        </MediaBoxDiv>
		<RelayPlayerGrid
		  activeRun={activeRun}
		  containers={PlayerContainers}
		/> 
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
