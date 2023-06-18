import styled from 'styled-components';
import { useReplicant } from '../../../use-replicant';

const commentatorsRep = nodecg.Replicant('commentators');

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
  background-color: rgba(0, 0, 0, 0.6);
  width: calc(100% - 140px);
  font-size: ${(props) => (props.isOneCommentator ? '20px' : '16px')};
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid #5f3ac2;
`;

const CommentatorName = styled.div<{ isLast: boolean }>`
  flex: 1;
  text-align: center;
  border-right: ${(props) => (props.isLast ? '' : '2px solid #5f3ac2')};
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
  const [commentators] = useReplicant(commentatorsRep);

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
              <CommentatorName key={commentator.name} isLast={commentators.length - 1 == index}>
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
