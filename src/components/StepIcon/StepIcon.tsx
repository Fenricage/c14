import React, { FC } from 'react';
import styled from 'styled-components/macro';

type StepIconProps = {
  children: React.ReactNode;
}

const StepIconContainer = styled.div`
  margin-top: 20px;
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: center;
`;

const StepIcon: FC<StepIconProps> = (props) => {
  const {
    children,
  } = props;

  return (
    <StepIconContainer>
      {children}
    </StepIconContainer>
  );
};

export default StepIcon;
