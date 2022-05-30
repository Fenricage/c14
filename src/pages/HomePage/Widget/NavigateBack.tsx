import React, { FC, MouseEventHandler } from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as BackIcon } from '../../../assets/back_icon.svg';

type NavigateBackProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
}

const StyledBackIcon = styled(BackIcon)`
  transition: transform .25s ease;
`;

const NavigateBackButton = styled.button`
  
  &:hover {
    ${StyledBackIcon} {
      transform: translateX(-5px);
    }
  }
`;

const NavigateBack: FC<NavigateBackProps> = ({
  onClick,
}) => (
  <NavigateBackButton onClick={onClick} type="button">
    <StyledBackIcon />
  </NavigateBackButton>
);

export default NavigateBack;
