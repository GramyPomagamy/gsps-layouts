import 'animate.css';
import './css/style.css';
import styled from 'styled-components';
import eventLogo from './img/GSPS_PNG.png';
import mainBg from './img/main-background.png';
import { render } from '../render';
import { IoIosMusicalNotes } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import { useReplicant } from 'use-nodecg';
import type { Song } from 'src/types/generated';
import MediaBox from './components/media-box';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${mainBg});
  margin: 0;
  padding: 0;
`;

const MediaBoxContainer = styled.div`
  width: 650px;
  height: 650px;
  position: fixed;
  top: 250px;
  right: 35px;
  border: 4px #5f3ac2 solid;
  border-radius: 8px;
  display: flex;
`;

const App = () => {
  return (
    <LayoutContainer>
      <Song />
      <MediaBoxContainer>
        <MediaBox useBreakItem />
      </MediaBoxContainer>
    </LayoutContainer>
  );
};

const SongDiv = styled.div`
  display: flex;
  position: fixed;
  top: 80px;
  right: 0px;
  background: #e6e6e6;
  height: 32px;
  color: rgb(60, 60, 60);
  width: 25%;
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

render(<App />);
