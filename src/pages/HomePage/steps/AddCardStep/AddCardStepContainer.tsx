import React, {
  FC, useCallback, useEffect, useState,
} from 'react';

import { QueryStatus } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';
import { FrameCardTokenizedEvent, Frames, FrameValidationChangedEvent } from 'frames-react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { incrementWidgetStep, logout } from '../../../../state/applicationSlice';
import { useAddUserCardMutation } from '../../../../redux/cardsApi';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import AddCardStep from './AddCardStep';
import { selectPayment } from '../../../../state/paymentSelectSlice';

const AddCardStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  const [cardValidation, setCardValidation] = useState<FrameValidationChangedEvent |
    Record<string, never>>({});
  const [expireValidation, setExpireValidation] = useState<FrameValidationChangedEvent |
    Record<string, never>>({});
  const [cvvValidation, setCvvValidation] = useState<FrameValidationChangedEvent |
    Record<string, never>>({});
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [tokenizedEvent, setTokenizedEvent] = useState<FrameCardTokenizedEvent | null>(null);

  const {
    userCards,
  } = useAppSelector(selectPayment);

  const [triggerAddCard, {
    status,
    error,
  }] = useAddUserCardMutation();

  useEffect(() => {
    if (status === QueryStatus.rejected) {
      // TODO(@ruslan): serialize errors
      toast.error((error as { data: { message: string; code: number } })?.data?.message);
      Frames.enableSubmitForm();
      setCardSubmitted(false);
    }
  }, [error, status]);

  useEffect(() => {
    if (!tokenizedEvent?.token) {
      return;
    }

    const fetchAddCard = async () => {
      await triggerAddCard({ card_token: tokenizedEvent.token });
    };

    fetchAddCard();
  }, [tokenizedEvent?.token, triggerAddCard]);

  useClearGeneralError();

  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, status]);

  const handleFrameValidationChanged = useCallback((e: FrameValidationChangedEvent) => {
    switch (e.element) {
      case 'cvv': {
        setCvvValidation(e);
        break;
      }
      case 'expiry-date': {
        setExpireValidation(e);
        break;
      }
      case 'card-number': {
        setCardValidation(e);
        break;
      }
      default: {
        setCardValidation({});
      }
    }
  }, []);

  const isFormValid = cardValidation?.isValid && expireValidation?.isValid && cvvValidation?.isValid;

  return (
    <AddCardStep
      isCardSubmitted={cardSubmitted}
      isFormValid={isFormValid}
      onSubmit={() => Frames.submitCard()}
      onGoBack={userCards.length === 0
        ? (() => {
          dispatch(logout());
        }) : undefined}
      onFrameValidationChanged={handleFrameValidationChanged}
      onCardSubmitted={() => setCardSubmitted(true)}
      onCardTokenized={(e) => {
        setTokenizedEvent(e);
      }}
    />
  );
};

export default AddCardStepContainer;
