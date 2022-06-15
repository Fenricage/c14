import React, { FC } from 'react';
import { Flex } from 'rebass';
import { useAppSelector } from '../../../../app/hooks';
import { selectApp } from '../../../../state/applicationSlice';
import { GetPurchaseDetailsResponse, GetPurchaseDetailsResponseStatus } from '../../../../redux/purchaseApi';
import CompleteSuccess from './CompleteSuccess/CompleteSuccess';
import { PaymentCard } from '../../../../redux/cardsApi';
import CompleteFailed from './CompleteFailed/CompleteFailed';

const CompleteStep: FC = () => {
  const application = useAppSelector(selectApp);

  const purchaseDetails = application.purchaseDetails as GetPurchaseDetailsResponse;
  const selectedCard = application.selectedUserCard as PaymentCard;

  const renderComplete = () => {
    if (purchaseDetails.status === GetPurchaseDetailsResponseStatus.BLOCKCHAIN_TRANSFER_PENDING
    || purchaseDetails.status === GetPurchaseDetailsResponseStatus.BLOCKCHAIN_TRANSFER_COMPLETE) {
      return (
        <CompleteSuccess
          purchaseDetails={application.purchaseDetails as GetPurchaseDetailsResponse}
          card={selectedCard}
        />
      );
    }
    if (purchaseDetails.status === GetPurchaseDetailsResponseStatus.CUSTOMER_CHARGE_DECLINED) {
      return (
        <CompleteFailed />
      );
    }
  };

  return (
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <Flex flexDirection="column" flex={1}>
        {renderComplete()}
      </Flex>
    </Flex>
  );
};

export default CompleteStep;
