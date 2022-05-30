import React, { FC } from 'react';
import styled from 'styled-components/macro';

type FeeProps = {
  networkFee: string;
  c14Fee: string;
  totalFee: string;
  currencyCode: string;
}

const FeeContainer = styled.div`
  padding: 12px 10px;
  display: flex;
  overflow: auto;
  background: ${({ theme }) => theme.alt5};
  align-items: center;
  border: 1px solid ${({ theme }) => theme.alt4};
  border-radius: 16px;
`;

const FeeItem = styled.div<{ fontWeight?: number }>`
  display: flex;
  flex-flow: column nowrap;
  font-weight: ${({ fontWeight }) => (fontWeight || '400')};
`;

const FeeLabel = styled.div`
  font-style: normal;
  font-weight: 400;
  font-family: 'Lato', serif;
  white-space: nowrap;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 4px;
  letter-spacing: -0.025em;
  color: #FFFFFF;
  opacity: 0.5;
`;

const FeeText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 13px;
  letter-spacing: -0.025em;
  white-space: nowrap;
`;

const MathOperator = styled.span<{margin?: string}>`
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 32px;
  letter-spacing: -0.035em;
  margin: ${({ margin }) => margin || '0'};
`;

const Fee: FC<FeeProps> = ({
  networkFee,
  c14Fee,
  currencyCode,
  totalFee,
}) => (
  <FeeContainer>
    <FeeItem>
      <FeeLabel>Network Fee</FeeLabel>
      <FeeText>{`${networkFee} ${currencyCode}`}</FeeText>
    </FeeItem>
    <MathOperator margin="0 28px">+</MathOperator>
    <FeeItem>
      <FeeLabel>C14 Fee</FeeLabel>
      <FeeText>{`${c14Fee} ${currencyCode}`}</FeeText>
    </FeeItem>
    <MathOperator margin="0 14px">=</MathOperator>
    <FeeItem fontWeight={700}>
      <FeeLabel>Total Fee</FeeLabel>
      <FeeText>{`${totalFee} ${currencyCode}`}</FeeText>
    </FeeItem>
  </FeeContainer>
);

export default Fee;
