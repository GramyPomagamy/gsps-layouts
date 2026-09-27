import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Player = styled.div`
  background-color: #5f3ac2;
  color: white;
  font-size: 28px;
  padding: 5px 0 5px 0;
  width: 100%;
`;

const Guide = styled.div`
  background-color: #35216b;
  color: white;
  font-size: 24px;
  padding: 5px 0 5px 0;
  width: 100%;
`;

const CommentatorsLabel = styled.div`
  background-color: #5f3ac2;
  width: 30%;
  font-size: 18px;
  padding: 7px 0 5px 0;
`;

const GuideContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const PlayerInfo = () => {
  const [currentPlayer] = useReplicant<string>('gtaCurrentPlayer', '');
  const [currentGuide] = useReplicant<string>('gtaCurrentGuide', '');
  return (
    <Main>
      <Player>
        <span style={{ alignSelf: 'center' }}>{currentPlayer}</span>
      </Player>
      <GuideContainer>
        <CommentatorsLabel>
          <span style={{ alignSelf: 'center' }}>Hołowczyc:</span>
        </CommentatorsLabel>
        <Guide>
          <span>{currentGuide}</span>
        </Guide>
      </GuideContainer>
    </Main>
  );
};
