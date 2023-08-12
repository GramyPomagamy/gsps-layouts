import ThemeProvider from './components/theme-provider';
import { render } from '../render';
import styled from 'styled-components';
import { useListenFor, useReplicant } from 'use-nodecg';
import { Hosterka as HosterkaType } from 'src/types/generated';
import { Bid, Host as HostType, Prize } from 'src/types/custom';
import { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { AutoTextSize } from 'auto-text-size';

export const Pronouns = styled.span`
  font-weight: 400;
  font-size: 0.5em;
  color: #cccccc;
  text-transform: uppercase;
  background-color: #2d1d3c;
  padding: 3px;
  height: 15px;
  margin-left: 8px;
`;

const Host = ({ host }: { host: HostType }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(60, 60, 60, 0.8)',
        width: '400px',
        height: '58px',
        textAlign: 'center',
        border: '4px solid #5f3ac2',
        borderRadius: '4px',
      }}>
      <p
        style={{ fontSize: '30px', marginTop: '10px', overflow: 'hidden', width: '100%' }}
        className="shadow">
        <AutoTextSize
          mode="oneline"
          maxFontSizePx={30}
          style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          {host.name} {host.pronouns && <Pronouns>{host.pronouns}</Pronouns>}
        </AutoTextSize>
      </p>
    </div>
  );
};

const BidPanelContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  max-width: 100%;
  min-width: 20%;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
  line-height: 4px;
  max-height: 230px;
  border: 4px solid #5f3ac2;
  transition: width 0.5s;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 4px;
`;

const BidPanel = () => {
  const [currentBid] = useReplicant<Bid | null>('currentlyShownBid', null);
  const bidRef = useRef(null);

  return (
    <BidPanelContainer>
      <div
        style={{
          width: '100%',
          backgroundColor: '#5f3ac2',
        }}>
        <h2>DOSTĘPNE LICYTACJE</h2>
      </div>
      {currentBid && (
        <>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentBid.id}
              nodeRef={bidRef}
              in
              appear
              classNames="fade"
              timeout={1000}>
              {currentBid.type == 'challenge' ? (
                <span style={{ margin: 10 }} ref={bidRef}>
                  <BidGoal bid={currentBid} />
                </span>
              ) : (
                <span style={{ margin: 10 }} ref={bidRef}>
                  <BidWar bid={currentBid} />
                </span>
              )}
            </CSSTransition>
          </SwitchTransition>
        </>
      )}
    </BidPanelContainer>
  );
};

const BidOptions = styled.div<{ wrap: boolean }>`
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: ${(props) => (props.wrap ? 'row' : 'column')};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'unset')};
  justify-content: center;
  align-content: center;
  text-align: center;
  gap: ${(props) => (props.wrap ? '15px' : '0px')};
  line-height: 0px;
  max-width: 600px;
`;

const BidWar = ({ bid }: { bid: Bid }) => {
  return (
    <div style={{ lineHeight: '8px' }} className="shadow">
      <h2>{bid.game}</h2>
      <h3>{bid.description}</h3>
      <BidOptions wrap={bid.options.length > 6}>
        {bid.options.length > 0 ? (
          <>
            {bid.options.map((option, index) => {
              return (
                <p key={option.id}>
                  {index + 1}. {option.name} - {option.total}
                </p>
              );
            })}
          </>
        ) : (
          <>
            <p>Zasugeruj opcję jako pierwszy!</p>
          </>
        )}
      </BidOptions>
    </div>
  );
};

const BidGoal = ({ bid }: { bid: Bid }) => {
  return (
    <div style={{ lineHeight: '8px' }} className="shadow">
      <h2>{bid.game}</h2>
      <h3>{bid.description}</h3>
      <div>
        <p style={{ fontSize: '20px' }}>
          {bid.total}/{bid.goal}
        </p>
      </div>
    </div>
  );
};

const PrizePanelContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  max-width: 100%;
  min-width: 20%;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
  line-height: 4px;
  max-height: 230px;
  border: 4px solid #5f3ac2;
  transition: width 0.5s;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 4px;
`;

const PrizePanel = () => {
  const [currentPrize] = useReplicant<Prize | null>('currentlyShownPrize', null);
  const prizeRef = useRef(null);

  return (
    <PrizePanelContainer>
      <div style={{ width: '100%', backgroundColor: '#5f3ac2' }}>
        <h2>DOSTĘPNE NAGRODY</h2>
      </div>
      {currentPrize && (
        <>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentPrize.id}
              nodeRef={prizeRef}
              in
              appear
              classNames="fade"
              timeout={1000}>
              <span ref={prizeRef} style={{ lineHeight: '15px' }}>
                <h2>{currentPrize.name}</h2>
                <div style={{ fontSize: '20px' }}>
                  {currentPrize.provided && (
                    <p>Nagroda dostarczona przez: {currentPrize.provided}</p>
                  )}
                  {currentPrize.minimumBid && (
                    <p>Minimalna kwota do wpłacenia: {currentPrize.minimumBid}zł</p>
                  )}
                </div>
              </span>
            </CSSTransition>
          </SwitchTransition>
        </>
      )}
    </PrizePanelContainer>
  );
};

const HosterkaContainer = styled.div`
  width: 1920px;
  height: 1030px;
`;

const NamesContainer = styled.div`
  width: 1350px;
  height: 80px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 750px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PanelContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  margin-top: 750px;
`;

const Hosterka = () => {
  const [hosterka] = useReplicant<HosterkaType | undefined>('hosterka', undefined);
  const [showNames, setShowNames] = useState(false);
  const [showBidsPanel] = useReplicant<boolean>('showBidsPanel', false);
  const [showPrizePanel] = useReplicant<boolean>('showPrizePanel', false);
  const namesRef = useRef(null);

  useListenFor('showNames', () => {
    setShowNames(true);
  });

  useListenFor('hideNames', () => {
    setShowNames(false);
  });

  return (
    <ThemeProvider>
      <HosterkaContainer>
        {hosterka && (
          <CSSTransition
            nodeRef={namesRef}
            in={showNames}
            appear={showNames}
            timeout={1000}
            classNames="fade"
            mountOnEnter
            unmountOnExit>
            <NamesContainer ref={namesRef}>
              {hosterka.hostL.name && <Host host={hosterka.hostL} />}
              {hosterka.hostR.name && <Host host={hosterka.hostR} />}
            </NamesContainer>
          </CSSTransition>
        )}
        <PanelContainer>
          <div>
            {showBidsPanel && <BidPanel />}
            {showPrizePanel && <PrizePanel />}
          </div>
        </PanelContainer>
      </HosterkaContainer>
    </ThemeProvider>
  );
};

render(<Hosterka />);
