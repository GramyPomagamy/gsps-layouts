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
  let messageTypes: JSX.Element[] = [];


  function genericMsg(message: string) {
    return <GenericMessage message={message} onEnd={showNextElement} />;
  }

  messageTypes.push(
    genericMsg(
      'Witajcie na kanale&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie</b>!'
    )
  );

  messageTypes.push(
    genericMsg(
      'Dołącz do naszej społeczności na Discordzie na <b class="highlight">gsps.pl/discord</b>!'
    )
  );

  messageTypes.push(
    genericMsg(
      'Więcej o wydarzeniach z serii GSPS możecie się dowiedzieć na <b class="highlight">gsps.pl</b>!'
    )
  );

  messageTypes.push(
    genericMsg(
      'Fundację GSPS możecie wesprzeć na&nbsp;<b class="highlight">gsps.pl/wesprzyj</b>!'
    )
  )

  // TODO make configurable
  if (false) {
    messageTypes.push(<NextRuns onEnd={showNextElement} />);
    messageTypes.push(<Bids onEnd={showNextElement} />);
    messageTypes.push(<Prizes onEnd={showNextElement} />);
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

export default Ticker;
