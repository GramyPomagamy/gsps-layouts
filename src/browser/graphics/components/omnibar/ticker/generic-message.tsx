import styled from 'styled-components';
import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

const MessageDiv = styled.div`
  font-size: 24px;
  height: 100%;
  text-align: left;
  padding-left: 10px;
  opacity: 0;
`;

const GenericMessage = ({ message, onEnd }: { message: string; onEnd: () => void }) => {
  const messageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onEnd();
        },
      });
      tl.from(messageRef.current, { x: '-5px', duration: 1 }, 'show');
      tl.to(messageRef.current, { opacity: 1, duration: 1 }, 'show');
      tl.addLabel('end', '+=20');
      tl.to(messageRef.current, { x: '5px', duration: 1 }, 'end');
      tl.to(messageRef.current, { opacity: 0, duration: 1 }, 'end');
    });

    return () => ctx.revert();
  }, []);

  return <MessageDiv ref={messageRef} dangerouslySetInnerHTML={{ __html: message }} />;
};

export default GenericMessage;
