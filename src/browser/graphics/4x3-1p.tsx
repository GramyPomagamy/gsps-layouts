import { render } from '../render';
import layoutBg from './img/layouts/4x3-1p.png';
import styled from 'styled-components';
import './css/style.css';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';
import Nameplate from './components/nameplate';
import Reader from './components/reader';
import Commentators from './components/commentators';
import { useReplicant } from 'use-nodecg';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
`;

const Info = styled.div`
  width: 543px;
  height: 630px;
  position: fixed;
  top: 396px;
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`;

const Names = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-bottom: 10px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  
  return (
    <LayoutContainer>
      <Info>
        <Names>
          {activeRun && (
            <>
              {activeRun.teams.map((team) => {
                return (
                  <>
                    {team.players.map((player) => {
                      return <Nameplate key={player.name} player={player} />;
                    })}
                  </>
                );
              })}
            </>
          )}
          <Commentators />
          <Reader />
        </Names>

        <RunInfo fontSize={44} />
        <Timer fontSize={64} />
        <MediaBox useTopBorder />
      </Info>
    </LayoutContainer>
  );
};

render(<App />);
