import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import differenceInYears from 'date-fns/differenceInYears';
import OrderReviewStep, { YEARS_OLD_CAP } from './OrderReviewStep';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  decrementWidgetStep,
  goToWidgetStep,
  incrementWidgetStep,
  selectApp,
  setGeneralError,
  setQuotesLoaded,
  setSkipPaymentStep,
  WidgetSteps,
} from '../../../../state/applicationSlice';
import { selectUserDetails, setSkipPersonalInfoStep } from '../../../../state/userDetailsSlice';
import { selectLimits } from '../../../../state/limitsSlice';
import { selectPayment } from '../../../../state/paymentSelectSlice';
import { useGetUserLimitsQuery } from '../../../../redux/limitsApi';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import useCallOnExpireTimer from '../../../../hooks/useCallOnExpireTimer';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import { PaymentCard } from '../../../../redux/cardsApi';
import { UserDetails } from '../../../../redux/userApi';

const OrderReviewStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  const {
    quotes: {
      target_amount,
      absolute_internal_fee,
      fiat_blockchain_fee,
      source_currency,
      target_crypto_asset_id,
      expires_at,
      total_fee,
      source_amount,
    },
    isQuoteLoaded,
    isQuoteLoading,
  } = useAppSelector(selectApp);

  const {
    user,
  } = useAppSelector(selectUserDetails);

  const isUserTooManyYearsOld = user?.date_of_birth
    ? differenceInYears(new Date(), new Date(user?.date_of_birth)) >= YEARS_OLD_CAP
    : false;

  const {
    limits,
    isLimitsLoaded,
  } = useAppSelector(selectLimits);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickClose = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  }, []);

  const { selectedUserCard, userCards } = useAppSelector(selectPayment);
  const { isFetching: isLimitsLoading } = useGetUserLimitsQuery();
  const [triggerGetQuotes] = useGetQuoteMutation();

  let isLimitsExceeded = false;

  if (isLimitsLoaded) {
    isLimitsExceeded = +(limits?.remaining_weekly_limit_usd as string) < +source_amount;
  }

  useEffect(() => {
    if (!isLimitsLoading && isLimitsExceeded) {
      dispatch(setGeneralError({
        type: 'error',
        message: `You have exceeded the purchase limit. 
        Total weekly limit $${limits?.weekly_limit_usd as string}.
        Remaining limit: $${limits?.remaining_weekly_limit_usd}`,
      }));
    }
  }, [
    dispatch,
    isLimitsLoading,
    isLimitsExceeded,
    limits?.remaining_weekly_limit_usd,
    limits?.weekly_limit_usd,
  ]);

  useEffect(() => {
    if (isQuoteLoaded) {
      return;
    }

    triggerGetQuotes({
      source_currency,
      target_crypto_asset_id,
      source_amount,
    });
  }, [
    isQuoteLoaded,
    source_amount,
    source_currency,
    target_crypto_asset_id,
    triggerGetQuotes,
  ]);

  useEffect(() => () => {
    dispatch(setQuotesLoaded(false));
  }, [dispatch]);

  const onExpire = useCallback(() => {
    triggerGetQuotes({
      source_currency,
      target_crypto_asset_id,
      source_amount,
    });
  }, [
    source_amount,
    source_currency,
    target_crypto_asset_id,
    triggerGetQuotes,
  ]);

  useCallOnExpireTimer(expires_at, onExpire);
  useClearGeneralError();

  const handleClickSubmit = () => {
    setIsModalOpen(true);
  };

  const handleClickChangePayment = () => {
    dispatch(setSkipPaymentStep(false));
    dispatch(decrementWidgetStep());
  };

  const onConfirm = () => {
    dispatch(incrementWidgetStep());
  };

  const handleClickChangePersonalInfo = () => {
    dispatch(setSkipPersonalInfoStep(false));
    dispatch(goToWidgetStep({
      widgetStep: WidgetSteps.PERSONAL_INFORMATION,
      shouldUpdateStepper: userCards.length > 0,
    }));
  };

  const onClickNavigateBack = () => {
    dispatch(setSkipPaymentStep(false));
    dispatch(decrementWidgetStep());
  };

  return (
    <OrderReviewStep
      onClickNavigateBack={onClickNavigateBack}
      isQuoteLoaded={isQuoteLoaded}
      sourceCurrency={source_currency}
      sourceAmount={source_amount}
      onClickChangePayment={handleClickChangePayment}
      onClickChangePersonalInfo={handleClickChangePersonalInfo}
      isModalOpen={isModalOpen}
      targetAmount={target_amount}
      targetCurrency={target_crypto_asset_id}
      onSubmit={handleClickSubmit}
      isUserTooManyYearsOld={isUserTooManyYearsOld}
      c14Fee={absolute_internal_fee}
      totalFee={total_fee}
      networkFee={fiat_blockchain_fee}
      paymentCard={selectedUserCard as PaymentCard}
      onConfirm={onConfirm}
      onClose={handleClickClose}
      isSubmitDisabled={isQuoteLoading || isLimitsExceeded || !isLimitsLoaded}
      isSubmitLoading={isQuoteLoading || !isLimitsLoaded}
      user={user as UserDetails}
    />
  );
};

export default OrderReviewStepContainer;
