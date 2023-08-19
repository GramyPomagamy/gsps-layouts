import styled from 'styled-components';
import gsap from 'gsap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import pl from 'dayjs/locale/pl';
import { Prizes as PrizesType } from 'src/types/generated';
import { useLayoutEffect, useRef, useState } from 'react';
import { Prize } from 'src/types/custom';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const prizes = nodecg.Replicant<PrizesType>('prizes');

const PrizesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-left: 10px;
`;

const PrizesLabel = styled.p`
  font-size: 24px;
  opacity: 0;
`;

const ChevronContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const Chevron = styled.span`
  height: 100%;
  margin: 0;
  font-size: 28px;
  opacity: 0;
`;

const PrizeDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  position: absolute;
  left: 180px;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Prizes = ({ onEnd }: { onEnd: () => void }) => {
  const [selectedPrize, setSelectedPrize] = useState<Prize | undefined>(undefined);
  const parentRef = useRef(null);
  const labelRef = useRef(null);
  const chevronContainerRef = useRef(null);
  const chevronRef = useRef(null);
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

          // show label
          tl.addLabel('showLabel');
          tl.fromTo(
            labelRef.current,
            { x: '-5px', duration: 1 },
            { x: '0px', duration: 1 },
            'showLabel'
          );
          tl.to(labelRef.current, { opacity: 1, duration: 1 }, 'showLabel');

          // show chevron
          tl.to(chevronRef.current, { opacity: 1, duration: 0.5 });

          // show prize
          tl.addLabel('showPrize');
          tl.to(chevronRef.current, { color: '#5f3ac2', duration: 0.5 }, `showPrize`);
          tl.to(prizeRef.current, { opacity: 1, duration: 0.5 }, 'showPrize');

          // hide prize
          tl.addLabel('hidePrize', '+=10');
          tl.to(chevronRef.current, { color: 'rgb(60,60,60)', duration: 0.5 }, `hidePrize`);
          tl.to(prizeRef.current, { opacity: 0, duration: 0.5 }, 'hidePrize');

          // hide chevron
          tl.to(chevronRef.current, { opacity: 0, duration: 0.5 });

          // hide label
          tl.addLabel('hideLabel');
          tl.to(labelRef.current, { opacity: 0, duration: 1 }, 'hideLabel');
          tl.to(
            labelRef.current,
            {
              x: '-5px',
              duration: 1,
            },
            'hideLabel'
          );
        }, 200);
      });

      return () => ctx.revert();
    });
  }, []);

  return (
    <PrizesContainer ref={parentRef}>
      <PrizesLabel ref={labelRef}>NAGRODY</PrizesLabel>
      <ChevronContainer ref={chevronContainerRef}>
        <Chevron ref={chevronRef}>►</Chevron>
      </ChevronContainer>
      {selectedPrize && (
        <PrizeDiv ref={prizeRef}>
          <div>{selectedPrize.name}</div>
          <div>
            {selectedPrize.provided && (
              <>
                Nagroda dostarczona przez:
                <span className="highlight"> {selectedPrize.provided}</span>
                {selectedPrize.minimumBid && (
                  <>
                    , minimalna suma donacji:
                    <span className="highlight"> {formatAmount(selectedPrize.minimumBid)} zł</span>
                  </>
                )}
                {etaUntil() && (
                  <>
                    &nbsp;w ciągu <span className="highlight">{etaUntil()}</span>
                  </>
                )}
              </>
            )}
          </div>
        </PrizeDiv>
      )}
    </PrizesContainer>
  );
};

export default Prizes;
