import styled from 'styled-components';
import mainBg from './img/layouts/video.png';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { formatPlayers } from '../format-players';
import { GlobalStyle } from '../global-theme';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${mainBg});
  margin: 0;
  padding: 0;
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <NextRun />
      </LayoutContainer>
    </>
  );
};

const NextRunComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 866px;
  left: 208px;
  width: 1502px;
  height: 100px;
`;

const NextRunLabel = styled.div`
  text-align: center;
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
`;

const NextRunContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  font-size: 30px;
`;

const NextRunDetails = styled.span`
  font-weight: 500;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const NextRun = () => {
  const [currentRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <>
      {currentRun && (
        <NextRunComponentContainer>
          <NextRunLabel>NADCHODZĄCY RUN</NextRunLabel>
          <NextRunContainer className="shadow">
            {currentRun.game && <span>{currentRun.game}</span>}
            <NextRunDetails>
              {currentRun.category && <span>{currentRun.category} /</span>}
              {currentRun.estimate && <span>EST: {currentRun.estimate} /</span>}
              {currentRun.system && <span>{currentRun.system} /</span>}
              {currentRun.teams.length > 0 && <span>{formatPlayers(currentRun)}</span>}
            </NextRunDetails>
          </NextRunContainer>
        </NextRunComponentContainer>
      )}
    </>
  );
};

render(<App />);
