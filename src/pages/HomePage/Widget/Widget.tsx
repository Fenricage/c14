import React, { FC, useCallback } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector } from '../../../app/hooks';
import { selectApp, WidgetSteps } from '../../../state/applicationSlice';
import QuotesStep from '../steps/QuotesStep/QuotesStep';
import PhoneInputStep from '../steps/PhoneInputStep/PhoneInputStep';
import AddCardStep from '../steps/AddCardStep/AddCardStep';
import PaymentSelectStep from '../steps/PaymentSelectStep/PaymentSelectStep';
import PersonalInformationStep from '../steps/PersonalInformationStep/PersonalInformationStep';
import OrderReviewStep from '../steps/OrderReviewStep/OrderReviewStep';
import SMSConfirmationStep from '../steps/SMSConfirmationStep/SMSConfirmationStep';
import PurchaseInProgressStep from '../steps/PurchaseInProgressStep/PurchaseInProgressStep';
import CompleteStep from '../steps/CompleteStep/CompleteStep';

const WidgetContainer = styled.div`
  display: flex;
  position: relative;
  overflow: auto;
  flex-flow: column nowrap;
  width: 465px;
  min-height: 517px;
  height: 517px;
  min-width: 465px;
  max-width: 465px;
  background: ${({ theme }) => theme.alt2};
  box-shadow: 0 4px 31px 25px rgba(0, 0, 0, 0.03);
  border-radius: 24px;
  flex-flow: column;
  //flex: 1;
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
    widgetSteps: {
      currentStep,
    },
  } = application;

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case WidgetSteps.QUOTES: {
        return <QuotesStep />;
      }
      case WidgetSteps.PHONE_VERIFICATION: {
        return <PhoneInputStep />;
      }
      case WidgetSteps.PHONE_CONFIRMATION: {
        return <SMSConfirmationStep />;
      }
      case WidgetSteps.PERSONAL_INFORMATION: {
        return <PersonalInformationStep />;
      }
      case WidgetSteps.PAYMENT_ADDING: {
        return <AddCardStep />;
      }
      case WidgetSteps.PAYMENT_SELECT: {
        return <PaymentSelectStep />;
      }
      case WidgetSteps.REVIEW_ORDER: {
        return <OrderReviewStep />;
      }
      case WidgetSteps.PROCESS: {
        return <PurchaseInProgressStep />;
      }
      case WidgetSteps.COMPLETE: {
        return <CompleteStep />;
      }
      default: {
        return null;
      }
    }
  }, [currentStep]);

  return (
    <WidgetContainer
      data-testid="Widget"
      id="widget"
    >
      {renderStep()}
    </WidgetContainer>
  );
};

export default Widget;
