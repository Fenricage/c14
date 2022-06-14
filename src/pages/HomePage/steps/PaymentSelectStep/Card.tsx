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

const ExpiredBox = styled.span`
  margin-left: 4px;
`;

type CardProps = {
  expired: string;
  lastNumbers: string;
  paymentMethod: string;
  owner: string;
}

export const Card: FC<CardProps> = ({
  lastNumbers,
  owner,
  paymentMethod,
  expired,
}) => (
  <Flex alignItems="center" fontSize="14px">
    <StyledMasterCardIcon />
    <Flex flexDirection="column" justifyContent="center">
      <Flex>
        <PaymentMethodName data-testid="CardPaymentMethod">
          {paymentMethod}
        </PaymentMethodName>
        <LastNumbersContainer>
          <LastNumbersText>
            ending in
          </LastNumbersText>
          <LastNumbers data-testid="CardLastNumbers">
            {lastNumbers}
          </LastNumbers>
        </LastNumbersContainer>
      </Flex>
      <Flex>
        <OwnerContainer>
          {owner}
          {' '}
          - Expires on
          {' '}
          <ExpiredBox data-testid="CardExpiry">
            {expired}
          </ExpiredBox>
        </OwnerContainer>
      </Flex>
    </Flex>
  </Flex>
);
