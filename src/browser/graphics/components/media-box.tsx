import styled from 'styled-components';

const MediaBoxContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  flex: 1;
`;

const MediaBox = ({ useTopBorder }: { useTopBorder: boolean }) => {
  return (
    <MediaBoxContainer
      style={{ borderTop: useTopBorder ? '5px solid #5f3ac2' : '' }}></MediaBoxContainer>
  );
};

export default MediaBox;
