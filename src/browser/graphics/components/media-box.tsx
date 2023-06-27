import { useReplicant } from 'use-nodecg';
import { MediaBoxItem } from '../../../types/custom';
import styled from 'styled-components';
import { useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import 'animate.css';

const MediaBoxContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  flex: 1 0 auto;
  min-height: 0;
  min-width: 0;
  flex-basis: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  object-fit: contain;
`;

const Image = styled.img`
  max-width: 85%;
  max-height: 85%;
  width: auto;
  height: auto;
  min-width: 0;
  min-height: 0;
`;

const MediaBox = ({
  useTopBorder = false,
  useBreakItem = false,
}: {
  useTopBorder?: boolean;
  useBreakItem?: boolean;
}) => {
  const [mediaBoxItem] = useReplicant<MediaBoxItem | undefined>('mediaBoxItem', undefined);
  const [breakMediaBoxItem] = useReplicant<MediaBoxItem | undefined>(
    'mediaBoxItemBreak',
    undefined
  );
  const mediaBoxRef = useRef(null);

  if (useBreakItem) {
    return (
      <MediaBoxContainer style={{ borderTop: useTopBorder ? '5px solid #5f3ac2' : '' }}>
        {breakMediaBoxItem && (
          <SwitchTransition mode="out-in">
            <CSSTransition
              appear
              key={breakMediaBoxItem.asset.name}
              nodeRef={mediaBoxRef}
              in={true}
              timeout={1000}
              classNames={{
                appearActive: 'animate__animated animate__fadeIn',
                enterActive: 'animate__animated animate__fadeIn',
                exitActive: 'animate__animated animate__fadeOut',
              }}>
              <Image ref={mediaBoxRef} src={breakMediaBoxItem.asset.url} />
            </CSSTransition>
          </SwitchTransition>
        )}
      </MediaBoxContainer>
    );
  } else {
    return (
      <MediaBoxContainer style={{ borderTop: useTopBorder ? '5px solid #5f3ac2' : '' }}>
        {mediaBoxItem && (
          <SwitchTransition mode="out-in">
            <CSSTransition
              appear
              key={mediaBoxItem.asset.name}
              nodeRef={mediaBoxRef}
              in={true}
              timeout={1000}
              classNames={{
                appearActive: 'animate__animated animate__fadeIn',
                enterActive: 'animate__animated animate__fadeIn',
                exitActive: 'animate__animated animate__fadeOut',
              }}>
              <Image ref={mediaBoxRef} src={mediaBoxItem.asset.url} />
            </CSSTransition>
          </SwitchTransition>
        )}
      </MediaBoxContainer>
    );
  }
};

export default MediaBox;
