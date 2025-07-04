import styled from 'styled-components';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RunData } from 'speedcontrol/src/types/schemas';
import { ObsData } from 'src/types/generated';
import { timeToRun } from '../../../../time-to-run';
import { formatPlayers } from '../../../../format-players';

const runDataActiveRun = nodecg.Replicant<RunData>('runDataActiveRun', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant<RunData[]>('runDataArray', 'nodecg-speedcontrol');
const obsData = nodecg.Replicant<ObsData>('obsData');
const config = nodecg.bundleConfig.obs;

const NextRunsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-left: 10px;
`;

const NextRunsLabel = styled.p`
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

const Run = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  position: absolute;
  left: 270px;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const NextRuns = ({ onEnd }: { onEnd: () => void }) => {
  const [nextRuns, setNextRuns] = useState<RunData[] | undefined>([]);
  const parentRef = useRef(null);
  const labelRef = useRef(null);
  const chevronContainerRef = useRef(null);
  const chevronsRef = useRef<HTMLSpanElement[]>([]);
  const runsRef = useRef<HTMLDivElement[]>([]);

  async function getNextRuns() {
    if (!runDataArray.value) return undefined;

    const filteredRunArray = runDataArray.value.filter((run) => !run.customData['hideOnStream']);
    const runIndex = findRunIndex(filteredRunArray);
    if (obsData.value && obsData.value.scene) {
      if (obsData.value.scene === (config.scenes!.video || config.scenes!.countdown)) {
        return filteredRunArray.slice(runIndex, runIndex + 3);
      } else {
        return filteredRunArray.slice(runIndex + 1, runIndex + 4);
      }
    } else {
      return filteredRunArray.slice(runIndex + 1, runIndex + 4);
    }
  }

  function findRunIndex(runArray: RunData[]) {
    if (!runDataActiveRun.value || !runDataArray.value || !runArray) {
      return -1;
    } else {
      return runArray.findIndex((run) => run.id === runDataActiveRun.value!.id);
    }
  }

  function end() {
    console.log(`NextRuns: Finished`);
    onEnd();
  }

  useEffect(() => {
    chevronsRef.current = chevronsRef.current.slice(0, nextRuns?.length);
  }, [nextRuns]);

  useLayoutEffect(() => {
    NodeCG.waitForReplicants(runDataActiveRun, runDataArray, obsData).then(async () => {
      setNextRuns(await getNextRuns());
      const runs = await getNextRuns();
      if (!runs || !runs.length) {
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
          for (let index = 0; index < runs.length; index++) {
            tl.to(chevronsRef.current[index]!, { opacity: 1, duration: 0.5 }, '-=0.3');
          }

          for (let index = 0; index < runs.length; index++) {
            // show each run
            tl.addLabel(`showRun-${runs[index]!.id}`);
            tl.to(
              chevronsRef.current[index]!,
              { color: '#5f3ac2', duration: 0.5 },
              `showRun-${runs[index]!.id}`
            );
            tl.to(
              runsRef.current[index]!,
              { opacity: 1, duration: 0.5 },
              `showRun-${runs[index]!.id}`
            );

            // hide each run
            tl.addLabel(`hideRun-${runs[index]!.id}`, '+=6');
            tl.to(
              chevronsRef.current[index]!,
              { color: 'rgb(60, 60, 60)', duration: 0.5 },
              `hideRun-${runs[index]!.id}`
            );
            tl.to(
              runsRef.current[index]!,
              { opacity: 0, duration: 0.5 },
              `hideRun-${runs[index]!.id}`
            );
          }

          // hide chevrons one by one
          for (let index = 0; index < runs.length; index++) {
            tl.to(chevronsRef.current[index]!, { opacity: 0, duration: 0.5 }, '-=0.3');
          }

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
      }, parentRef);

      return () => ctx.revert();
    });
  }, []);

  return (
    <NextRunsContainer ref={parentRef}>
      <NextRunsLabel ref={labelRef}>NASTĘPNIE</NextRunsLabel>
      <ChevronContainer ref={chevronContainerRef}>
        {nextRuns && (
          <>
            {nextRuns.map((run, index) => {
              return (
                <Chevron key={run.id} ref={(el) => (chevronsRef.current[index] = el!)}>
                  ►
                </Chevron>
              );
            })}
          </>
        )}
      </ChevronContainer>
      {nextRuns && (
        <>
          {nextRuns.map((run, index) => {
            return (
              <Run ref={(el) => (runsRef.current[index] = el!)} key={run.id}>
                <div>{timeToRun(run)}</div>
                <div>
                  {run.game} {run.category && <> - {run.category}</>}{' '}
                  {run.teams && run.teams.length > 0 && <> - {formatPlayers(run)}</>}
                </div>
              </Run>
            );
          })}
        </>
      )}
    </NextRunsContainer>
  );
};

export default NextRuns;
