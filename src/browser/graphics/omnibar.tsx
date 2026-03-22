import styled from 'styled-components';
import { render } from '../render';
import Ticker from './components/omnibar/ticker';
import Total from './components/omnibar/total';
import Clock from './components/clock';
import ThemeProvider from './components/theme-provider';
import { useReplicant } from 'use-nodecg';
import { useMemo } from 'react';

const OmnibarContainer = styled.div<{ zoom: number }>`
  width: 100%;
  height: 50px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  zoom: ${({ zoom }) => zoom }%;
`;

function parseSearchParams(params: URLSearchParams) {
  const zoom = Number(params.get("zoom")) || 100;

  return {zoom}
}

export const Omnibar = () => {
  const params = useMemo(() => parseSearchParams(new URLSearchParams(window.location.search)), []);
  const { zoom } = params
  const [omnibarEnableTotal] = useReplicant<boolean>('omnibarEnableTotal', true);
  const suffix = omnibarEnableTotal ? <Total /> : <Clock />

  return (
    <ThemeProvider>
      <OmnibarContainer zoom={zoom}>
        <Ticker />
        {suffix}
      </OmnibarContainer>
    </ThemeProvider>
  );
};

render(<Omnibar />);
