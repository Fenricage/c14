import React, { FC } from 'react';
import styled from 'styled-components/macro';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Country } from 'react-phone-number-input/index';

export const FlagContainer = styled.div`
  width: auto;
  font-size: 24px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type FlagProps = {
  country: Country;
}

const Flag: FC<FlagProps> = ({
  country,
}) => {
  const icon = getUnicodeFlagIcon(country);
  return (
    <FlagContainer>
      {icon}
    </FlagContainer>
  );
};

export default Flag;
