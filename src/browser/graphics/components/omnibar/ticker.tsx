import styled from 'styled-components';
import GenericMessage from './ticker/generic-message';
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
      'Oglądacie&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie Dzieciom 2024</b>!'
    );
  }

  function charityPromo() {
    return genericMsg(
      'GSPS Dzieciom 2024 wspiera&nbsp;<b class="highlight">Fundację Na Ratunek Dzieciom z Chorobą Nowotworową</b>!'
    );
  }

  function donationURL() {
    return genericMsg('Wesprzyj na&nbsp;<b class="highlight">gsps.pl/wesprzyj</b>!');
  }

  function gspsAbout() {
    return genericMsg(
      'Więcej o wydarzeniach z serii GSPS możecie się dowiedzieć na <b class="highlight">gsps.pl</b>!'
    );
  }

  const messageTypes = [gspsPromo(), charityPromo(), donationURL(), gspsAbout()];

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
