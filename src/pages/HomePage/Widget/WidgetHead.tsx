import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Title } from '../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { decrementStep, selectApp } from '../../../state/applicationSlice';
import NavigateBack from './NavigateBack';

type WidgetHeadProps = {
  text: string;
}

const WidgetHeadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 34px 0;
`;

const WidgetHead: FC<WidgetHeadProps> = ({
  text,
}) => {
  const dispatch = useAppDispatch();
  const {
    stepper: {
      currentStep,
    },
  } = useAppSelector(selectApp);

  return (
    <WidgetHeadContainer>
      {currentStep ? <NavigateBack onClick={() => dispatch(decrementStep())} /> : null}
      <Title>{text}</Title>
    </WidgetHeadContainer>
  );
};

export default WidgetHead;
