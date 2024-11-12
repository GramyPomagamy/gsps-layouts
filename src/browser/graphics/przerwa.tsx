import styled from 'styled-components';
import eventLogo from './img/GSPS_PNG.png';
import mainBg from './img/main-background.png';
import transparentBg from './img/gradient_transparent.png'
import { render } from '../render';
import MediaBox from './components/media-box';
import Song from './components/przerwa/song';
import { BreakOmnibar } from './components/przerwa/omnibar';
import NextRuns from './components/przerwa/next-runs';
import ThemeProvider from './components/theme-provider';
import { useReplicant } from 'use-nodecg';

const LayoutContainer = styled.div<{ useTransparentBackgrounds: boolean}>`
  width: 1920px;
  height: 1026px;
  background-image: url(${(props) => (props.useTransparentBackgrounds ? transparentBg : mainBg)});
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
  width: 450px;
  position: fixed;
  top: -30px;
  left: 0px;
`;

export const App = () => {
  const [useTransparentBackgrounds] = useReplicant<boolean>('useTransparentBackgrounds', true);

  return (
    <ThemeProvider>
      <LayoutContainer useTransparentBackgrounds={useTransparentBackgrounds}>
        <Song />
        <MediaBoxContainer>
          <MediaBox useBreakItem />
        </MediaBoxContainer>
        <EventLogo src={eventLogo} />
        <NextRuns />
      </LayoutContainer>
      <BreakOmnibar />
    </ThemeProvider>
  );
};

render(<App />);
