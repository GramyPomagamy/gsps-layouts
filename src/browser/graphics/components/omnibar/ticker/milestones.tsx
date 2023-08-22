import { useLayoutEffect, useRef, useState } from 'react';
import { Milestones as MilestonesType } from 'src/types/custom';
import { Total } from 'src/types/generated';
import styled from 'styled-components';
import gsap from 'gsap';

const MilestonesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-left: 10px;
  width: 100%;
`;

const MilestonesLabel = styled.p`
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

const MilestoneDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  position: absolute;
  left: 125px;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 85%;
`;

const milestones = nodecg.Replicant<MilestonesType>('milestones');
const total = nodecg.Replicant<Total>('total');

const Milestones = ({ onEnd }: { onEnd: () => void }) => {
  const parentRef = useRef(null);
  const labelRef = useRef(null);
  const chevronsRef = useRef(null);
  const chevronRef = useRef(null);
  const milestoneRef = useRef(null);
  const [currentMilestone, setCurrentMilestone] = useState<
    { name: string; amount: number } | undefined
  >(undefined);
  const [totalAmount, setTotal] = useState<Total | undefined>(undefined);

  function getCurrentMilestone() {
    let milestone = null;
    for (let i = 0; i < milestones.value!.length; i++) {
      if (total.value!.raw! <= milestones.value![i]!.amount) {
        milestone = milestones.value![i];
        break;
      }
    }

    return milestone;
  }

  function end() {
    onEnd();
    console.log('Milestones: Finished');
  }

  useLayoutEffect(() => {
    NodeCG.waitForReplicants(milestones, total).then(() => {
      setCurrentMilestone(getCurrentMilestone() || undefined);
      setTotal(total.value);
      if (!getCurrentMilestone()) {
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

          // show milestone
          tl.addLabel('showMilestone');
          tl.to(chevronRef.current, { color: '#5f3ac2', duration: 0.5 }, `showMilestone`);
          tl.to(milestoneRef.current, { opacity: 1, duration: 0.5 }, 'showMilestone');

          // hide prize
          tl.addLabel('hideMilestone', '+=10');
          tl.to(chevronRef.current, { color: 'rgb(60,60,60)', duration: 0.5 }, `hideMilestone`);
          tl.to(milestoneRef.current, { opacity: 0, duration: 0.5 }, 'hideMilestone');

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
    <MilestonesContainer ref={parentRef}>
      <MilestonesLabel ref={labelRef}>CELE</MilestonesLabel>
      <ChevronContainer ref={chevronsRef}>
        <Chevron ref={chevronRef}>►</Chevron>
      </ChevronContainer>
      {currentMilestone && (
        <MilestoneDiv ref={milestoneRef}>
          <div style={{ display: 'flex', alignContent: 'space-between' }}>
            <div>{currentMilestone.name} - </div>
            <div>
              &nbsp;{totalAmount!.raw ? totalAmount!.raw?.toString(0) : 0}/{currentMilestone.amount} zł
            </div>
          </div>
          <div id="progress" style={{ width: '100%' }}>
            <div
              id="background"
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(60, 60, 60, 0.4)',
              }}
            />
            <div
              id="foreground"
              style={{
                marginTop: '-4px',
                width: (totalAmount!.raw! / currentMilestone.amount) * 100,
                height: '4px',
                backgroundColor: 'rgba(60, 60, 60, 0.4)',
              }}
            />
          </div>
        </MilestoneDiv>
      )}
    </MilestonesContainer>
  );
};

export default Milestones;
