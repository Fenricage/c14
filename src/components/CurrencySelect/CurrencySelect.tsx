import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';
import { ReactComponent as USDIcon } from '../../assets/usd_icon.svg';
import { ReactComponent as EVMOSIcon } from '../../assets/evmos_icon.svg';

export type Currency = 'usd' | 'evmos'

type CurrencySelectProps = {
  type: Currency;
  text: string;
}

export const CurrencySelectContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
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

export const StyledArrowIcon = styled(ArrowIcon)`
  display: block;
  position: absolute;
  transform: scale(.6);
  top: calc(50% - 6px);
  right: -12px;
`;

const StyledUSDIcon = styled(USDIcon)`

`;

const StyledEVMOSIcon = styled(EVMOSIcon)`

`;

const CurrencySelect: FC<CurrencySelectProps> = ({
  type,
  text,
}) => {
  const renderIcon = (): JSX.Element => {
    let IconComponent;
    switch (type) {
      case 'usd': {
        IconComponent = StyledUSDIcon;
        break;
      }

      case 'evmos': {
        IconComponent = StyledEVMOSIcon;
        break;
      }

      default: {
        IconComponent = StyledEVMOSIcon;
      }
    }

    return (
      <CurrencyIcon>
        <IconComponent />
      </CurrencyIcon>
    );
  };

  return (
    <CurrencySelectContainer>
      <Name>{text}</Name>
      {renderIcon()}
      <StyledArrowIcon />
    </CurrencySelectContainer>
  );
};

export default CurrencySelect;
