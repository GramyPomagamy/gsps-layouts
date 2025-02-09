import { Commentators as CommentatorsType } from 'src/types/generated';
import { Channel } from 'src/types/custom';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const CommentatorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 32.5px;
`;

const CommentatorsLabel = styled.div`
  background-color: #5f3ac2;
  width: 140px;
  font-size: 18px;
`;

const CommentatorsNameContainer = styled.div<{ isOneCommentator: boolean }>`
  width: calc(100% - 140px);
  font-size: ${(props) => (props.isOneCommentator ? '20px' : '16px')};
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid #5f3ac2;
`;

const CommentatorName = styled.div<{ isLast: boolean, signalLevel: number, thresholdLevel: number }>`
  flex: 1;
  text-align: center;
  border-right: ${(props) => (props.isLast ? '' : '2px solid #5f3ac2')};
  background-color: ${(props) => ((props.signalLevel < props.thresholdLevel) ? 'rgba(0, 0, 0, 0.6)' : 'rgba(100, 100, 100, 0.6)')};
  transition: ${(props) => ((props.signalLevel < props.thresholdLevel) ? 'background-color 1s ease-in-out 0.5s' : 'background-color 0.1s ease-in')};
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

const Commentators = () => {
  const [commentators] = useReplicant<CommentatorsType | undefined>('commentators', undefined);
  const [mixerSignalLevels] = useReplicant<{ [key in Channel]: number } | undefined>("mixerSignalLevels", undefined);
  const [mixerThresholdLevels] = useReplicant<{ [key in Channel]: number } | undefined>("mixerThresholdLevels", undefined);

  if (commentators && commentators.length) {
    return (
      <>
        <CommentatorsContainer>
          <CommentatorsLabel>
            <p style={{ marginTop: '4px' }}>
              {commentators.length > 1 ? <>Komentatorzy</> : <>Komentator</>}
            </p>
          </CommentatorsLabel>
          <CommentatorsNameContainer isOneCommentator={commentators.length === 1}>
            {commentators.map((commentator, index) => (
              <CommentatorName
                key={commentator.name}
                isLast={commentators.length - 1 == index}
                signalLevel={mixerSignalLevels && mixerSignalLevels[commentator.channel] || -Infinity}
                thresholdLevel={mixerThresholdLevels && mixerThresholdLevels[commentator.channel] || -Infinity}>
                <p style={{ marginTop: commentators.length === 1 ? '3px' : '6px' }}>
                  {commentator.name}
                  {commentator.pronouns && <Pronouns>{commentator.pronouns}</Pronouns>}
                </p>
              </CommentatorName>
            ))}
          </CommentatorsNameContainer>
        </CommentatorsContainer>
      </>
    );
  } else {
    return <></>;
  }
};

export default Commentators;
