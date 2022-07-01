import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass';
import { Title } from '../../../../../theme/components';
import { ReactComponent as PurchaseCompletedIcon } from '../../../../../assets/purchase_completed_icon.svg';
import { GetPurchaseDetailsResponse } from '../../../../../redux/purchaseApi';
import CompletePreviewCardBadge from './CompletePreviewCardBadge';
import { PaymentCard } from '../../../../../redux/cardsApi';

type CompleteSuccessProps = {
  purchaseDetails: GetPurchaseDetailsResponse
  card: PaymentCard
}

const Address = styled.div`
  width: 120px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`;

const Row = styled.div`
  align-items: center;
  border-top: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  
  & + & {
    border-top-color: rgba(255, 255, 255, .3);
  }
`;

const RowLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`;

const AmountContainer = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
`;

const CurrencyKind = styled.span`
  margin-left: 6px;
`;

const ExplorerLink = styled.a`
  text-decoration: none;
  border-bottom: 1px dashed rgba(255, 255, 255, .5);
  font-size: 14px;
  font-weight: 400;
  
  &:hover {
    border-color: rgba(255, 255, 255, 1);
  }
`;

const CurrencyAmountValue = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const CompleteSuccess: FC<CompleteSuccessProps> = ({
  purchaseDetails,
  card,
}) => (
  <Flex flex={1} flexDirection="column">
    <Title>Purchase Completed</Title>
    <Flex marginTop="12px" width="100%" justifyContent="center">
      <PurchaseCompletedIcon />
    </Flex>
    <Flex marginTop="20px" flex={1} flexDirection="column">
      <Row>
        <RowLabel>Amount sent</RowLabel>
        <AmountContainer>
          <CurrencyAmountValue>{purchaseDetails.source_amount}</CurrencyAmountValue>
          <CurrencyKind>{purchaseDetails.source_currency}</CurrencyKind>
        </AmountContainer>
      </Row>
      <Row>
        <RowLabel>Amount charged</RowLabel>
        <AmountContainer>
          <CurrencyAmountValue>{purchaseDetails.target_amount}</CurrencyAmountValue>
          <CurrencyKind>{purchaseDetails.target_crypto_asset.symbol}</CurrencyKind>
        </AmountContainer>
      </Row>
      <Row>
        <RowLabel>Destination address</RowLabel>
        <AmountContainer>
          <Address>{purchaseDetails.target_blockchain_address}</Address>
        </AmountContainer>
      </Row>
      <Row>
        <RowLabel>Network fee</RowLabel>
        <AmountContainer>
          <span>{purchaseDetails.fiat_blockchain_fee}</span>
          <CurrencyKind>USD</CurrencyKind>
        </AmountContainer>
      </Row>
      <Row>
        <RowLabel>C14 fee</RowLabel>
        <AmountContainer>
          <span>{purchaseDetails.absolute_internal_fee}</span>
          <CurrencyKind>USD</CurrencyKind>
        </AmountContainer>
      </Row>
      <Row>
        <RowLabel>Card for payment</RowLabel>
        <CompletePreviewCardBadge
          cardType={card.type}
          cardLast4Digits={card.last4}
        />
      </Row>
      <Flex marginTop="auto" justifyContent="center">
        <ExplorerLink
          href={purchaseDetails.blockchain_explorer_uri}
          target="_blank"
        >
          View on blockchain explorer
        </ExplorerLink>
      </Flex>
    </Flex>
  </Flex>
);

export default CompleteSuccess;
