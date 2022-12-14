import React, { ChangeEvent, FC } from 'react';
import {
  Country, getCountryCallingCode, Labels,
} from 'react-phone-number-input';
import styled from 'styled-components/macro';
import countries from './countries';

type PhoneSelectProps = {
  value: Country;
  onChange: (value: string | undefined) => void;
  labels: Labels;
}

export const CountrySelectElement = styled.select`
  width: 100%;
`;

const CountrySelect: FC<PhoneSelectProps> = ({
  value,
  onChange,
  labels,
  ...rest
}) => {
  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value || undefined);
  };

  return (
    <CountrySelectElement
      {...rest}
      value={value}
      data-testid="CountrySelect"
      onChange={handleChangeSelect}
    >
      {countries.map((country) => (
        <option data-testid="CountrySelectOption" key={country} value={country}>
          {labels[country]}
          {' '}
          +
          {getCountryCallingCode(country)}
        </option>
      ))}
    </CountrySelectElement>
  );
};

export default CountrySelect;
