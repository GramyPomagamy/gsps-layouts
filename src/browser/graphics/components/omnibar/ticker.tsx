import styled from 'styled-components';
import GenericMessage from './ticker/generic-message';
import NextRuns from './ticker/next-runs';
import Bids from './ticker/bids';
import Prizes from './ticker/prizes';
import Milestones from './ticker/milestones';
import { useLayoutEffect, useState } from 'react';

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
      'Oglądacie&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie Dzieciom 2025</b>!'
    );
  }

  function charityPromo() {
    return genericMsg(
      'GSPS Dzieciom 2025 wspiera&nbsp;<b class="highlight">Fundację Na Ratunek Dzieciom z Chorobą Nowotworową</b>!'
    );
  }

  function donationURL() {
    return genericMsg('Wesprzyj na&nbsp;<b class="highlight">gsps.pl/wesprzyj</b>!');
  }

  function sponsor() {
    return genericMsg(
      'Zgarnij kod na&nbsp;<b class="highlight">20 zł do InPost Pay</b> — wpisz na czacie&nbsp;<b class="highlight">!kody</b>'
    );
  }

  function nextRuns() {
    return <NextRuns onEnd={showNextElement} />;
  }

  function bids() {
    return <Bids onEnd={showNextElement} />;
  }

  function prizes() {
    return <Prizes onEnd={showNextElement} />;
  }

  function milestones() {
    return <Milestones onEnd={showNextElement} />;
  }

  const messageTypes = [
    gspsPromo(),
    charityPromo(),
    donationURL(),
    nextRuns(),
    bids(),
    prizes(),
    milestones(),
    sponsor(),
  ];

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

export default Ticker;
