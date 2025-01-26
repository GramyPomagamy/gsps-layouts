import { Reader as ReaderType } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { Channel } from 'src/types/custom';

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

const ReaderName = styled.div<{ signalLevel: number, thresholdLevel: number }>`
  background-color: ${(props) => ((props.signalLevel < props.thresholdLevel) ? 'rgba(0, 0, 0, 0.6)' : 'rgba(100, 100, 100, 0.6)')};
  transition: ${(props) => ((props.signalLevel < props.thresholdLevel) ? 'background-color 1s ease-in-out 0.5s' : 'background-color 0.1s ease-in')};
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
  const [mixerSignalLevels] = useReplicant<{ [key in Channel]: number } | undefined>("mixerSignalLevels", undefined);
  const [mixerThresholdLevels] = useReplicant<{ [key in Channel]: number } | undefined>("mixerThresholdLevels", undefined);

  return (
    <>
      {reader && reader.name.length > 0 && (
        <ReaderContainer>
          <ReaderLabel>
            <p style={{ marginTop: '4px' }}>Host</p>
          </ReaderLabel>
          <ReaderName
            signalLevel={mixerSignalLevels ? mixerSignalLevels["Donacje"] : -Infinity}
            thresholdLevel={mixerThresholdLevels ? mixerThresholdLevels["Donacje"] : -Infinity}>
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
