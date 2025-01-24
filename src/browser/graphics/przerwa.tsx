import styled from 'styled-components';
import eventLogo from './img/gsps_2024_logo.png';
import mainBg from './img/gradient_transparent.png';
import { render } from '../render';
import MediaBox from './components/media-box';
import Song from './components/przerwa/song';
import Host from './components/przerwa/host';
import { BreakOmnibar } from './components/przerwa/omnibar';
import NextRuns from './components/przerwa/next-runs';
import ThemeProvider from './components/theme-provider';
import BreakTicker from './components/przerwa/ticker';
import Total from './components/przerwa/total';
import DonationBar from './components/donation-bar';
import { useReplicant } from 'use-nodecg';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1026px;
  background-image: url(${mainBg});
  margin: 0;
  padding: 0;
  border-bottom: #5f3ac2 4px solid;
`;

const MediaBoxContainer = styled.div`
  width: 650px;
  height: 680px;
  position: fixed;
  bottom: 200px;
  right: 35px;
  border: 4px #5f3ac2 solid;
  border-radius: 8px;
  display: flex;
`;

const EventLogo = styled.img`
  width: 250px;
  position: fixed;
  top: 40px;
  left: 65px;
`;

const Donations = styled.div`
  position: fixed;
  width: 1920px;
  height: 44px;
  bottom: 50px;
`;

export const App = () => {
  const [showDonationBar] = useReplicant<boolean>('showDonationBar', true);

  return (
    <ThemeProvider>
      <LayoutContainer>
        <Song />
        <Host />
        <MediaBoxContainer>
          <MediaBox useBreakItem />
        </MediaBoxContainer>
        <EventLogo src={eventLogo} />
        <NextRuns />
      </LayoutContainer>
      {showDonationBar && (
        <Donations>
          <DonationBar />
        </Donations>)}
      <BreakOmnibar />
      <BreakTicker />
      <Total />
    </ThemeProvider>
  );
};

render(<App />);
