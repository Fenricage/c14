import React, {
  FC, useCallback, useEffect,
} from 'react';
import styled from 'styled-components/macro';
import { parse } from 'query-string';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectApp, setBlockchainTargetAddress, WidgetSteps } from '../../../state/applicationSlice';
import QuotesStepContainer from '../steps/QuotesStep/QuotesStepContainer';
import PhoneInputStepContainer from '../steps/PhoneInputStep/PhoneInputStepContainer';
import AddCardStepContainer from '../steps/AddCardStep/AddCardStepContainer';
import PaymentSelectStepContainer from '../steps/PaymentSelectStep/PaymentSelectStepContainer';
import OrderReviewStep from '../steps/OrderReviewStep/OrderReviewStep';
import SMSConfirmationStepContainer from '../steps/SMSConfirmationStep/SMSConfirmationStepContainer';
import PurchaseInProgressStep from '../steps/PurchaseInProgressStep/PurchaseInProgressStep';
import CompleteStep from '../steps/CompleteStep/CompleteStep';
import EmailVerificationStepContainer from '../steps/EmailVerificationStep/EmailVerificationStepContainer';
import DocumentVerificationContainer from '../steps/DocumentVerificationStep/DocumentVerificationContainer';
// eslint-disable-next-line max-len
import PersonalInformationStepContainer from '../steps/PersonalInformationStep/PersonalInformationStepContainer';

const WidgetContainer = styled.div`
  display: flex;
  position: relative;
  overflow: auto;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.alt2};
  flex-flow: column;
  padding: 19px 30px 30px 30px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     min-height: 517px;
     border-radius: 24px;
     box-shadow: 0 4px 31px 25px rgba(0, 0, 0, 0.03);
     width: 465px;
     min-width: 465px;
     max-width: 465px;
     height: 517px;
  `};
`;

// TODO(@ruslan): move to slice
export type FeeData = {
  c14?: string;
  network?: string;
  total?: string;
}

const Widget: FC = () => {
  const application = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  const {
    widgetSteps: {
      currentStep,
    },
  } = application;

  useEffect(() => {
    const queryStringParsed = parse(window.location.search);

    if (!queryStringParsed.targetAddress) {
      toast.error('targetAddress is missing from URI query params.');
      dispatch(setBlockchainTargetAddress(null));
      return;
    }

    dispatch(setBlockchainTargetAddress((queryStringParsed as { targetAddress: string }).targetAddress));
  }, [dispatch]);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case WidgetSteps.QUOTES: {
        return <QuotesStepContainer />;
      }
      case WidgetSteps.PHONE_VERIFICATION: {
        return <PhoneInputStepContainer />;
      }
      case WidgetSteps.PHONE_CONFIRMATION: {
        return <SMSConfirmationStepContainer />;
      }
      case WidgetSteps.DOCUMENT_VERIFICATION: {
        return <DocumentVerificationContainer />;
      }
      case WidgetSteps.PERSONAL_INFORMATION: {
        return <PersonalInformationStepContainer />;
      }
      case WidgetSteps.EMAIL_VERIFICATION: {
        return <EmailVerificationStepContainer />;
      }
      case WidgetSteps.PAYMENT_ADDING: {
        return <AddCardStepContainer />;
      }
      case WidgetSteps.PAYMENT_SELECT: {
        return <PaymentSelectStepContainer />;
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
