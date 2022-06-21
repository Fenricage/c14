import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Currency } from '../CurrencySelectField/CurrencySelectField';
import { ReactComponent as USDIcon } from '../../assets/usd_icon.svg';
import { ReactComponent as EVMOSIcon } from '../../assets/evmos_icon.svg';
import { ReactComponent as HarmonyIcon } from '../../assets/harmony_icon.svg';

const StyledUSDIcon = styled(USDIcon)`

`;

const StyledEVMOSIcon = styled(EVMOSIcon)`

`;

const StyledHarmonyIcon = styled(HarmonyIcon)`

`;

type CurrencyIconProps = {
  optionValue: Currency
}

export const CurrencySelectIconContainer = styled.div`
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

const CurrencyIcon: FC<CurrencyIconProps> = (props) => {
  const {
    optionValue,
  } = props;

  let IconComponent;
  switch (optionValue) {
    case 'USD': {
      IconComponent = StyledUSDIcon;
      break;
    }

    case 'b2384bf2-b14d-4916-aa97-85633ef05742': {
      IconComponent = StyledEVMOSIcon;
      break;
    }

    case 'c00b9be1-9472-44cc-b384-7f549274de3b': {
      IconComponent = StyledHarmonyIcon;
      break;
    }

    default: {
      IconComponent = StyledEVMOSIcon;
    }
  }

  return (
    <CurrencySelectIconContainer>
      <IconComponent />
    </CurrencySelectIconContainer>
  );
};

export default CurrencyIcon;
