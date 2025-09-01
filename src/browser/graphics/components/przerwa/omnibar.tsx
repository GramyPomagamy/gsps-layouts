import styled from 'styled-components';
import { useState, useLayoutEffect, useEffect } from 'react';
import GenericMessage from '../omnibar/ticker/generic-message';
import Milestones from '../omnibar/ticker/milestones';

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
      <Clock />
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
  let enableMilestones = true; // TODO: make configurable
  let enableCharity = true; // TODO: make configurable
  let messageTypes: JSX.Element[] = [];

  function genericMsg(message: string) {
    return <GenericMessage message={message} onEnd={showNextElement} />;
  }

  messageTypes.push(
    genericMsg(
      'Oglądacie&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie 2025</b>!'
    )
  );

  if (enableCharity) {
    // TODO make the text configurable
    messageTypes.push(
      genericMsg(
        'GSPS 2025 wspiera&nbsp;<b class="highlight">Antydepresyjny Telefon Zaufania Fundacji ITAKA</b>!'
      )
    );
  }

  // TODO: make configurable
  messageTypes.push(
    genericMsg('Wesprzyj na&nbsp;<b class="highlight">gsps.pl/wesprzyj</b>!')
  );

  if (enableMilestones) {
    messageTypes.push(<Milestones onEnd={showNextElement} />);
  }

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

export default BreakOmnibar;
