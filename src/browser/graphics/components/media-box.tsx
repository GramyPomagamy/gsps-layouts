import { useReplicant } from 'use-nodecg';
import { Asset, MediaBoxItem } from '../../../types/custom';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import 'animate.css';

const MediaBoxContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  padding: 0px;
  flex: 1;
  object-fit: contain;
  vertical-align: middle;
`;

const ImageSrc = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
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
              <span ref={mediaBoxRef}>
                {breakMediaBoxItem.type == 'video' ? (
                  <Video isBreakItem={useBreakItem} video={breakMediaBoxItem.asset} />
                ) : (
                  <Image
                    isBreakItem={useBreakItem}
                    image={breakMediaBoxItem.asset}
                    timeout={breakMediaBoxItem.timeout || 1000}
                  />
                )}
              </span>
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
              <span ref={mediaBoxRef}>
                {mediaBoxItem.type == 'video' ? (
                  <Video isBreakItem={useBreakItem} video={mediaBoxItem.asset} />
                ) : (
                  <Image
                    isBreakItem={useBreakItem}
                    image={mediaBoxItem.asset}
                    timeout={mediaBoxItem.timeout || 10000}
                  />
                )}
              </span>
            </CSSTransition>
          </SwitchTransition>
        )}
      </MediaBoxContainer>
    );
  }
};

export default MediaBox;

const Video = ({ video, isBreakItem = false }: { video: Asset; isBreakItem: boolean }) => {
  return (
    <video
      autoPlay
      muted
      onEnded={() => {
        if (isBreakItem) {
          nodecg.sendMessage('mediaBox:showBreakNextItem');
        } else {
          nodecg.sendMessage('mediaBox:showNextItem');
        }
      }}>
      <source type={`video/${video.ext.toLowerCase().replace('.', '')}`}></source>
    </video>
  );
};

const Image = ({
  image,
  timeout,
  isBreakItem = false,
}: {
  image: Asset;
  timeout: number;
  isBreakItem: boolean;
}) => {
  useEffect(() => {
    const messageTimeout = setTimeout(() => {
      if (isBreakItem) {
        nodecg.sendMessage('mediaBox:showNextBreakItem');
      } else {
        nodecg.sendMessage('mediaBox:showNextItem');
      }
    }, timeout);

    return clearTimeout(messageTimeout);
  }, [isBreakItem, timeout]);

  return <ImageSrc src={image.url} />;
};
