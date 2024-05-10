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
      'Witajcie na kanale&nbsp;<b class="highlight">Gramy Szybko, Pomagamy Skutecznie</b>!'
    );
  }

  function charityPromo() {
    return genericMsg(
      'Fundację GSPS możecie wesprzeć na&nbsp;<b class="highlight">gsps.pl/fundacja</b>!'
    );
  }

  function discordURL() {
    return genericMsg(
      'Dołącz do naszej społeczności na Discordzie na <b class="highlight">gsps.pl/discord</b>!'
    );
  }

  function gspsAbout() {
    return genericMsg(
      'Więcej o wydarzeniach z serii GSPS możecie się dowiedzieć na <b class="highlight">gsps.pl</b>!'
    );
  }

  const messageTypes = [gspsPromo(), discordURL(), gspsAbout(), charityPromo()];

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
