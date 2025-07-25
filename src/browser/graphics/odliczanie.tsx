import { render } from '../render';
import defaultLogo from './img/GSPS_PNG.png';
import mainBg from './img/main-background.png';
import transparentBg from './img/gradient_transparent.png'
import styled from 'styled-components';
import Song from './components/przerwa/song';
import { useRef } from 'react';
import { useReplicant } from 'use-nodecg';
import { Countdown, CountdownRunning } from 'src/types/generated';
import ThemeProvider from './components/theme-provider';
import { Asset } from 'src/types/custom';


const LayoutContainer = styled.div<{ useTransparentBackgrounds: boolean}>`
  width: 1920px;
  height: 1030px;
  background-image: url(${(props) => (props.useTransparentBackgrounds ? transparentBg : mainBg)});
  margin: 0;
  padding: 0;
`;

const LogoDiv = styled.div`
  position: fixed;
  top: 250px;
  width: 1920px;
  height: 500px;
  text-align: center;
`;

const CountdownDiv = styled.div`
  font-size: 96px;
  width: 100%;
  text-align: center;
  position: fixed;
  top: 750px;
  font-variant-numeric: tabular-nums;
`;

const Logo = styled.img`
  height: 100%;
`;

export const Odliczanie = () => {
  const [countdown] = useReplicant<Countdown | undefined>('countdown', undefined);
  const [countdownRunning] = useReplicant<CountdownRunning>('countdownRunning', false);
  const [useTransparentBackgrounds] = useReplicant<boolean>('useTransparentBackgrounds', true);
  const [logoAssets] = useReplicant<Asset[]>('assets:logo', []);
  const countdownRef = useRef(null);

  let logo = defaultLogo;

  if (logoAssets.length > 0) {
    logo = logoAssets[0]!.url;
  }

  return (
    <ThemeProvider>
      <LayoutContainer useTransparentBackgrounds={useTransparentBackgrounds}>
        <LogoDiv>
          <Logo src={logo} />
        </LogoDiv>
        <CountdownDiv ref={countdownRef}>
          {countdown && countdownRunning && <span className="shadow">{countdown.formatted}</span>}
        </CountdownDiv>
        <Song top={80} left={0} />
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<Odliczanie />);
