import styled from 'styled-components';
import eventLogo from './img/GSPS_PNG.png';
import mainBg from './img/main-background.png';
import { render } from '../render';
import MediaBox from './components/media-box';
import Song from './components/przerwa/song';
import { BreakOmnibar } from './components/przerwa/omnibar';
import NextRuns from './components/przerwa/next-runs';
import { GlobalStyle } from '../global-theme';
import React from 'react';

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
  top: 250px;
  right: 35px;
  border: 4px #5f3ac2 solid;
  border-radius: 8px;
  display: flex;
`;

const EventLogo = styled.img`
  width: 350px;
  position: fixed;
  top: 5px;
  left: 5px;
`;

export const App = () => {
  return (
    <React.StrictMode>
      <GlobalStyle />
      <LayoutContainer>
        <Song />
        <MediaBoxContainer>
          <MediaBox useBreakItem />
        </MediaBoxContainer>
        <EventLogo src={eventLogo} />
        <NextRuns />
      </LayoutContainer>
      <BreakOmnibar />
    </React.StrictMode>
  );
};

render(<App />);
