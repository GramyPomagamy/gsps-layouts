import { RunDataPlayer } from 'speedcontrol/src/types';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import { FaTwitch } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { NameCycle } from '../../../types/generated';

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

const FlagContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 5px;
  height: 40px;
`;

const Flag = styled.img<{ country: string }>`
  height: calc(100% - 10px);
  opacity: ${(props) => (props.country ? 1 : 0)};
  border-size: 2px;
  border-style: solid;
`;

const Nameplate = ({ player }: { player: RunDataPlayer }) => {
  const [nameCycle] = useReplicant<NameCycle>('nameCycle', 0);
  const nameRef = useRef(null);

  return (
    <NameplateContainer>
      <SwitchTransition mode="out-in">
        <CSSTransition key={nameCycle} nodeRef={nameRef} in appear timeout={1000} classNames="fade">
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
      <FlagContainer>
        {player.country && (
          <>
            <Flag
              country={player.country}
              src={player.country ? `/bundles/gsps-layouts/shared/flags/${player.country}.png` : ''}
            />
          </>
        )}
      </FlagContainer>
    </NameplateContainer>
  );
};

export default Nameplate;
