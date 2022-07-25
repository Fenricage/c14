import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass/styled-components';
import { parse } from 'query-string';
import ReactLoading from 'react-loading';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { incrementWidgetStep, selectApp } from '../../../../state/applicationSlice';
import { PaymentCard } from '../../../../redux/cardsApi';
import {
  GetPurchaseDetailsResponseStatus,
  useExecutePurchaseMutation,
  useLazyGetPurchaseDetailsQuery,
} from '../../../../redux/purchaseApi';
import { Subtitle, Title } from '../../../../theme/components';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';

const PurchaseInProgressStep: FC = () => {
  const dispatch = useAppDispatch();

  const application = useAppSelector(selectApp);

  const { purchaseDetails } = application;

  const quoteId = application.quotes.id;
  const cardId = (application.selectedUserCard as PaymentCard).card_id;

  const queryStringParsed = parse(window.location.search);
  const { targetAddress } = queryStringParsed as {targetAddress: string};

  useClearGeneralError();

  const [triggerExecutePurchase, {
    isLoading: isPurchaseExecuting,
    data,
  }] = useExecutePurchaseMutation();
  const [fetchGetPurchaseDetails, {
    isLoading: isPurchaseDetailsLoading,
  }] = useLazyGetPurchaseDetailsQuery({ pollingInterval: 1000 });

  useEffect(() => {
    if (isPurchaseDetailsLoading) {
      return;
    }

    if (purchaseDetails?.status === GetPurchaseDetailsResponseStatus.BLOCKCHAIN_TRANSFER_PENDING
      || purchaseDetails?.status === GetPurchaseDetailsResponseStatus.BLOCKCHAIN_TRANSFER_COMPLETE
      || purchaseDetails?.status === GetPurchaseDetailsResponseStatus.CUSTOMER_CHARGE_DECLINED
    ) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, isPurchaseDetailsLoading, purchaseDetails, purchaseDetails?.status]);

  useEffect(() => {
    triggerExecutePurchase({
      card_id: cardId,
      quote_id: quoteId,
      target_blockchain_address: targetAddress,
    });
  }, [cardId, quoteId, targetAddress, triggerExecutePurchase]);

  useEffect(() => {
    if (isPurchaseExecuting || !data?.id) {
      return;
    }

    fetchGetPurchaseDetails(data.id);
  }, [data?.id, fetchGetPurchaseDetails, isPurchaseExecuting]);

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      flex={1}
    >
      <Title margin="0">We’re Processing Your Payment</Title>
      <Subtitle margin="10px 0 40px 0">Please do not refresh or close this window</Subtitle>
      <ReactLoading
        type="spinningBubbles"
        color="#fff"
        data-testid="ReviewOrderLoader"
        height={50}
        width={50}
      />
    </Flex>
  );
};

export default PurchaseInProgressStep;
