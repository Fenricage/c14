import React, { FC, useCallback } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector } from '../../../app/hooks';
import { selectApp, Steps } from '../../../state/applicationSlice';
import QuotesStep from '../steps/QuotesStep/QuotesStep';
import VerificationFormStep from '../steps/VerificationFormStep/VerificationFormStep';

const WidgetContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 465px;
  min-height: 517px;
  min-width: 465px;
  max-width: 465px;
  background: ${({ theme }) => theme.alt2};
  box-shadow: 0 4px 31px 25px rgba(0, 0, 0, 0.03);
  border-radius: 24px;
  flex-flow: column;
  flex: 1;
  padding: 19px 30px 30px 30px;
`;

// TODO(@ruslan): move to slice
export type FeeData = {
  c14?: string;
  network?: string;
  total?: string;
}

const Widget: FC = () => {
  const application = useAppSelector(selectApp);

  const {
    stepper: {
      currentStep,
    },
  } = application;

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case Steps.QUOTES: {
        return <QuotesStep />;
      }
      case Steps.PHONE_VERIFICATION: {
        return <VerificationFormStep />;
      }
      default: {
        return null;
      }
    }
  }, [currentStep]);

  return (
    <WidgetContainer data-testid="Widget">
      {renderStep()}
    </WidgetContainer>
  );
};

export default Widget;
