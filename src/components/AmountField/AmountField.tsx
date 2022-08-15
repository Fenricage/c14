import React, { FC } from 'react';
import styled from 'styled-components/macro';
import ReactModal from 'react-modal';
import InputField from '../inputs/InputField/InputField';
import CurrencySelect, {
  Currency, CurrencySelectContainer,
  CurrencySelectOption,
} from '../CurrencySelectField/CurrencySelectField';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../FormFieldErrorMessage/FormFieldErrorMessage';
import { OnChangeInputField } from '../inputs/BaseInputField/BaseInputField';

interface IAmountField {
  readOnly: boolean;
  label: string;
  amountFieldName: string;
  currencyFieldName: string;
  disabled?: boolean;
  amountValue?: string,
  currencyType?: string,
  placeholder?: string;
  currencyOptions: CurrencySelectOption[];
  hasError?: boolean;
  debounceMs?: number;
  onAmountChange?: OnChangeInputField;
  onCurrencyChange?: (currency_id: string) => void;
  modalStyle?: ReactModal.Styles;
}

export const AmountFieldRow = styled.div`
  display: flex;
  align-items: center;
`;

export const AmountFieldBox = styled.div<{ hasError?: boolean }>`
  display: flex;
  font-size: 24px;
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
  debounceMs,
  modalStyle,
}) => (
  <AmountFieldBox hasError={hasError}>
    <AmountFieldRow data-testid={`${amountFieldName}Container`}>
      <InputField
        disabled={readOnly || disabled}
        debounceMs={debounceMs}
        value={amountValue}
        label={label}
        name={amountFieldName}
        onHandleChange={onAmountChange}
        type="number"
        placeholder={placeholder}
      />
      <div data-testid={`${amountFieldName}CurrencySelect`}>
        <CurrencySelect
          disabled={readOnly}
          value={currencyType as Currency}
          name={currencyFieldName}
          options={currencyOptions}
          modalStyle={modalStyle}
          onHandleChange={(v) => onCurrencyChange && onCurrencyChange(v.value)}
        />
      </div>
    </AmountFieldRow>
    {!readOnly && (
    <FormFieldErrorMessage
      name={amountFieldName}
    />
    )}
  </AmountFieldBox>
);

export default AmountField;
