import styled, { keyframes } from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { useRef } from 'react';
import type { Song } from 'src/types/generated';
import { IconContext } from 'react-icons';
import { IoIosMusicalNotes } from 'react-icons/io';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const songBackgroundSize = '576px';

const SongDiv = styled.div<{top: number, left: number}>`
  display: flex;
  position: fixed;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background: #e6e6e6;
  height: 32px;
  color: rgb(60, 60, 60);
  width: ${songBackgroundSize};
  flex-direction: row;
  gap: 8px;
  font-size: 20px;
  border-radius: 7px 7px 7px 7px;
  align-content: space-between;
  justify-content: space-between;
`;

const scrollLeftAnimation = keyframes`
    0% {
      -moz-transform: translateX(100%);
      -webkit-transform: translateX(100%);
      transform: translateX(${songBackgroundSize});
    }
    100% {
      -moz-transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
    }
`;
const SongScroller = styled.div`
  position: absolute;
  height: 100%;
  width: max-content;
  line-height: 50px;
  text-align: center;
  transform: translateX(100%);
  animation: ${scrollLeftAnimation} 18s linear infinite
`;
const SongName = styled.div`
  width: 100%;
  margin-top: -10px;
`;

const Song = ({ top = 50, left = 0 }) => {
  const [song] = useReplicant<Song>('song', '');
  const songRef = useRef(null);

  return (
    <IconContext.Provider value={{ size: '1.5em' }}>
      <SongDiv top={top} left={left} >
        <IoIosMusicalNotes />
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={song}
            nodeRef={songRef}
            appear
            in={true}
            timeout={1000}
            classNames="fade">
            <SongName ref={songRef} className="marquee">
              <SongScroller>{song}</SongScroller>
            </SongName>
          </CSSTransition>
        </SwitchTransition>
      </SongDiv>
    </IconContext.Provider>
  );
};

export default Song;
