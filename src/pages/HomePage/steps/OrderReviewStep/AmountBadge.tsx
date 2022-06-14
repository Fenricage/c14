import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass';
import { QuoteInputBox } from '../QuotesStep/QuotesStep';
import { sharedInputStyle } from '../../../../components/InputField/InputField';
import CurrencySelect, {
  Currency, CurrencyIcon,
  CurrencySelectContainer, StyledArrowIcon,
} from '../../../../components/CurrencySelect/CurrencySelect';
import { InputLabel } from '../../../../theme/components';
import { sharedInputStyles, sharedLabelStyles } from '../../../../components/QuoteInputField/QuoteInputField';

type AmountBadgeProps = {
  label: string;
  value: string;
  currencyText: string;
  currencyType: Currency;
}

const AmountTextContainer = styled.div`
  ${sharedInputStyle}
`;

const AmountBadgeContainer = styled.div`
  width: 100%;
  

  ${AmountTextContainer} {
    color: ${({ theme }) => theme.white};
    ${sharedInputStyles};
  }

  ${InputLabel} {
    ${sharedLabelStyles};
  }
  
  ${QuoteInputBox} {
    padding: 14px 20px 14px 26px;
  }
  
  ${CurrencySelectContainer} {
    transform: translateY(0);
  }
  
  ${CurrencyIcon} {
    margin: 0;
  }
  
  ${StyledArrowIcon} {
    display: none;
  }
`;

const AmountBadge: FC<AmountBadgeProps> = (props) => {
  const {
    label,
    value,
    currencyText,
    currencyType,
  } = props;

  return (
    <AmountBadgeContainer>
      <QuoteInputBox>
        <Flex alignItems="flex-start" flexDirection="column">
          <InputLabel>{label}</InputLabel>
          <Flex alignItems="center" width="100%">
            <AmountTextContainer data-testid="AmountBadgeValue">
              {value}
            </AmountTextContainer>
            <CurrencySelect
              text={currencyText}
              type={currencyType}
            />
          </Flex>
        </Flex>
      </QuoteInputBox>
    </AmountBadgeContainer>
  );
};

export default AmountBadge;
