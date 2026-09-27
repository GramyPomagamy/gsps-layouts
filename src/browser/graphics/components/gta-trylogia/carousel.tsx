import { useReplicant } from 'use-nodecg';
import { MediaBoxItem } from '../../../../types/custom/mediaBoxItem';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { CompletionTime } from './completion-time';

const MediaBoxContainer = styled.div`
  min-height: 0;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  max-width: 85%;
  max-height: 85%;
  width: auto;
  height: auto;
  min-width: 0;
  min-height: 0;
`;

export const Carousel = () => {
  const [mediaBoxItem] = useReplicant<MediaBoxItem | undefined>('mediaBoxItem', undefined);
  const [splitsTimer] = useReplicant<number>('gtaSplitsTimer', 0);
  const [mediaTimer] = useReplicant<number>('gtaMediaTimer', 0);
  const [running, setRunning] = React.useState(true);
  const [state, setState] = React.useState(true);

  nodecg.listenFor('timerFinish', () => {
    setRunning(false);
  });

  useEffect(() => {
    if (running) {
      if (state) {
        setTimeout(() => {
          setState(!state);
        }, splitsTimer * 1000);
      } else {
        setTimeout(() => {
          setState(!state);
        }, mediaTimer * 1000);
        nodecg.sendMessage('mediaBox:showNextBreakItem');
      }
    } else {
      setState(true);
    }
  }, [state, running]);

  return (
    <MediaBoxContainer>
      {mediaBoxItem && (
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={state ? 'Splits' : mediaBoxItem.asset.name}
            appear
            in={true}
            timeout={1000}
            classNames="fade">
            {state ? <CompletionTime /> : <Image src={mediaBoxItem.asset.url} />}
          </CSSTransition>
        </SwitchTransition>
      )}
    </MediaBoxContainer>
  );
};
