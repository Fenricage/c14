import React, { FC } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components/macro';
import { ReactComponent as MasterCardIcon } from '../../../../assets/mastercard_icon.svg';

export const StyledMasterCardIcon = styled(MasterCardIcon)`
  margin-right: 12px;
`;

export const PaymentMethodName = styled.b`
  font-weight: 500;
`;

const OwnerContainer = styled.div`
  font-weight: 400;
  margin-top: 6px;
`;

export const LastNumbersContainer = styled.div`
  font-weight: 400;
  display: flex;
  margin-left: 6px;
`;

export const LastNumbersText = styled.span`

`;

export const LastNumbers = styled.span`
  margin-left: 4px;
`;

type CardBadgeProps = {
  lastNumbers: string;
  paymentMethod: string;
  owner: string;
  city: string;
  postalCode: string;
}

const CardBadge: FC<CardBadgeProps> = ({
  lastNumbers,
  owner,
  paymentMethod,
  city,
  postalCode,
}) => (
  <Flex alignItems="center" fontSize="14px">
    <StyledMasterCardIcon />
    <Flex flexDirection="column" justifyContent="center">
      <Flex>
        <PaymentMethodName data-testid="BadgeCardPaymentMethod">
          {paymentMethod}
        </PaymentMethodName>
        <LastNumbersContainer>
          <LastNumbersText>
            ending in
          </LastNumbersText>
          <LastNumbers data-testid="BadgeCardLastNumbers">
            {lastNumbers}
          </LastNumbers>
        </LastNumbersContainer>
      </Flex>
      <Flex>
        <OwnerContainer data-testid="BadgeCardOwner">
          {owner}
          {', '}
          {city}
          {', '}
          {postalCode}
        </OwnerContainer>
      </Flex>
    </Flex>
  </Flex>
);

export default CardBadge;
