import styled from 'styled-components';
import eventLogo from './img/logo_gsps_2023.png';
import mainBg from './img/gradient_transparent.png';
import { render } from '../render';
import MediaBox from './components/media-box';
import Song from './components/przerwa/song';
import { BreakOmnibar } from './components/przerwa/omnibar';
import NextRuns from './components/przerwa/next-runs';
import ThemeProvider from './components/theme-provider';
import BreakTicker from './components/przerwa/ticker';
import Total from './components/przerwa/total';

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
  height: 650px;
  position: fixed;
  bottom: 100px;
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

export const App = () => {
  return (
    <ThemeProvider>
      <LayoutContainer>
        <Song />
        <MediaBoxContainer>
          <MediaBox useBreakItem />
        </MediaBoxContainer>
        <EventLogo src={eventLogo} />
        <NextRuns />
      </LayoutContainer>
      <BreakOmnibar />
      <BreakTicker />
      <Total />
    </ThemeProvider>
  );
};

render(<App />);
