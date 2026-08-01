import { GtaCurrentSplit } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const Game = styled.div`
  display: flex;
  min-height: 0;
  height: 135px;
  flex-direction: column;
  padding-top: 10px;
`;

export const GameInfo = () => {
  const [currentSplit] = useReplicant<GtaCurrentSplit>('gtaCurrentSplit', 'GTA III');
  const [gameCompletion] = useReplicant<string>('completion', '');

  return (
    <div>
      <Game>
        <div style={{ fontSize: '26px', fontWeight: '600' }}>OBECNA GRA</div>
        <div
          style={{
            fontSize: currentSplit === 'GTA: San Andreas' ? '58px' : '58px',
            fontWeight: '700',
            margin: '0',
          }}
          className="shadow">
          {currentSplit}
        </div>
        <div style={{ fontSize: '26px' }}>
          <span style={{ fontWeight: '600' }}>POSTĘP UKOŃCZENIA GRY: </span>
          <span style={{ fontWeight: '700' }}>{gameCompletion}%</span>
        </div>
      </Game>
    </div>
  );
};
