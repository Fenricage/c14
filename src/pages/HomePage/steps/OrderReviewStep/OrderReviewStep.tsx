import React, { FC, useCallback, useEffect } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components/macro';
import ReactLoading from 'react-loading';
import { PaymentCard } from '../../../../redux/cardsApi';
import WidgetHead from '../../Widget/WidgetHead';
import PreviewBadge from './PreviewBadge';
import Fee from '../QuotesStep/Fee';
import AmountBadge from './AmountBadge';
import { Card } from '../PaymentSelectStep/Card';
import { Button, FormRow } from '../../../../theme/components';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { incrementWidgetStep, selectApp, setQuotesLoaded } from '../../../../state/applicationSlice';
import useCallOnExpireTimer from '../../../../hooks/useCallOnExpireTimer';
import { targetOptions } from '../QuotesStep/QuotesStep';

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
    ...application
  } = useAppSelector(selectApp);

  const selectedUserCard = application.selectedUserCard as PaymentCard;

  const [triggerGetQuotes] = useGetQuoteMutation();

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
  }, [source_amount, source_currency, target_crypto_asset_id, triggerGetQuotes]);

  useCallOnExpireTimer(expires_at, onExpire);

  const handleClickBuy = () => {
    dispatch(incrementWidgetStep());
  };

  const targetCurrencyLabel = targetOptions.find((o) => o.value === target_crypto_asset_id);

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
    >
      <WidgetHead
        text="Review Your Order"
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
            width="100%"
          >
            <ReviewOrderItem data-testid="ReviewOrderItemPay">
              <AmountBadge
                label="You Pay"
                value={source_amount}
                currencyText={source_currency}
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
                <Card
                  expired={`${selectedUserCard.expiry_month}/${selectedUserCard.expiry_year}`}
                  paymentMethod={selectedUserCard.type}
                  owner="John Doe"
                  lastNumbers={selectedUserCard.last4}
                />
              </PreviewBadge>
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemReceive">
              <AmountBadge
                label="You Receive"
                value={target_amount}
                currencyText={targetCurrencyLabel?.label || ''}
                currencyType={target_crypto_asset_id}
              />
            </ReviewOrderItem>
          </Flex>
        )}
      </Flex>
      <FormRow margin="auto 0 0 0">
        <Button
          onClick={handleClickBuy}
          disabled={isQuoteLoading}
          data-testid="submitButton"
          type="submit"
        >
          Buy Now
        </Button>
      </FormRow>
    </Flex>
  );
};

export default OrderReviewStep;
