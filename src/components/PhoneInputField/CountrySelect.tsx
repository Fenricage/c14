import React, { ChangeEvent, FC } from 'react';
import {
  Country, getCountries, getCountryCallingCode, Labels,
} from 'react-phone-number-input';
import styled from 'styled-components/macro';

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
      onChange={handleChangeSelect}
    >
      <option value="">
        {labels.ZZ}
      </option>
      {getCountries().map((country) => (
        <option key={country} value={country}>
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
