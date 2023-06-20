import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { RunDataArray } from '../../../../../../nodecg-speedcontrol/src/types/schemas';
import GenericMessage from './ticker/generic-message';
import { useEffect, useState } from 'react';

const TickerContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Ticker = () => {
  const [currentElement, setCurrentElement] = useState<React.JSX.Element | undefined>(undefined);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [runs] = useReplicant<RunDataArray | undefined>('runDataArray', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
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

  useEffect(() => {
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
