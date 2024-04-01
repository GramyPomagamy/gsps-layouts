import styled from 'styled-components';
import { render } from '../render';
import Ticker from './components/omnibar/ticker';
import ThemeProvider from './components/theme-provider';
import { useEffect, useState } from 'react';

const OmnibarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  display: flex;
  justify-content: space-between;
  align-content: space-between;
`;

export const Omnibar = () => {
  return (
    <ThemeProvider>
      <OmnibarContainer>
        <Ticker />
        <Clock />
      </OmnibarContainer>
    </ThemeProvider>
  );
};

const ClockDiv = styled.div`
  font-size: 34px;
  align-self: flex-end;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
  text-align: right;
`;

const Clock = () => {
  const getClockHTML = () => {
    const date_ob = new Date();
    const hours = ('0' + date_ob.getHours()).slice(-2);
    const minutes = ('0' + date_ob.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  };

  const [clock, setClock] = useState(getClockHTML());

  useEffect(() => {
    // update clock every half a second
    setInterval(() => {
      setClock(getClockHTML());
    }, 500);
  }, []);

  return <ClockDiv dangerouslySetInnerHTML={{ __html: clock }} />;
};

render(<Omnibar />);
