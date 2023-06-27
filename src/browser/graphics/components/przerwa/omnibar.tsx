import styled from 'styled-components';
import { useState, useLayoutEffect } from 'react';
import Total from '../omnibar/total';
import GenericMessage from '../omnibar/ticker/generic-message';

const OmnibarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  display: flex;
  justify-content: space-between;
  align-content: space-between;
`;

export const BreakOmnibar = () => {
  return (
    <OmnibarContainer>
      <Ticker />
      <Total />
    </OmnibarContainer>
  );
};

const TickerContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Ticker = () => {
  const [currentElement, setCurrentElement] = useState<React.JSX.Element | undefined>(undefined);
  const [timestamp, setTimestamp] = useState(Date.now());
  let currentComponentIndex = 0;

  function genericMsg(message: string) {
    return <GenericMessage message={message} onEnd={showNextElement} />;
  }

  function gspsPromo() {
    return genericMsg(
      'Oglądacie&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie 2023</b>!'
    );
  }

  function charityPromo() {
    return genericMsg(
      '<b>GSPS Dzieciom 2023</b>&nbsp;wspiera&nbsp;<b class="highlight">Fundację Na Ratunek Dzieciom z Chorobą Nowotworową</b>!'
    );
  }

  function donationURL() {
    return genericMsg('Wesprzyj na&nbsp;<b class="highlight">gsps.pl/wesprzyj</b>!');
  }

  const messageTypes = [gspsPromo(), charityPromo(), donationURL()];

  function showNextElement() {
    console.log('SHOWING NEXT MESSAGE');
    currentComponentIndex += 1;
    if (currentComponentIndex >= messageTypes.length) {
      currentComponentIndex = 0;
    }
    setTimestamp(Date.now());
    setCurrentElement(messageTypes[currentComponentIndex]);
  }

  useLayoutEffect(() => {
    // set first element on mount
    setCurrentElement(messageTypes[0]);
  }, []);

  return (
    <TickerContainer>
      <span key={timestamp}>{currentElement}</span>
    </TickerContainer>
  );
};

export default BreakOmnibar;
