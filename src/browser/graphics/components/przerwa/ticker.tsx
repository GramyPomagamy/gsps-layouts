import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Prizes as PrizesType, Bids as BidsType } from 'src/types/generated';
import { Prize } from 'src/types/custom';
import gsap from 'gsap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import pl from 'dayjs/locale/pl';
import { AutoTextSize } from 'auto-text-size';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const TickerContainer = styled.div`
  position: fixed;
  width: 800px;
  height: 390px;
  bottom: 70px;
  left: 65px;
`;

const BreakTicker = () => {
  const [currentElement, setCurrentElement] = useState<JSX.Element | undefined>(undefined);
  const [timestamp, setTimestamp] = useState(Date.now());
  let currentComponentIndex = 0;

  function prizes() {
    return <Prizes onEnd={showNextElement} />;
  }

  function bids() {
    return <Bids onEnd={showNextElement} />;
  }

  const messageTypes = [bids(), prizes()];

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
    setCurrentElement(messageTypes[0]);
  }, []);

  return (
    <TickerContainer>
      <span key={timestamp}>{currentElement}</span>
    </TickerContainer>
  );
};

export default BreakTicker;

const PrizesContainer = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0;
`;

const PrizeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const PrizeImage = styled.div`
  max-width: 50%;
  min-width: 30%;
  height: 280px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
`;

const PrizeInfo = styled.div`
  text-align: left;
  padding: 6px 0px;
  font-size: 24px;
  position: relative;
`;

const Label = styled.p`
  font-size: 24px;
`;

const prizes = nodecg.Replicant<PrizesType>('prizes');

const Prizes = ({ onEnd }: { onEnd: () => void }) => {
  const [selectedPrize, setSelectedPrize] = useState<Prize | undefined>(undefined);
  const prizeRef = useRef(null);

  function end() {
    console.log('Prizes: Finished');
    onEnd();
  }

  function getPrize() {
    const activePrizes = prizes.value!.filter(
      (prize) =>
        !!prize.startTime &&
        !!prize.endTime &&
        Date.now() > prize.startTime &&
        Date.now() < prize.endTime
    );
    if (activePrizes.length === 1) {
      return activePrizes[0];
    } else if (activePrizes.length > 1) {
      const rand = Math.floor(Math.random() * activePrizes.length);
      return activePrizes[rand];
    } else {
      console.log('Prizes: unmounted');
      end();
      return;
    }
  }

  function formatAmount(amount: number) {
    return `${amount.toFixed(2)}`;
  }

  const etaUntil = () => {
    return selectedPrize!.endTime
      ? dayjs
          .unix(selectedPrize!.endTime / 1000)
          .tz('Europe/Warsaw')
          .locale(pl)
          .fromNow(true)
      : undefined;
  };

  useLayoutEffect(() => {
    NodeCG.waitForReplicants(prizes).then(() => {
      setSelectedPrize(getPrize());

      const prize = getPrize();
      if (!prize) {
        end();
        return;
      }

      const ctx = gsap.context(() => {
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              end();
            },
          });

          // show
          tl.to(prizeRef.current, { opacity: 1, duration: 0.6 });

          // hide
          tl.to(prizeRef.current, { opacity: 0, duration: 0.6 }, '+=5');
        }, 300);
      });

      return () => ctx.revert();
    });
  }, []);

  return (
    <>
      {selectedPrize && (
        <PrizesContainer ref={prizeRef}>
          <Label>NAGRODY</Label>
          <PrizeContainer>
            <PrizeImage>
              {selectedPrize.image && (
                <img
                  src={selectedPrize.image}
                  style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto' }}
                />
              )}
            </PrizeImage>
            <PrizeInfo className="shadow">
              <p style={{ marginTop: '20px', fontSize: '28px' }}>
                <AutoTextSize mode="multiline" maxFontSizePx={48}>
                  {selectedPrize.name}
                </AutoTextSize>
              </p>
              {selectedPrize.provided && (
                <p style={{ marginTop: '15px', fontWeight: 500 }}>
                  Nagroda dostarczona przez: <b>{selectedPrize.provided}</b>
                </p>
              )}
              {selectedPrize.minimumBid && (
                <p style={{ marginTop: '15px', fontWeight: 500 }}>
                  Minimalna suma donacji: <b>{formatAmount(selectedPrize.minimumBid)}zł</b>
                </p>
              )}
              {etaUntil() && (
                <p style={{ marginTop: '15px', fontWeight: 500 }}>
                  Wpłać w ciągu <b>{etaUntil()}</b>, aby mieć szansę wygrać!
                </p>
              )}
            </PrizeInfo>
          </PrizeContainer>
        </PrizesContainer>
      )}
    </>
  );
};

const BidsContainer = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0;
`;

