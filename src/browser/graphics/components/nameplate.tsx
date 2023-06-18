import { PlayerType } from '../../../types/custom';
import styled from 'styled-components';
import { useReplicant } from '../../../use-replicant';
import 'animate.css';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import { FaTwitch } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const nameCycleRep = nodecg.Replicant('nameCycle');

const NameplateContainer = styled.div`
  background-color: #5f3ac2;
  text-align: center;
  height: 40px;
  line-height: 0px;
`;

const Name = styled.div`
  font-size: 28px;
  margin-top: 17px;
  justify-content: center;
  align-content: center;
  line-height: 0px;
`;

const Twitch = styled.div`
  font-size: 28px;
  margin-top: 5px;
  justify-content: center;
  align-content: center;
  line-height: 0px;
`;

const Pronouns = styled.span`
  font-weight: 400;
  font-size: 0.5em;
  color: #cccccc;
  text-transform: uppercase;
  background-color: #2d1d3c;
  padding: 3px;
  height: 15px;
  margin-left: 8px;
`;

const TwitchIcon = styled(FaTwitch)`
  position: relative;
  top: 6px;
  left: -10px;
`;

const Nameplate = ({ player }: { player: PlayerType }) => {
  const [nameCycle] = useReplicant(nameCycleRep);
  const nameRef = useRef(null);

  return (
    <NameplateContainer>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={nameCycle}
          nodeRef={nameRef}
          in={true}
          timeout={1000}
          classNames={{
            appearActive: 'animate__animated animate__fadeIn',
            enterActive: 'animate__animated animate__fadeIn',
            exitActive: 'animate__animated animate__fadeOut',
          }}>
          <>
            {!nameCycle ? (
              <Name ref={nameRef}>
                {player.name}
                {player.pronouns && <Pronouns>{player.pronouns}</Pronouns>}
              </Name>
            ) : (
              <Twitch ref={nameRef}>
                <IconContext.Provider value={{ size: '0.8em' }}>
                  {' '}
                  <TwitchIcon />
                  {player.social.twitch}
                  {player.pronouns && <Pronouns>{player.pronouns}</Pronouns>}
                </IconContext.Provider>
              </Twitch>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </NameplateContainer>
  );
};

export default Nameplate;
