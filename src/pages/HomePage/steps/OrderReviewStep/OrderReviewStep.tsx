import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components/macro';
import ReactLoading from 'react-loading';
import differenceInYears from 'date-fns/differenceInYears';
import { PaymentCard } from '../../../../redux/cardsApi';
import WidgetHead from '../../Widget/WidgetHead';
import PreviewBadge from './PreviewBadge';
import Fee from '../QuotesStep/Fee';
import { Button, FormRow, BorderButton } from '../../../../theme/components';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  decrementWidgetStep,
  goToWidgetStep,
  incrementWidgetStep,
  selectApp,
  setGeneralError,
  setQuotesLoaded,
  setSkipPaymentStep,
  setSkipPersonalInfoStep,
  WidgetSteps,
} from '../../../../state/applicationSlice';
import useCallOnExpireTimer from '../../../../hooks/useCallOnExpireTimer';
import { sourceOptions, targetOptions } from '../QuotesStep/QuotesStepContainer';
import AmountField from '../../../../components/AmountField/AmountField';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import CardBadge from './CardBadge';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import { useGetUserLimitsQuery } from '../../../../redux/limitsApi';
import { selectLimits } from '../../../../state/limitsSlice';
import Modal from '../../../../components/Modal/Modal';
import { selectFieldModalStyles } from '../../../../components/CurrencySelectField/CurrencySelectField';
import ModalInnerConfirm from './ModalInnerConfirm';
import ModalInnerTooManyYears from './ModalInnerTooManyYears';

export const YEARS_OLD_CAP = 60;

const ReviewOrderItem = styled.div`
  display: flex;
  position: relative;
  
  & + & {
    margin-top: 8px;
  }
  
  & + &:before {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.alt4};
    display: block;
    width: 1px;
    height: 12px;
    top: -12px;
    left: 34px;
  }
`;

const OrderReviewStep: FC = () => {
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
    user,
    ...application
  } = useAppSelector(selectApp);

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

  const selectedUserCard = application.selectedUserCard as PaymentCard;
  useGetUserLimitsQuery();
  const [triggerGetQuotes] = useGetQuoteMutation();

  let isLimitsExceeded = false;

  if (isLimitsLoaded) {
    isLimitsExceeded = (limits?.remaining_weekly_limit_usd as string) < source_amount;
  }

  useEffect(() => {
    if (isLimitsExceeded) {
      dispatch(setGeneralError({
        type: 'error',
        message: `You have exceeded the purchase limit. 
        Total weekly limit $${limits?.weekly_limit_usd as string}.
        Remaining limit: $${limits?.remaining_weekly_limit_usd}`,
      }));
    }
  }, [
    dispatch,
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

  const handleClickChangePersonal = () => {
    dispatch(setSkipPersonalInfoStep(false));
    dispatch(goToWidgetStep(WidgetSteps.PERSONAL_INFORMATION));
  };

  const handleModalParentSelector = useCallback(() => {
    const widgetNode = document.getElementById('widget');
    if (widgetNode) {
      return widgetNode;
    }

    return document.body;
  }, []);

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
    >
      <WidgetHead
        text="Review Your Order"
        customBackCallback={() => {
          dispatch(setSkipPaymentStep(false));
          dispatch(decrementWidgetStep());
        }}
      />
      <Flex
        flexDirection="column"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        {!isQuoteLoaded ? (
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            data-testid="ReviewOrderLoader"
            height={50}
            width={50}
          />
        ) : (
          <Flex
            flexDirection="column"
            flex={1}
            justifyContent={['center', 'flex-start']}
            width="100%"
          >
            <ReviewOrderItem data-testid="ReviewOrderItemPay">
              <AmountField
                readOnly
                label="You Pay"
                amountFieldName="quoteSourceAmount"
                currencyFieldName="sourceCurrency"
                currencyOptions={sourceOptions}
                amountValue={source_amount}
                currencyType={source_currency}
              />
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemFee">
              <PreviewBadge label="Fees">
                <Fee
                  c14Fee={absolute_internal_fee}
                  totalFee={total_fee}
                  networkFee={fiat_blockchain_fee}
                  currencyCode={source_currency}
                />
              </PreviewBadge>
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemPaymentMethod">
              <PreviewBadge label="Using Payment Method">
                <Flex justifyContent="space-between" alignItems="flex-end">
                  <CardBadge
                    paymentMethod={selectedUserCard.type}
                    city={user?.city as string}
                    postalCode={user?.postal_code as string}
                    owner={`${user?.first_names as string} ${user?.last_names as string}`}
                    lastNumbers={selectedUserCard.last4}
                  />
                  <Flex flexDirection="column">
                    <BorderButton
                      type="button"
                      onClick={handleClickChangePayment}
                    >
                      Change
                    </BorderButton>
                    <BorderButton
                      type="button"
                      onClick={handleClickChangePersonal}
                    >
                      Change
                    </BorderButton>
                  </Flex>
                </Flex>
              </PreviewBadge>
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemReceive">
              <AmountField
                readOnly
                label="You Receive"
                amountFieldName="quoteTargetAmount"
                currencyFieldName="targetCurrency"
                currencyOptions={targetOptions}
                amountValue={target_amount}
                currencyType={target_crypto_asset_id}
              />
            </ReviewOrderItem>
          </Flex>
        )}
      </Flex>
      <FormRow margin="auto 0 0 0">
        <Button
          onClick={handleClickSubmit}
          disabled={isQuoteLoading || isLimitsExceeded || !isLimitsLoaded}
          data-testid="submitButton"
          type="submit"
        >
          {(isQuoteLoading || !isLimitsLoaded) ? <ButtonLoader /> : 'Buy Now'}
        </Button>
      </FormRow>
      <Modal
        style={selectFieldModalStyles}
        parentSelector={handleModalParentSelector}
        isOpen={isModalOpen}
        title="Warning"
        handleClickClose={handleClickClose}
      >
        {isUserTooManyYearsOld ? (
          <ModalInnerTooManyYears onClose={handleClickClose} />
        ) : (
          <ModalInnerConfirm onConfirm={onConfirm} />
        )}
      </Modal>
    </Flex>
  );
};

export default OrderReviewStep;
