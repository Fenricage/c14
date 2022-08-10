import React, { ChangeEvent, FC } from 'react';
import { Flex } from 'rebass';
import { Form, Formik } from 'formik';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { CALCULATOR_FORM_NAME, QuoteInputName } from '../../../../state/applicationSlice';
import { Button, FormRow } from '../../../../theme/components';
import {
  CurrencySelectOption,
} from '../../../../components/CurrencySelectField/CurrencySelectField';
import Fee from './Fee';
import {
  QuoteFormValues, sourceOptions, targetOptions,
} from './QuotesStepContainer';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import AmountField from '../../../../components/AmountField/AmountField';

interface IQuotesStep {
  initialQuotesValuesForm: QuoteFormValues;
  isSubmitDisabled: boolean;
  initialTouched: {quoteSourceAmount: boolean, quoteTargetAmount: boolean};
  isQuoteInputDisabled: boolean;
  submitForm: () => Promise<boolean>;
  validate: (values: QuoteFormValues) => Partial<QuoteFormValues>;
  onSourceAmountChange: (type: QuoteInputName, value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onTargetAmountChange: (type: QuoteInputName, value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onSourceCurrencyChange: (currency_id: string) => void;
  onTargetCurrencyChange: (currency_id: string) => void;
  onSubmit: () => void;
  c14Fee?: string;
  networkFee?: string;
  totalFee?: string;
  amountUpdateDebounceMs: number;
}

const ButtonBox = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const TreeContainer = styled.div`
  border-left: 2px solid ${({ theme }) => theme.alt4};
  margin-left: 48px;
`;

const TreeContainerInner = styled.div`
  display: flex;
  flex-flow: column;
  padding: 12px 0 20px 12px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column;
  justify-content: center;
  flex: 1;
`;

const TreeContainerItem = styled.div<{ margin: string }>`
  margin: ${({ margin }) => margin || '0'};
`;

const QuotesFeeBox = styled.div`
  padding: 12px 10px;
  display: flex;
  overflow: auto;
  background: ${({ theme }) => theme.alt5};
  align-items: center;
  border: 1px solid ${({ theme }) => theme.alt4};
  border-radius: 16px;
`;

const TreeTitle = styled.h2`
  font-style: normal;
  position: relative;
  font-weight: 700;
  margin: 0 0 14px 6px;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: -0.025em;

  &:before {
    content: '';
    position: absolute;
    left: -25px;
    top: calc(50% - 5px);
    display: block;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.alt2};;
    border: 3px solid ${({ theme }) => theme.alt4};
    border-radius: 50%;
  }
`;

const QuotesStep: FC<IQuotesStep> = ({
  initialQuotesValuesForm,
  submitForm,
  validate,
  onSourceAmountChange,
  onTargetAmountChange,
  onSourceCurrencyChange,
  onTargetCurrencyChange,
  onSubmit,
  isSubmitDisabled,
  initialTouched,
  isQuoteInputDisabled,
  c14Fee,
  networkFee,
  totalFee,
  amountUpdateDebounceMs,
}) => (
  <Flex
    flexDirection="column"
    flexWrap="nowrap"
    flex={1}
    data-testid="QuoteStep"
  >
    <WidgetHead text="Select Amount" />
    <Formik
      initialValues={initialQuotesValuesForm}
      initialTouched={initialTouched}
      onSubmit={submitForm}
      validate={validate}
      validateOnMount
      enableReinitialize
    >
      {({
        isSubmitting,
        isValid,
        errors,
        touched,
        values,
      }) => (
        <StyledForm
          autoComplete="off"
          data-testid="QuotesForm"
          name={CALCULATOR_FORM_NAME}
        >
          <Flex flexDirection="column" justifyContent="center" flex={1}>
            <FormRow>
              <AmountField
                readOnly={false}
                disabled={isQuoteInputDisabled}
                debounceMs={amountUpdateDebounceMs}
                label="You Pay"
                amountFieldName="quoteSourceAmount"
                currencyFieldName="sourceCurrency"
                currencyOptions={sourceOptions}
                placeholder="You Pay..."
                hasError={!!errors.quoteSourceAmount && !!touched.quoteSourceAmount}
                onAmountChange={({
                  value,
                  event,
                }) => onSourceAmountChange(
                  'quoteSourceAmount',
                  value,
                  event,
                )}
                onCurrencyChange={(currency_id) => onSourceCurrencyChange(currency_id)}
              />
            </FormRow>
            <TreeContainer>
              <TreeContainerInner>
                <TreeTitle>Fees</TreeTitle>
                <TreeContainerItem margin="0 0 0 0">
                  <QuotesFeeBox>
                    <Fee
                      c14Fee={c14Fee || '0'}
                      networkFee={networkFee || '0'}
                      currencyCode={
                        (sourceOptions
                          .find((o) => o.value === values.sourceCurrency) as CurrencySelectOption).value
                      }
                      totalFee={totalFee || '0'}
                    />
                  </QuotesFeeBox>
                </TreeContainerItem>
              </TreeContainerInner>
            </TreeContainer>
            <FormRow margin="0 0 46px 0">
              <AmountField
                readOnly={false}
                disabled={isQuoteInputDisabled}
                debounceMs={amountUpdateDebounceMs}
                label="You Receive"
                amountFieldName="quoteTargetAmount"
                currencyFieldName="targetCurrency"
                currencyOptions={targetOptions}
                placeholder="You Receive..."
                hasError={!!errors.quoteTargetAmount && !!touched.quoteTargetAmount}
                onAmountChange={
                  ({ value, event }) => onTargetAmountChange(
                    'quoteTargetAmount',
                    value,
                    event,
                  )
                }
                onCurrencyChange={(currency_id) => onTargetCurrencyChange(currency_id)}
              />
            </FormRow>
          </Flex>
          <FormRow margin="auto 0 0 0">
            <ButtonBox>
              <Button
                onClick={onSubmit}
                disabled={isSubmitting || !isValid || isSubmitDisabled}
                data-testid="submitButton"
                type="submit"
              >
                {isSubmitting ? (<ButtonLoader />) : 'Buy Now'}
              </Button>
            </ButtonBox>
          </FormRow>
        </StyledForm>
      )}
    </Formik>
  </Flex>
);

export default QuotesStep;
