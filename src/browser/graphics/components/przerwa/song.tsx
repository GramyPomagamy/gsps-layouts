import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { useRef } from 'react';
import type { Song } from 'src/types/generated';
import { IconContext } from 'react-icons';
import { IoIosMusicalNotes } from 'react-icons/io';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const SongDiv = styled.div`
  display: flex;
  position: fixed;
  top: 80px;
  right: 0px;
  background: #e6e6e6;
  height: 32px;
  color: rgb(60, 60, 60);
  width: 30%;
  flex-direction: row;
  gap: 8px;
  font-size: 20px;
  border-radius: 7px 0px 0px 7px;
  align-content: space-between;
  justify-content: space-between;
`;

const SongName = styled.div`
  width: 100%;
  margin-top: -10px;
`;

const Song = () => {
  const [song] = useReplicant<Song>('song', '');
  const songRef = useRef(null);

  return (
    <IconContext.Provider value={{ size: '1.5em' }}>
      <SongDiv>
        <IoIosMusicalNotes />
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={song}
            nodeRef={songRef}
            appear
            in={true}
            timeout={1000}
            classNames={{
              appearActive: 'animate__animated animate__fadeIn',
              enterActive: 'animate__animated animate__fadeIn',
              exitActive: 'animate__animated animate__fadeOut',
            }}>
            <SongName ref={songRef} className="marquee">
              <p>{song}</p>
            </SongName>
          </CSSTransition>
        </SwitchTransition>
      </SongDiv>
    </IconContext.Provider>
  );
};

export default Song;