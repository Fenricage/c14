import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Title } from '../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { decrementWidgetStep, selectApp } from '../../../state/applicationSlice';
import NavigateBack, { NavigateBackButton } from './NavigateBack';

type WidgetHeadProps = {
  text: string;
  customBackCallback?: () => void;
}

const WidgetHeadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 20px 0;
  
  ${Title} {
    font-size: 14px;
    
    ${({ theme }) => theme.mediaWidth.upToSmall`
       font-size: 18px;
    `};
  }
  
  ${NavigateBackButton} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
`;

const WidgetHead: FC<WidgetHeadProps> = ({
  text,
  customBackCallback,
}) => {
  const dispatch = useAppDispatch();
  const {
    widgetSteps: {
      currentStep,
    },
  } = useAppSelector(selectApp);

  const handleClickBack = () => {
    if (customBackCallback) {
      customBackCallback();
    } else {
      dispatch(decrementWidgetStep());
    }
  };

  return (
    <WidgetHeadContainer>
      {currentStep ? <NavigateBack onClick={handleClickBack} /> : null}
      <Title data-testid="WidgetHeadTitle">{text}</Title>
    </WidgetHeadContainer>
  );
};

export default WidgetHead;
