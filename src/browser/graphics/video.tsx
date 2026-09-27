import styled from 'styled-components';
import mainBg from './img/layouts/video.png';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from 'speedcontrol/src/types/schemas';
import { formatPlayers } from '../format-players';
import ThemeProvider from './components/theme-provider';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${mainBg});
  margin: 0;
  padding: 0;
`;

const App = () => {
  return (
    <ThemeProvider>
      <LayoutContainer>
        <NextRun />
      </LayoutContainer>
    </ThemeProvider>
  );
};

const NextRunComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 866px;
  left: 226px;
  width: 1477px;
  height: 100px;
`;

const NextRunLabel = styled.div`
  text-align: center;
  color: white;
  font-size: 24px;
`;

const NextRunContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  font-size: 30px;
`;

const Category = styled.div`
  font-size: 26px;
  font-weight: 450;
`

const Players = styled.div`
  font-size: 26px;
  font-weight: 350;
`;

const NextRun = () => {
  const [currentRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <>
      {currentRun && (
        <NextRunComponentContainer className="shadow">
          <NextRunLabel>NASTĘPNIE</NextRunLabel>
          <NextRunContainer className="shadow">
            {currentRun.game && <span style={{maxWidth: '80%'}}>{currentRun.game}</span>}
            {currentRun.estimate && <span>EST: {currentRun.estimate}</span>}
          </NextRunContainer>
          {currentRun.category && <Category>{currentRun.category}</Category>}
          {currentRun.teams.length > 0 && <Players>{formatPlayers(currentRun)}</Players>}
        </NextRunComponentContainer>
      )}
    </>
  );
};

render(<App />);
