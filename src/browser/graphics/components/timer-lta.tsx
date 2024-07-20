import { useReplicant } from 'use-nodecg';
import styled from 'styled-components';
import { Countdown } from 'src/types/generated';

const TimerContainer = styled.div<{ size: number }>`
  font-size: ${(props) => props.size}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Bebas Neue';
  gap: 0px;
`;

const TimerEl = styled.span<{ isDone: boolean }>`
  margin-bottom: -15px;
  transition: color 0.5s;
  font-weight: 600;
  color: ${(props) => props.isDone ? '#ffbd16' : 'white'};
`;


export const TimerLTA = ({ fontSize }: { fontSize: number }) => {
  const [timer] = useReplicant<Countdown | undefined>('countdown', undefined);

  return (
    <>
      {timer && (
        <TimerContainer className="shadow" size={fontSize}>
          <TimerEl isDone={timer.raw === 0}>{timer.formatted}</TimerEl>
        </TimerContainer>
      )}
    </>
  );
};

export default TimerLTA;
