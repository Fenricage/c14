import React, { FC } from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components/macro';
import {
  LastNumbersText, LastNumbers, LastNumbersContainer, StyledMasterCardIcon, PaymentMethodName,
} from '../../PaymentSelectStep/Card';

type CompletePreviewCardBadgeProps = {
  cardLast4Digits: string;
  cardType: string;
}

const CompletePreviewCardBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  
  ${LastNumbersContainer} {
    margin-left: 0;
    align-items: baseline;
  }
  
  ${PaymentMethodName}, ${LastNumbersText}, ${LastNumbers} {
    font-size: 12px;
  }
  
  ${StyledMasterCardIcon} {
    margin: 0 0 0 12px;
  }
`;

const CompletePreviewCardBadge: FC<CompletePreviewCardBadgeProps> = ({
  cardLast4Digits,
  cardType,
}) => (
  <CompletePreviewCardBadgeContainer>
    <Flex flexDirection="column">
      <PaymentMethodName>
        {cardType}
      </PaymentMethodName>
      <LastNumbersContainer>
        <LastNumbersText>
          ending in
        </LastNumbersText>
        <LastNumbers>
          {cardLast4Digits}
        </LastNumbers>
      </LastNumbersContainer>
    </Flex>
    <StyledMasterCardIcon />
  </CompletePreviewCardBadgeContainer>
);

export default CompletePreviewCardBadge;
