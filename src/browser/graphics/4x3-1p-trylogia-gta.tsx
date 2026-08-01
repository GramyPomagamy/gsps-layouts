import { useReplicant } from 'use-nodecg';
import { render } from '../render';
import styled from 'styled-components';
import { GtaTimer as TimerType } from '../../types/generated';
import DonationBar from './components/donation-bar';
import { Carousel } from './components/gta-trylogia/carousel';
import { PlayerInfo } from './components/gta-trylogia/player-info';
import { GameInfo } from './components/gta-trylogia/game-info';
import ThemeProvider from './components/theme-provider';
import layoutBgWithDonationBar from './img/layouts/4x3-1p-donationbar.png';
import layoutBg from './img/layouts/4x3-1p.png';
import Reader from './components/reader';

const LayoutContainer = styled.div<{ showDonationBar: boolean }>`
  width: 1920px;
  height: 1030px;
  background-image: url(${(props) => (props.showDonationBar ? layoutBgWithDonationBar : layoutBg)});
  margin: 0;
  padding: 0;
`;

const Info = styled.div`
  width: 603px;
  height: 630px;
  position: fixed;
  top: 396px;
  text-align: center;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const Timer = styled.div`
  color: white;
  font-size: 72px;
  font-family: 'Bebas Neue';
  width: 100%;
  height: 80px;
`;

const Donations = styled.div`
  position: fixed;
  width: 1313px;
  height: 44px;
  bottom: 0px;
  left: 607px;
`;

const App = () => {
  const [timer] = useReplicant<TimerType | undefined>('gtaTimer', undefined);
  const [showDonationBar] = useReplicant<boolean>('showDonationBar', true);

  return (
    <ThemeProvider>
      <LayoutContainer showDonationBar={showDonationBar}>
        <Info>
          <PlayerInfo />
          <GameInfo />
          <Timer className="shadow">{timer && <span>{timer.time}</span>}</Timer>
          <Carousel />
        </Info>
        <Donations>
          <DonationBar />
        </Donations>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
