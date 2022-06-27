import React, {
  FC, useState,
} from 'react';
import styled from 'styled-components/macro';
import {
  getCountryCallingCode,
  Value,
  Country,
} from 'react-phone-number-input';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from 'react-phone-number-input/locale/en.json';
import Input from 'react-phone-number-input/input';
import { Flex } from 'rebass';
import { useField } from 'formik';
import CountrySelect, { CountrySelectElement } from './CountrySelect';
import Flag, { FlagContainer } from './Flag';
import { SHOULD_VALIDATE } from '../../constants';
import { PRIMARY_BORDER_RADIUS } from '../../pages/HomePage/steps/SMSConfirmationStep/PrimaryInputField';

const finalLabels = Object.fromEntries(Object.entries(en).filter((i) => i[0] !== 'ZZ'));

type PhoneInputFieldProps = {
  name: string;
}

const LETTER_SPACING = '2px';

export const PhoneInputFieldContainer = styled.div`
  height: 46px;
  border-radius: ${PRIMARY_BORDER_RADIUS};
  background-color: ${({ theme }) => theme.alt4};
  input {
    flex: 1;
    background-color: transparent;
    font-size: 16px;
    padding: 0 20px;
    letter-spacing: ${LETTER_SPACING};
    color: #fff;
    border: 0;
    outline: none;

    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }
`;

const CountryCode = styled.div`
  display: flex;
  font-weight: 400;
  font-family: 'HelveticaNeueCyr', serif;
  position: absolute;
  letter-spacing: ${LETTER_SPACING};
  pointer-events: none;
  top: 16.5px;
  right: 18px;
`;

const LineSeparator = styled.div`
  position: absolute;
  border: .5px solid rgba(255, 255, 255, .25);
  height: 70%;
  top: 50%;
  transform: translateY(-50%);
  right: 0
`;

const CountryBox = styled.div`
  cursor: pointer;
  display: flex;
  position: relative;
  flex-basis: 110px;
  border-radius: ${PRIMARY_BORDER_RADIUS} 0 0 ${PRIMARY_BORDER_RADIUS};
  
  ${FlagContainer} {
    pointer-events: none;
    position:absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
  }
  
  ${CountrySelectElement} {
    opacity: 0;
    cursor: pointer;
  }
`;

const PhoneInputField: FC<PhoneInputFieldProps> = ({
  name,
}) => {
  const [selectValue, setSelectValue] = useState<Country>('US');

  const [
    fieldProps,,
    fieldHelpers,
  ] = useField<string | undefined>(name);

  const {
    value,
  } = fieldProps;

  const {
    setTouched,
    setValue,
  } = fieldHelpers;

  const handleChange = (newValue?: Value) => {
    setValue(newValue, SHOULD_VALIDATE.TRUE);
  };

  const handleChangeSelect = (country?: string) => {
    setSelectValue(country as Country);
  };

  const handleBlur = () => {
    setTouched(true, SHOULD_VALIDATE.TRUE);
  };

  return (
    <PhoneInputFieldContainer>
      <Flex height="100%">
        <CountryBox>
          <Flag country={selectValue} />
          <CountrySelect
            value={selectValue}
            labels={finalLabels}
            onChange={handleChangeSelect}
          />
          <CountryCode>
            +
            {getCountryCallingCode(selectValue)}
          </CountryCode>
          <LineSeparator />
        </CountryBox>
        <Input
          country={selectValue}
          placeholder="Enter phone number"
          onBlur={handleBlur}
          international
          value={value}
          onChange={handleChange}
        />
      </Flex>
    </PhoneInputFieldContainer>
  );
};

export default PhoneInputField;
