import { useReplicant } from '../../../use-replicant';
import { SpeedcontrolNodecgInstance } from '../../../types/speedcontrol';
import styled from 'styled-components';

type TimerPhases = 'running' | 'finished' | 'stopped' | 'running';

const timerColors = {
  running: 'white',
  finished: '#ffbd16',
  stopped: '#a5a3a3',
  paused: '#a5a3a3',
};

const timerRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'timer',
  'nodecg-speedcontrol'
);
const activeRunRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);

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

const Timer = ({ fontSize }: { fontSize: number }) => {
  const [timer] = useReplicant(timerRep);
  const [activeRun] = useReplicant(activeRunRep);
  return (
    <>
      {timer && (
        <TimerContainer className="shadow" size={fontSize}>
          <TimerEl phase={timer.state}>{timer.time}</TimerEl>
          {activeRun && <Estimate>EST: {activeRun.estimate}</Estimate>}
        </TimerContainer>
      )}
    </>
  );
};

export default Timer;
