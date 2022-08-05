import React, {
  FC, useCallback, useEffect,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PaymentCard, useDeleteUserCardMutation, useGetUserCardsQuery } from '../../../../redux/cardsApi';
import {
  goToWidgetStep,
  incrementWidgetStep, logout,
  selectApp, WidgetSteps,
} from '../../../../state/applicationSlice';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import PaymentSelectStep from './PaymentSelectStep';
import {
  resetUserCards,
  selectPayment,
  setSelectedUserCard,
  setUserCardsEmpty,
} from '../../../../state/paymentSelectSlice';

const PaymentSelectStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  useGetUserCardsQuery({});

  const [triggerDeleteCard] = useDeleteUserCardMutation();

  const onDeleteCard = useCallback(async (cardId: string) => {
    await triggerDeleteCard(cardId);
  }, [triggerDeleteCard]);

  const {
    skipPaymentStep,
  } = useAppSelector(selectApp);

  const {
    userCards,
    isUserCardsLoaded,
    deletingCards,
    selectedUserCard,
  } = useAppSelector(selectPayment);

  useEffect(() => {
    if (!isUserCardsLoaded) {
      return;
    }

    if (userCards.length) {
      dispatch(setSelectedUserCard(userCards[0]));
    }

    if (!skipPaymentStep) {
      return;
    }

    if (userCards.length) {
      dispatch(incrementWidgetStep());
    }
  }, [userCards, dispatch, isUserCardsLoaded, skipPaymentStep]);

  useEffect(() => {
    if (!isUserCardsLoaded) {
      return;
    }

    if (!userCards.length) {
      dispatch(setUserCardsEmpty());
      dispatch(goToWidgetStep({ widgetStep: WidgetSteps.PAYMENT_ADDING }));
    }
  }, [userCards.length, dispatch, isUserCardsLoaded]);

  const handleClickNextStep = () => {
    dispatch(incrementWidgetStep());
  };

  useEffect(() => () => {
    dispatch(resetUserCards());
  }, [dispatch]);

  useClearGeneralError();

  const handleClickAddNewCard = () => {
    dispatch(goToWidgetStep({ widgetStep: WidgetSteps.PAYMENT_ADDING }));
  };

  const handleCardSelection = (card: PaymentCard) => {
    dispatch(setSelectedUserCard(card));
  };

  return (
    <PaymentSelectStep
      customerCards={userCards}
      selectedCard={selectedUserCard}
      onCardSelection={handleCardSelection}
      deletingCards={deletingCards}
      areCardsLoading={!isUserCardsLoaded}
      onSubmitClick={handleClickNextStep}
      onAddNewCardClick={handleClickAddNewCard}
      onDeleteCardClick={onDeleteCard}
      onLogout={() => dispatch(logout())}
    />
  );
};

export default PaymentSelectStepContainer;
