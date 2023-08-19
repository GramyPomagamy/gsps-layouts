import { useReplicant } from 'use-nodecg';
import styled from 'styled-components';
import { Timer as TimerType } from '../../../../../nodecg-speedcontrol/src/types/schemas/timer';
import { RunDataActiveRun } from '../../../../../nodecg-speedcontrol/src/types/schemas';

type TimerPhases = 'running' | 'finished' | 'stopped' | 'running';

const timerColors = {
  running: 'white',
  finished: '#ffbd16',
  stopped: '#a5a3a3',
  paused: '#a5a3a3',
};

const TimerContainer = styled.div<{ size: number }>`
  font-size: ${(props) => props.size}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Oswald';
  gap: 0px;
`;

const TimerEl = styled.span<{ phase: string }>`
  margin-bottom: -15px;
  transition: color 0.5s;
  font-weight: 700;
  color: ${(props) => timerColors[props.phase as TimerPhases]};
`;

const Estimate = styled.span`
  font-size: 0.6em;
  font-weight: 500;
`;

export const Timer = ({ fontSize }: { fontSize: number }) => {
  const [timer] = useReplicant<TimerType | undefined>('timer', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  return (
    <>
      {timer && (
        <TimerContainer className="shadow" size={fontSize}>
          <TimerEl phase={timer.state}>{timer.time}</TimerEl>
          {activeRun && <Estimate>EST: {activeRun.estimate || '?'}</Estimate>}
        </TimerContainer>
      )}
    </>
  );
};

export default Timer;
