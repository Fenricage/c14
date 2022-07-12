import React, {
  ChangeEvent, FC, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import styled from 'styled-components/macro';
import { Form, Formik } from 'formik';
import { Flex } from 'rebass';
import debounce from 'just-debounce-it';
import { parse } from 'query-string';
import { toast } from 'react-toastify';
import AutoUpdate from './AutoUpdate';
import { Button, FormRow } from '../../../../theme/components';
import QuoteInputField from '../../../../components/QuoteInputField/QuoteInputField';
import CurrencySelectField, {
  Currency,
  CurrencySelectContainer, SelectOption,
} from '../../../../components/CurrencySelectField/CurrencySelectField';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import Fee from './Fee';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  CALCULATOR_FORM_NAME,
  QuoteInputName,
  incrementWidgetStep,
  selectApp,
  setFee,
  setInitialValuesForm,
  setLastChangedQuoteInputName,
  setQuotesAutoUpdateEnable,
  setQuotesLoading,
  setQuotesUserDecimalSeparator, setQuotesLoaded,
} from '../../../../state/applicationSlice';
import WidgetHead from '../../Widget/WidgetHead';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import { useUpdateQuotes } from './hooks';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

export type UserDecimalSeparator = ',' | '.' | undefined

export type QuoteFormValues = {
  quoteSourceAmount: string;
  quoteTargetAmount: string;
  sourceCurrency: Currency;
  targetCurrency: Currency;
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

export const QuoteInputBox = styled.div<{ hasError?: boolean }>`
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

export const QuoteInputRow = styled.div`
  display: flex;
  align-items: center;
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

export const replaceCommaWithDot = (value: string) => value.replace(',', '.');
const MAX_AMOUNT = 5000;
const validQuoteInputValueRegEx = /^(?:\d{1,3}(?:\d{3})*|\d+)(?:[.|,]\d{0,2})?$/;

type FormAmounts = Pick<QuoteFormValues, 'quoteTargetAmount' | 'quoteSourceAmount'>

const validate = (values: QuoteFormValues) => {
  const errors: Partial<QuoteFormValues> = {};

  const amounts: FormAmounts = {
    quoteSourceAmount: values.quoteSourceAmount,
    quoteTargetAmount: values.quoteTargetAmount,
  };

  Object.entries(amounts).forEach(([key, value]) => {
    if (+(replaceCommaWithDot(value)) === 0 || !value) {
      errors[key as keyof FormAmounts] = 'Type non zero value';
    }

    if (+(replaceCommaWithDot(value)) < 20) {
      errors[key as keyof FormAmounts] = 'Must be at least 20$';
    }

    if (+(replaceCommaWithDot(value)) > MAX_AMOUNT) {
      errors[key as keyof FormAmounts] = `The most you can send is ${MAX_AMOUNT}`;
    }
  });

  return errors;
};

const validateDependsLastChanged = (values: QuoteFormValues, lastChanged: QuoteInputName) => {
  const errors = validate(values);

  if (lastChanged === 'quoteSourceAmount') {
    delete errors.quoteTargetAmount;
  } else {
    delete errors.quoteSourceAmount;
  }

  return errors;
};

export const sourceOptions: SelectOption[] = [
  {
    value: 'USD',
    label: 'USD',
    description: 'USD',
  },
];

export const targetOptions: SelectOption[] = [
  {
    value: 'b2384bf2-b14d-4916-aa97-85633ef05742',
    label: 'USDC',
    description: 'USDC (on Evmos)',
  },
  {
    value: 'c00b9be1-9472-44cc-b384-7f549274de3b',
    label: 'USDC',
    description: 'USDC (on HARMONY)',
  },
];

const QuotesStep: FC = () => {
  const dispatch = useAppDispatch();

  const application = useAppSelector(selectApp);

  const [targetAddress, setTargetAddress] = useState('');

  useEffect(() => {
    const queryStringParsed = parse(window.location.search);

    if (!queryStringParsed.targetAddress) {
      toast.error('targetAddress is missing from URI query params.');
      return;
    }

    setTargetAddress((queryStringParsed as {targetAddress: string}).targetAddress);
  }, []);

  const {
    quotes: {
      target_amount,
      absolute_internal_fee,
      source_amount,
      target_crypto_asset_id,
      fiat_blockchain_fee,
      total_fee,
    },
    fee: {
      total,
      network,
      c14,
    },
    isQuoteLoading,
    lastChangedQuoteInputName,
    isQuoteLoaded: isQuotesLoaded,
    wizard: {
      [CALCULATOR_FORM_NAME]: {
        initialValues: initialQuotesValuesForm,
      },
    },
  } = application;

  const request = useRef<any>(null);

  useClearGeneralError();

  useEffect(() => () => {
    dispatch(setQuotesLoaded(false));
  }, [dispatch]);

  const [triggerGetQuotes, {
    fulfilledTimeStamp,
    status: requestQuoteStatus,
    isError: isQuoteRequestError,
  }] = useGetQuoteMutation();

  // get data for 1st step
  useEffect(() => {
    if (!isQuotesLoaded) {
      triggerGetQuotes({
        source_currency: sourceOptions[0].value,
        target_crypto_asset_id: targetOptions[0].value,
        source_amount: initialQuotesValuesForm.quoteSourceAmount,
      });
    }
  }, [
    initialQuotesValuesForm.quoteSourceAmount,
    isQuotesLoaded,
    triggerGetQuotes,
  ]);

  const submitForm = useCallback(() => Promise.resolve(true), []);

  const handleTriggerUpdateQuotes = useCallback(async (values: QuoteFormValues) => {
    const isValidInput = !Object.keys(validateDependsLastChanged(values, lastChangedQuoteInputName)).length;

    if (!isValidInput) {
      return;
    }

    if (lastChangedQuoteInputName === 'quoteTargetAmount') {
      request.current = triggerGetQuotes({
        source_currency: values.sourceCurrency,
        target_crypto_asset_id: values.targetCurrency,
        target_amount: values.quoteTargetAmount,
      });
      await request.current;
    } else {
      request.current = triggerGetQuotes({
        source_currency: values.sourceCurrency,
        target_crypto_asset_id: values.targetCurrency,
        source_amount: values.quoteSourceAmount,
      });
      await request.current;
    }
  }, [lastChangedQuoteInputName, triggerGetQuotes]);

  useEffect(() => {
    dispatch(setFee({
      c14: absolute_internal_fee,
      network: fiat_blockchain_fee,
      total: total_fee,
    }));
  }, [
    absolute_internal_fee,
    dispatch,
    fiat_blockchain_fee,
    fulfilledTimeStamp,
    total_fee,
  ]);

  useEffect(() => {
    if (!isQuotesLoaded) {
      return;
    }

    // disable autoupdate on reinit form
    dispatch(setQuotesAutoUpdateEnable(false));

    dispatch(setInitialValuesForm({
      formName: CALCULATOR_FORM_NAME,
      state: {
        targetCurrency: target_crypto_asset_id,
        quoteTargetAmount: target_amount,
        quoteSourceAmount: source_amount,
      },
    }));
  }, [dispatch, isQuotesLoaded, source_amount, target_amount, fulfilledTimeStamp, target_crypto_asset_id]);

  const updateQuotes = useUpdateQuotes(handleTriggerUpdateQuotes);

  const debouncedUpdateQuotes = useMemo(
    () => debounce(
      async (values: QuoteFormValues) => {
        await updateQuotes(values);
      },
      650,
    ),
    [updateQuotes],
  );

  const updateUserDecimalSeparator = useCallback((value: string): void => {
    if (value.includes(',')) {
      dispatch(setQuotesUserDecimalSeparator(','));
    }

    if (value.includes('.')) {
      dispatch(setQuotesUserDecimalSeparator('.'));
    }
  }, [dispatch]);

  const handleSetLastChanged = useCallback((
    type: QuoteInputName,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (
      value !== ''
      && !validQuoteInputValueRegEx.test(value)
    ) {
      event.preventDefault();
      return;
    }

    // cancel prev requests
    if (request.current) {
      request.current.abort();
    }

    updateUserDecimalSeparator(value);
    dispatch(setQuotesLoading(true));
    dispatch(setQuotesAutoUpdateEnable(true));
    dispatch(setLastChangedQuoteInputName(type));
  }, [dispatch, updateUserDecimalSeparator]);

  const handleClickNextStep: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(incrementWidgetStep());
  };

  const handleChangeCurrency = () => {
    dispatch(setQuotesLoading(true));
    dispatch(setQuotesAutoUpdateEnable(true));
  };

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
      data-testid="QuoteStep"
    >
      <WidgetHead text="Select Amount" />
      <Formik
        initialValues={initialQuotesValuesForm}
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
            <AutoUpdate
              requestStatus={requestQuoteStatus}
              onChangeFormValues={debouncedUpdateQuotes}
              onExpireTimer={updateQuotes}
            />
            <FormRow>
              <QuoteInputBox hasError={!!errors.quoteSourceAmount && !!touched.quoteSourceAmount}>
                <QuoteInputRow data-testid="quoteSourceAmountContainer">
                  <QuoteInputField
                    label="You Pay"
                    name="quoteSourceAmount"
                    onHandleChange={({
                      value,
                      event,
                    }) => handleSetLastChanged(
                      'quoteSourceAmount',
                      value,
                      event,
                    )}
                    type="string"
                    placeholder="You Pay..."
                  />
                  <CurrencySelectField
                    name="sourceCurrency"
                    options={sourceOptions}
                    onHandleChange={() => handleChangeCurrency()}
                  />
                </QuoteInputRow>
                <FormFieldErrorMessage
                  name="quoteSourceAmount"
                />
              </QuoteInputBox>
            </FormRow>
            <TreeContainer>
              <TreeContainerInner>
                <TreeTitle>Fees</TreeTitle>
                <TreeContainerItem margin="0 0 0 0">
                  <QuotesFeeBox>
                    <Fee
                      c14Fee={c14 || '0'}
                      networkFee={network || '0'}
                      currencyCode={
                        (sourceOptions.find((o) => o.value === values.sourceCurrency) as SelectOption).value
                      }
                      totalFee={total || '0'}
                    />
                  </QuotesFeeBox>
                </TreeContainerItem>
              </TreeContainerInner>
            </TreeContainer>
            <FormRow margin="0 0 46px 0">
              <QuoteInputBox hasError={!!errors.quoteTargetAmount && !!touched.quoteTargetAmount}>
                <QuoteInputRow data-testid="quoteTargetAmountContainer">
                  <QuoteInputField
                    label="You Receive"
                    name="quoteTargetAmount"
                    onHandleChange={
                      ({ value, event }) => handleSetLastChanged(
                        'quoteTargetAmount',
                        value,
                        event,
                      )
                    }
                    type="string"
                    placeholder="You Receive..."
                  />
                  <CurrencySelectField
                    onHandleChange={() => handleChangeCurrency()}
                    name="targetCurrency"
                    options={targetOptions}
                  />
                </QuoteInputRow>
                <FormFieldErrorMessage
                  name="quoteTargetAmount"
                />
              </QuoteInputBox>
            </FormRow>
            <FormRow margin="auto 0 0 0">
              <ButtonBox>
                <Button
                  onClick={handleClickNextStep}
                  disabled={
                    isSubmitting
                    || !isValid
                    || isQuoteLoading
                    || isQuoteRequestError
                    || !targetAddress
                }
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
};

export default QuotesStep;
