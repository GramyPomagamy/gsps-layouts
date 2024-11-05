import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Bids as BidsType } from 'src/types/generated';
import gsap from 'gsap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const bidsRep = nodecg.Replicant<BidsType>('currentBids');

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


  const bids = () => {
    return <Bids onEnd={showNextElement} />;
  };

  function showNextElement() {
    NodeCG.waitForReplicants(bidsRep).then(() => {
      console.log('SHOWING NEXT MESSAGE');
      if (!bidsRep.value!.length) {
        setTimeout(() => {
          showNextElement();
        }, 2000);
        return;
      }
      const messageTypes = [bids()];
      currentComponentIndex = (currentComponentIndex + 1) % messageTypes.length;
      const currentComponent = messageTypes[currentComponentIndex];
      setCurrentElement(currentComponent);
      setTimestamp(Date.now());
    });
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      showNextElement();
    }, 500);
  }, []);

  return (
    <TickerContainer>
      <span key={timestamp}>{currentElement}</span>
    </TickerContainer>
  );
};

export default BreakTicker;

const Label = styled.p`
  font-size: 24px;
`;

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

const Bids = ({ onEnd }: { onEnd: () => void }) => {
  const [bids, setBids] = useState<BidsType>([]);
  const parentRef = useRef(null);
  const bidsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
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
  }, []);

  function end() {
    console.log('Bids: Finished');
    onEnd();
  }

  return (
    <BidsContainer ref={parentRef}>
      <Label>BID WARS</Label>
      <div>
        {bids.map((bid, index) => {
          const description = (bid.description || "").includes("No shortdescription") ? bid.longDescription : bid.description;
          return (
            <BidContainer
              key={bid.id}
              ref={(el) => {
                bidsRef.current[index] = el!;
              }}
              id={`bid-${bid.id}`}>
              <p
                className="shadow"
                style={{ fontSize: '32px', lineHeight: '0px', marginBottom: '15px' }}>
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
                {description}
              </p>
              {bid.type === 'choice' ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {bid.options.length == 0 && bid.allowUserOptions ? (
                    <p className="shadow" style={{ fontSize: '28px' }}>
                      Suggest your option at
                      <span style={{ color: '#9877f2' }}>&nbsp;gsps.pl/ma</span>!
                    </p>
                  ) : (
                    <>
                      {bid.options.slice(0, 4).map((option, index) => {
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
                      {bid.options.length > 4 && (
                        <p className="shadow" style={{ fontSize: '28px' }}>
                          ...and more!
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
