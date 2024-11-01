import { Reader as ReaderType } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const ReaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 32.5px;
`;

const ReaderLabel = styled.div`
  background-color: #5f3ac2;
  width: 140px;
  font-size: 18px;
`;

const ReaderName = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: calc(100% - 140px);
  font-size: 20px;
  border-bottom: 2px solid #5f3ac2;
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

const Reader = () => {
  const [reader] = useReplicant<ReaderType | undefined>('reader', undefined);

  return (
    <>
      {reader && reader.name.length > 0 && (
        <ReaderContainer>
          <ReaderLabel>
            <p style={{ marginTop: '4px' }}>Host</p>
          </ReaderLabel>
          <ReaderName>
            <p style={{ marginTop: '3px' }}>
              {reader.name} {reader.pronouns && <Pronouns>{reader.pronouns}</Pronouns>}
            </p>
          </ReaderName>
        </ReaderContainer>
      )}
    </>
  );
};

export default Reader;
