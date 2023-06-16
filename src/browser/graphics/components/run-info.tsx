import { useReplicant } from '../../../use-replicant';
import { SpeedcontrolNodecgInstance } from '../../../types/speedcontrol';
import styled from 'styled-components';
import { AutoTextSize } from 'auto-text-size';

const activeRunRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);

const GameInfoContainer = styled.div<{ size: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: ${(props) => props.size}px;
  margin-left: 3px;
  margin-right: 3px;
  text-align: center;
  overflow: hidden;
`;

const Game = styled.span`
  font-weight: 700;
  margin-bottom: 10px;
`;
const Category = styled.span`
  font-size: 0.7em;
  font-weight: 500;
`;

const RunInfo = ({ fontSize }: { fontSize: number }) => {
  const [activeRun] = useReplicant(activeRunRep);

  return (
    <GameInfoContainer size={fontSize} className="shadow">
      {activeRun && (
        <>
          <Game>
            <AutoTextSize
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
              maxFontSizePx={fontSize}
              mode="box">
              {activeRun.game}
            </AutoTextSize>
          </Game>
          <Category>
            <AutoTextSize
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
              maxFontSizePx={fontSize * 0.8}
              mode="box">
              {activeRun.category || '?'} - {activeRun.system || '?'}
            </AutoTextSize>
          </Category>
        </>
      )}
    </GameInfoContainer>
  );
};

export default RunInfo;
