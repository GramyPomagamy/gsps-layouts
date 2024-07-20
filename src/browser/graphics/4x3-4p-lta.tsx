import { render } from '../render';
import layoutBg from './img/layouts/4x3-4p.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import TimerLTA from './components/timer-lta';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import ThemeProvider from './components/theme-provider';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
`;

const Info = styled.div`
  left: 632px;
  width: 656px;
  height: 1030px;
  position: fixed;
  top: 0px;
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`;

const Team1 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 471px;
  left: 0px;
  width: 628px;
`;

const Team2 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 471px;
  right: 0px;
  width: 628px;
`;

const Team3 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 4px;
  left: 0px;
  width: 628px;
`;

const Team4 = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 4px;
  right: 0px;
  width: 628px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <ThemeProvider>
      <LayoutContainer>
        {activeRun && (
          <>
            {activeRun.teams[0] && activeRun.teams[0].players[0] && (
              <Team1>
                <Nameplate player={activeRun.teams[0].players[0]} />
              </Team1>
            )}
            {activeRun.teams[1] && activeRun.teams[1].players[0] && (
              <Team2>
                <Nameplate player={activeRun.teams[1].players[0]} />
              </Team2>
            )}
            {activeRun.teams[2] && activeRun.teams[2].players[0] && (
              <Team3>
                <Nameplate player={activeRun.teams[2].players[0]} />
              </Team3>
            )}
            {activeRun.teams[3] && activeRun.teams[3].players[0] && (
              <Team4>
                <Nameplate player={activeRun.teams[3].players[0]} />
              </Team4>
            )}
          </>
        )}
        <Info>
          <Commentators />
          <div style={{ marginTop: '100px', marginBottom: '100px' }}>
            <RunInfo fontSize={68} />
            <TimerLTA fontSize={104} />
          </div>

          <MediaBox useTopBorder />
          <Reader />
        </Info>
      </LayoutContainer>
    </ThemeProvider>
  );
};

render(<App />);