const BidContainer = styled.div`
  position: absolute;
  top: 55px;
  left: 0;
  display: flex;
  flex-direction: column;
  line-height: 0px;
  opacity: 0;
`;

const bidsRep = nodecg.Replicant<BidsType>('currentBids');

const Bids = ({ onEnd }: { onEnd: () => void }) => {
  const [bids, setBids] = useState<BidsType>([]);
  const parentRef = useRef(null);
  const bidsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    NodeCG.waitForReplicants(bidsRep).then(() => {
      setBids(bidsRep.value || []);
      if (!bidsRep.value || !bidsRep.value.length) {
        end();
        return;
      }

      const ctx = gsap.context(() => {
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              end();
            },
          });

          // show main container with label
          tl.to(parentRef.current, { opacity: 1, duration: 0.6 });

          for (let index = 0; index < bidsRep.value!.length; index++) {
            tl.to(bidsRef.current[index]!, { opacity: 1, duration: 0.8 });
            tl.to(bidsRef.current[index]!, { opacity: 0, duration: 0.8 }, '=+8');
          }

          // hide main container with label
          tl.to(parentRef.current, { opacity: 0, duration: 0.6 });
        }, 200);
      });

      return () => ctx.revert();
    });
  }, []);

  function end() {
    console.log('Bids: Finished');
    onEnd();
  }

  const maxDisplayedOptions = 3;

  return (
    <BidsContainer ref={parentRef}>
      <Label>LICYTACJE</Label>
      <div>
        {bids.map((bid, index) => {
          return (
            <BidContainer
              key={bid.id}
              ref={(el) => {
                bidsRef.current[index] = el!;
              }}
              id={`bid-${bid.id}`}>
              <p
                className="shadow"
                style={{ fontSize: '32px', lineHeight: '1.2em', marginBottom: '0px', marginTop: '15px' }}>
                {bid.game}
              </p>
              <p
                className="shadow"
                style={{
                  fontWeight: 500,
                  fontSize: '26px',
                  lineHeight: '0px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {bid.description}
              </p>
              {bid.type === 'choice' ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {bid.options.length == 0 && bid.allowUserOptions ? (
                    <p className="shadow" style={{ fontSize: '28px' }}>
                      Zasugeruj opcję jako pierwszy na
                      <span style={{ color: '#9877f2' }}>&nbsp;gsps.pl/wesprzyj</span>!
                    </p>
                  ) : (
                    <>
                      {bid.options.slice(0, maxDisplayedOptions).map((option, index) => {
                        return (
                          <p
                            className="shadow"
                            style={{
                              fontSize: '24px',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                            key={option.id}>
                            <b>{index + 1}.</b> {option.name} - <b>{option.total}</b>
                          </p>
                        );
                      })}
                      { (bid.options.length > maxDisplayedOptions) ? (
                        <p className="shadow" style={{ fontSize: '28px' }}>
                          ...i inne! Zobacz wszystkie na gsps.pl/wesprzyj!
                        </p>
                      ) : (
                        <p className="shadow" style={{ fontSize: '28px' }}>
                          Przyłącz się na gsps.pl/wesprzyj!
                        </p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="shadow" style={{ fontSize: '36px' }}>
                  {bid.total}/{bid.goal}
                </p>
              )}
            </BidContainer>
          );
        })}
      </div>
    </BidsContainer>
  );
};
