import { render } from '../render';
import gspsLogo from './img/GSPS_PNG.png';
import mainBg from './img/main-background.png';
import styled from 'styled-components';
import { useRef } from 'react';
import { useReplicant } from 'use-nodecg';
import { Countdown, CountdownRunning } from 'src/types/generated';
import ThemeProvider from './components/theme-provider';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${mainBg});
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
  height: 80%;
`;

export const Odliczanie = () => {
  const [countdown] = useReplicant<Countdown | undefined>('countdown', undefined);
  const [countdownRunning] = useReplicant<CountdownRunning>('countdownRunning', false);
  const countdownRef = useRef(null);

  return (
    <ThemeProvider>
      <LayoutContainer>
        <LogoDiv>
          <Logo src={gspsLogo} />
        </LogoDiv>
        <CountdownDiv ref={countdownRef}>
          {countdown && countdownRunning && <span className="shadow">{countdown.formatted}</span>}
        </CountdownDiv>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<Odliczanie />);
