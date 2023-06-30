import { render } from '../render';
import layoutBg from './img/layouts/16x9-1p.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import { Timer as TimerEl } from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { Fragment } from 'react';
import { GlobalStyle } from '../global-theme';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
`;

const LeftSide = styled.div`
  position: fixed;
  width: 477px;
  height: 587px;
  top: 439px;
  left: 0px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const BottomRight = styled.div`
  position: fixed;
  width: 1439px;
  height: 213px;
  left: 481px;
  top: 813px;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
  justify-content: center;
`;

const Run = styled(RunInfo)`
  grid-area: 1 / 1 / 2 / 2;
`;

const Timer = styled(TimerEl)`
  grid-area: 1 / 2 / 2 / 3;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <LeftSide>
          {activeRun && (
            <>
              {activeRun.teams.map((team) => {
                return (
                  <Fragment key={team.id}>
                    {team.players.map((player) => {
                      return <Nameplate key={player.name} player={player} />;
                    })}
                  </Fragment>
                );
              })}
            </>
          )}
          <Commentators />
          <Reader />
          <MediaBox />
        </LeftSide>
        <BottomRight>
          <Run fontSize={56} />
          <Timer fontSize={72} />
        </BottomRight>
      </LayoutContainer>
    </>
  );
};

render(<App />);
