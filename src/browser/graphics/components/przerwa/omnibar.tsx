import styled from 'styled-components';
import { useState, useEffect } from 'react';
import GenericMessage from '../omnibar/ticker/generic-message';
import Milestones from '../omnibar/ticker/milestones';
import { useReplicant } from 'use-nodecg';

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
  const [omnibarTextReplicant] = useReplicant<string[]>('omnibarTextList', []);
  const [omnibarEnableBids] = useReplicant<boolean>('omnibarEnableBids', false);
  const [omnibarEnableMilestones] = useReplicant<boolean>('omnibarEnableMilestones', false);
  const [omnibarEnableNextRuns] = useReplicant<boolean>('omnibarEnableNextRuns', false);
  const [omnibarEnablePrizes] = useReplicant<boolean>('omnibarEnablePrizes', false);

  let currentComponentIndex = 0;
  let messageTypes: JSX.Element[] = [];


  function genericMsg(message: string) {
    return <GenericMessage message={message} onEnd={showNextElement} />;
  }
  
  function showNextElement() {
    console.log('SHOWING NEXT MESSAGE');
    currentComponentIndex += 1;
    if (currentComponentIndex >= messageTypes.length) {
      currentComponentIndex = 0;
    }
    setNewElement();
  }

  function setNewElement() {
    setTimestamp(Date.now());
    setCurrentElement(messageTypes[currentComponentIndex]);
  }

  useEffect(() => {
    messageTypes.splice(0, messageTypes.length);
    
    omnibarTextReplicant?.forEach(text => messageTypes.push(genericMsg(text)));

    if(omnibarEnableMilestones) {
      messageTypes.push(<Milestones onEnd={showNextElement} />);
    }
    else if(messageTypes.includes(<Milestones onEnd={showNextElement} />)) {
      messageTypes.splice(messageTypes.indexOf(<Milestones onEnd={showNextElement} />), 1)
    }

    currentComponentIndex = currentComponentIndex > messageTypes.length ? messageTypes.length - 1 : currentComponentIndex
    setNewElement();

  }, [omnibarTextReplicant,
    omnibarEnableBids,
    omnibarEnableMilestones,
    omnibarEnableNextRuns,
    omnibarEnablePrizes]);

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
