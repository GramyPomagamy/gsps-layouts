import { useReplicant } from '../../../use-replicant';
import { Asset } from '../../../types/custom';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import 'animate.css';

const mediaBoxItemRep = nodecg.Replicant('mediaBoxItem');

const MediaBoxContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  padding: 15px;
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

const MediaBox = ({ useTopBorder }: { useTopBorder: boolean }) => {
  const [mediaBoxItem] = useReplicant(mediaBoxItemRep);
  const mediaBoxRef = useRef(null);

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
                <Video video={mediaBoxItem.asset} />
              ) : (
                <Image image={mediaBoxItem.asset} timeout={mediaBoxItem.timeout || 1000} />
              )}
            </span>
          </CSSTransition>
        </SwitchTransition>
      )}
    </MediaBoxContainer>
  );
};

export default MediaBox;

const Video = ({ video }: { video: Asset }) => {
  return (
    <video
      autoPlay
      muted
      onEnded={() => {
        nodecg.sendMessage('mediaBox:showNextItem');
      }}>
      <source type={`video/${video.ext.toLowerCase().replace('.', '')}`}></source>
    </video>
  );
};

const Image = ({ image, timeout }: { image: Asset; timeout: number }) => {
  useEffect(() => {
    const messageTimeout = setTimeout(() => {
      nodecg.sendMessage('mediaBox:showNextItem');
    }, timeout);

    return clearTimeout(messageTimeout);
  }, [timeout]);

  return <ImageSrc src={image.url} />;
};
