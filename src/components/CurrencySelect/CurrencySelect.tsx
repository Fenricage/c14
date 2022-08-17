import React, { FC } from 'react';
import styled from 'styled-components/macro';
import CurrencySelectIcon, { CurrencySelectIconContainer } from '../CurrencySelectIcon/CurrencySelectIcon';
import { Currency } from '../CurrencySelectModal/CurrencySelectModal';

type CurrencySelectProps = {
  type: Currency;
  text: string;
}

export const CurrencySelectContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  
  ${CurrencySelectIconContainer} {
    margin-right: 0;
  }
`;

const Name = styled.span`
  font-weight: 700;
  font-family: 'Pragmatica Extended', serif;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: -0.035em;
  margin-right: 12px;
`;

export const CurrencyIcon = styled.div`
  min-width: 24px;
  min-height: 24px;
  width: 24px;
  height: 24px;
  display: flex;
  background: #62688F;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border-radius: 50%;
`;

const CurrencySelect: FC<CurrencySelectProps> = ({
  type,
  text,
}) => (
  <CurrencySelectContainer>
    <Name data-testid="currency-symbol">{text}</Name>
    <CurrencySelectIcon optionValue={type} />
  </CurrencySelectContainer>
);

export default CurrencySelect;
