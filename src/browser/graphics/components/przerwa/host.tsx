import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { useRef } from 'react';
import type { Reader } from 'src/types/generated';
import { IconContext } from 'react-icons';
import { IoIosMicrophone } from 'react-icons/io';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const HostDiv = styled.div`
  display: flex;
  position: fixed;
  bottom: 150px;
  right: 0px;
  background: #e6e6e6;
  height: 32px;
  color: rgb(60, 60, 60);
  width: 30%;
  flex-direction: row;
  gap: 8px;
  font-size: 20px;
  border-radius: 7px 7px 7px 7px;
  align-content: space-between;
  justify-content: space-between;
`;

const HostNick = styled.div`
  width: 100%;
  margin-top: -15px;
`;

const Host = () => {
  const [reader] = useReplicant<Reader | undefined>('reader', undefined);
  const readerRef = useRef(null);

  return (
    <IconContext.Provider value={{ size: '1.5em' }}>
      <HostDiv>
        <IoIosMicrophone />
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={reader?.name}
            nodeRef={readerRef}
            appear
            in={true}
            timeout={1000}
            classNames="fade">
            <HostNick ref={readerRef}>
              <p>{reader?.name} {reader?.pronouns && <>({reader?.pronouns})</>}</p>
            </HostNick>
          </CSSTransition>
        </SwitchTransition>
      </HostDiv>
    </IconContext.Provider>
  );
};

export default Host;
