import styled from 'styled-components';
import gsap from 'gsap';
import { Bids as BidsType } from 'src/types/generated';
import { Bid } from 'src/types/custom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const bidsRep = nodecg.Replicant<BidsType>('currentBids');

const BidsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-left: 10px;
`;

const BidsLabel = styled.p`
  font-size: 24px;
  opacity: 0;
`;

const ChevronContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  gap: 5px;
  width: 100px;
  text-align: center;
`;

const Chevron = styled.span`
  height: 100%;
  margin: 0;
  font-size: 28px;
  opacity: 0;
`;

const Bids = ({ onEnd }: { onEnd: () => void }) => {
  const [nextBids, setNextBids] = useState<BidsType | undefined>([]);
  const parentRef = useRef(null);
  const labelRef = useRef(null);
  const chevronContainerRef = useRef(null);
  const chevronsRef = useRef<HTMLSpanElement[]>([]);
  const bidsRef = useRef<HTMLDivElement[]>([]);

  function getNextBids() {
    if (!bidsRep.value) return;

    return bidsRep.value.slice(0, 3);
  }

  function end() {
    console.log(`Bids: Finished`);
    onEnd();
  }

  useLayoutEffect(() => {
    console.log('bids mounted');
    NodeCG.waitForReplicants(bidsRep).then(() => {
      setNextBids(getNextBids());
      const bids = getNextBids();
      if (!bids || !bids.length) {
        end();
        return;
      }

      const ctx = gsap.context(() => {
        setTimeout(() => {
          // prepare anim

          const tl = gsap.timeline({
            onComplete: () => {
              end();
            },
          });

          // show label
          tl.addLabel('showLabel');
          tl.fromTo(
            labelRef.current,
            { x: '-5px', duration: 1 },
            { x: '0px', duration: 1 },
            'showLabel'
          );
          tl.to(labelRef.current, { opacity: 1, duration: 1 }, 'showLabel');

          // show chevrons one by one
          for (let index = 0; index < bids.length; index++) {
            tl.to(chevronsRef.current[index]!, { opacity: 1, duration: 0.5 }, '-=0.3');
          }

          for (let index = 0; index < bids.length; index++) {
            // show each bid
            tl.addLabel(`show-${bids[index]!.id}`);
            tl.to(
              chevronsRef.current[index]!,
              { color: '#5f3ac2', duration: 0.5 },
              `show-${bids[index]!.id}`
            );
            tl.to(
              bidsRef.current[index]!,
              { opacity: 1, duration: 0.5 },
              `show-${bids[index]!.id}`
            );

            // hide each bid
            tl.addLabel(`hide-${bids[index]!.id}`, '+=6');
            tl.to(
              chevronsRef.current[index]!,
              { color: 'rgb(60, 60, 60)', duration: 0.5 },
              `hide-${bids[index]!.id}`
            );
            tl.to(
              bidsRef.current[index]!,
              { opacity: 0, duration: 0.5 },
              `hide-${bids[index]!.id}`
            );
          }

          // hide chevrons one by one
          for (let index = 0; index < bids.length; index++) {
            tl.to(chevronsRef.current[index]!, { opacity: 0, duration: 0.5 }, '-=0.3');
          }

          // hide label
          tl.addLabel('hideLabel');
          tl.to(labelRef.current, { opacity: 0, duration: 1 }, 'hideLabel');
          tl.to(labelRef.current, { x: '-5px', duration: 1 }, 'hideLabel');
        }, 200);
      });

      return () => ctx.revert();
    });
  }, []);

  useEffect(() => {
    chevronsRef.current = chevronsRef.current.slice(0, nextBids?.length);
  }, [nextBids]);

  return (
    <BidsContainer ref={parentRef}>
      <BidsLabel ref={labelRef}>LICYTACJE</BidsLabel>
      <ChevronContainer ref={chevronContainerRef}>
        {nextBids && (
          <>
            {nextBids.map((bid, index) => {
              return (
                <Chevron key={bid.id} ref={(el) => (chevronsRef.current[index] = el!)}>
                  ►
                </Chevron>
              );
            })}
          </>
        )}
      </ChevronContainer>
      {nextBids && (
        <>
          {nextBids.map((bid, index) => {
            if (bid.type == 'choice') {
              return (
                <div
                  className="bid"
                  style={{ opacity: 0 }}
                  ref={(el) => (bidsRef.current[index] = el!)}
                  key={bid.id}>
                  <BidWar bid={bid} />
                </div>
              );
            } else {
              return (
                <div
                  className="bid"
                  style={{ opacity: 0 }}
                  ref={(el) => (bidsRef.current[index] = el!)}
                  key={bid.id}>
                  <BidGoal bid={bid} />
                </div>
              );
            }
          })}
        </>
      )}
    </BidsContainer>
  );
};

export default Bids;

const BidContainer = styled.div`
  display: flex;
  font-size: 20px;
  position: absolute;
  left: 270px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 0px;
  width: 1450px;
  gap: 15px;
`;

const BidName = styled.div`
  display: flex;
  flex-direction: column;
`;

const BidOptions = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 8px;
  margin-left: 20px;
`;

const BidWar = ({ bid }: { bid: Bid }) => {
  return (
    <BidContainer>
      <BidName>
        <span>{bid.game}</span>
        <span>{bid.name}</span>
      </BidName>
      <BidOptions>
        {bid.options.length ? (
          <>
            {bid.options.map((option, index) => {
              return (
                <BidOption
                  progress={option.rawTotal == 0 ? 0 : (option.rawTotal / bid.rawTotal) * 100}
                  option={option}
                  index={index + 1}
                  winning={index === 0 && option.rawTotal != 0}
                  key={option.id}
                />
              );
            })}
          </>
        ) : bid.allowUserOptions ? (
          <>Wpłać jako pierwszy na tą licytację!</>
        ) : (
          <></>
        )}
      </BidOptions>
    </BidContainer>
  );
};

const BidOption = ({
  option,
  index,
  winning,
  progress,
}: {
  option: {
    id: number;
    parent: number;
    name: string;
    description: string;
    total: string;
    rawTotal: number;
    speedrun: number;
  };
  index: number;
  winning: boolean;
  progress: number;
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '24px' }}>
        {index}. {option.description} - {option.rawTotal} PLN
      </div>
      <div>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(60, 60, 60, 0.4)',
          }}
        />
        <div
          style={{
            marginTop: '-4px',
            width: `${progress}%`,
            height: '4px',
            backgroundColor: winning ? '#5f3ac2' : 'rgba(60, 60, 60)',
          }}
        />
      </div>
    </div>
  );
};

const BidGoal = ({ bid }: { bid: Bid }) => {
  return (
    <BidContainer>
      <BidName>
        <div>{bid.game}</div>
        <div>{bid.name}</div>
      </BidName>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '8px',
          marginLeft: '25px',
          width: '100%',
        }}>
        <div style={{ fontSize: '24px', textAlign: 'right' }}>
          {bid.rawTotal} / {bid.rawGoal} PLN
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: 'rgba(60, 60, 60, 0.4)',
          }}
        />
        <div
          style={{
            marginTop: '-4px',
            width: `${(bid.rawTotal / bid.rawGoal!) * 100}%`,
            height: '4px',
            backgroundColor: 'rgba(60, 60, 60)',
          }}
        />
      </div>
    </BidContainer>
  );
};
