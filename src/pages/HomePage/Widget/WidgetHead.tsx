import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Title } from '../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { decrementWidgetStep, selectApp } from '../../../state/applicationSlice';
import NavigateBack from './NavigateBack';

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
