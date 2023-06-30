import { render } from '../render';
import layoutBg from './img/layouts/16x9-2p.png';
import styled from 'styled-components';
import RunInfo from './components/run-info';
import Timer from './components/timer';
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
  text-align: center;
`;

const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0px;
  top: 543px;
  width: 654px;
  height: 453px;
  justify-content: space-between;
`;

const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 1266px;
  top: 543px;
  width: 654px;
  height: 483px;
`;

const Names = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

export const App = () => {
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <BottomLeft>
          <Names>
            {activeRun && (
              <>
                {activeRun.teams[0] && (
                  <>
                    {activeRun.teams.length === 1 ? (
                      <>
                        {activeRun.teams.map((team) => {
                          return (
                            <Fragment key={team.id}>
                              {team.players.map((player, index) => {
                                if (index % 2 == 0) {
                                  return <Nameplate key={player.name} player={player} />;
                                } else {
                                  return <></>;
                                }
                              })}
                            </Fragment>
                          );
                        })}
                        {activeRun.teams[0].players.length < 5 && <Commentators />}
                      </>
                    ) : (
                      <>
                        {activeRun.teams[0].players.map((player) => {
                          return (
                            <Fragment key={player.id}>
                              <Nameplate key={player.name} player={player} />
                            </Fragment>
                          );
                        })}
                        {activeRun.teams[0].players.length < 5 && <Commentators />}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Names>

          <RunInfo fontSize={48} />
          <Timer fontSize={80} />
        </BottomLeft>
        <BottomRight>
          <Names>
            {activeRun && (
              <>
                {activeRun.teams[1] ? (
                  <>
                    {activeRun.teams[1].players.map((player) => {
                      return (
                        <Fragment key={player.id}>
                          <Nameplate key={player.name} player={player} />
                        </Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <>
                      {activeRun.teams.map((team) => {
                        return (
                          <Fragment key={team.id}>
                            {team.players.map((player, index) => {
                              if (index % 2 != 0) {
                                return <Nameplate key={player.name} player={player} />;
                              } else {
                                return <></>;
                              }
                            })}
                          </Fragment>
                        );
                      })}
                    </>
                  </>
                )}
              </>
            )}
            <Reader />
          </Names>
          <MediaBox />
        </BottomRight>
      </LayoutContainer>
    </>
  );
};

render(<App />);
