import styled from 'styled-components';
import GenericMessage from './ticker/generic-message';
import NextRuns from './ticker/next-runs';
import Bids from './ticker/bids';
import Prizes from './ticker/prizes';
import Milestones from './ticker/milestones';
import { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';

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

    if(omnibarEnableBids) {
      messageTypes.push(<Bids onEnd={showNextElement} />);
    }
    else if(messageTypes.includes(<Bids onEnd={showNextElement} />)) {
      messageTypes.splice(messageTypes.indexOf(<Bids onEnd={showNextElement} />), 1)
    }

    if(omnibarEnableMilestones) {
      messageTypes.push(<Milestones onEnd={showNextElement} />);
    }
    else if(messageTypes.includes(<Milestones onEnd={showNextElement} />)) {
      messageTypes.splice(messageTypes.indexOf(<Milestones onEnd={showNextElement} />), 1)
    }

    if(omnibarEnableNextRuns) {
      messageTypes.push(<NextRuns onEnd={showNextElement} />);
    }
    else if(messageTypes.includes(<NextRuns onEnd={showNextElement} />)) {
      messageTypes.splice(messageTypes.indexOf(<NextRuns onEnd={showNextElement} />), 1)
    }

    if(omnibarEnablePrizes) {
      messageTypes.push(<Prizes onEnd={showNextElement} />);
    }
    else if(messageTypes.includes(<Prizes onEnd={showNextElement} />)){
      messageTypes.splice(messageTypes.indexOf(<Prizes onEnd={showNextElement} />), 1)
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

export default Ticker;
