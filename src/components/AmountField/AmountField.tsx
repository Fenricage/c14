import React, { FC } from 'react';
import styled from 'styled-components/macro';
import CurrencyInputField from '../InputFieldContainer/InputFieldContainer';
import CurrencySelect, {
  Currency, CurrencySelectContainer,
  SelectOption,
} from '../CurrencySelectField/CurrencySelectField';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../FormFieldErrorMessage/FormFieldErrorMessage';
import { OnChangeInputField } from '../InputField/InputField';

interface IAmountField {
  readOnly: boolean;
  label: string;
  amountFieldName: string;
  currencyFieldName: string;
  disabled?: boolean;
  amountValue?: string,
  currencyType?: string,
  placeholder?: string;
  currencyOptions: SelectOption[];
  hasError?: boolean;
  onAmountChange?: OnChangeInputField;
  onCurrencyChange?: (currency_id: string) => void;
}

export const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

export const InputBox = styled.div<{ hasError?: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-flow: column nowrap;
  background: ${({ theme }) => theme.alt4};
  border-radius: 16px;
  box-shadow: 0 0 0 1px ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
  padding: 14px 20px ${({ hasError }) => (hasError ? '14px' : '0')} 26px;

  ${CurrencySelectContainer} {
    //transform: translateY(13px);
    padding: 14px 24px 14px 14px;
  }

  ${FormFieldErrorMessageWrapper} {
    height: 20px;
    font-size: 14px;
    padding: 2px 36px 0 36px;
    display: flex;
    align-items: center;
    letter-spacing: 0.5px;
    font-weight: 400;
    color: ${({ theme }) => theme.red};
    margin: 0 -29px -14px -29px;
    width: auto;
    background: ${({ theme, hasError }) => (hasError ? theme.beige : 'transparent')};
  }

  ${FormFieldErrorMessageText} {
    font-size: 14px;
  }
`;

const AmountField: FC<IAmountField> = ({
  readOnly,
  label,
  disabled,
  amountValue,
  currencyType,
  amountFieldName,
  currencyFieldName,
  placeholder,
  currencyOptions,
  hasError,
  onAmountChange,
  onCurrencyChange,
}) => (
  <InputBox hasError={hasError}>
    <InputRow data-testid={`${amountFieldName}Container`}>
      <CurrencyInputField
        disabled={readOnly || disabled}
        value={amountValue}
        label={label}
        name={amountFieldName}
        onHandleChange={onAmountChange}
        type="number"
        placeholder={placeholder}
      />
      <CurrencySelect
        disabled={readOnly}
        value={currencyType as Currency}
        name={currencyFieldName}
        options={currencyOptions}
        onHandleChange={(v) => onCurrencyChange && onCurrencyChange(v.value)}
      />
    </InputRow>
    {!readOnly && (
    <FormFieldErrorMessage
      name={amountFieldName}
    />
    )}
  </InputBox>
);

export default AmountField;
