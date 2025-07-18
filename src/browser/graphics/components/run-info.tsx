import { useReplicant } from 'use-nodecg';
import styled from 'styled-components';
import { AutoTextSize } from 'auto-text-size';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';

const GameInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 3px;
  margin-right: 3px;
  text-align: center;
`;

const Game = styled.span`
  font-weight: 700;
  margin-bottom: 3px;
`;
const Category = styled.span`
  font-size: 0.7em;
  font-weight: 500;
`;

const RunInfo = ({
  fontSize,
  hideSecondaryGameInfo = false,
}: {
  fontSize: number;
  hideSecondaryGameInfo?: boolean;
}) => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <GameInfoContainer className="shadow">
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
          {!hideSecondaryGameInfo && (
            <Category>
              <AutoTextSize
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                maxFontSizePx={fontSize * 0.7}
                mode="box">
                {activeRun.category || '?'} - {activeRun.system || '?'}
              </AutoTextSize>
            </Category>
          )}
        </>
      )}
    </GameInfoContainer>
  );
};

export default RunInfo;
