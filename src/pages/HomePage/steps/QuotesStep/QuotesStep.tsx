import React, {
  ChangeEvent, FC, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import styled from 'styled-components/macro';
import { Form, Formik } from 'formik';
import { Flex } from 'rebass';
import debounce from 'just-debounce-it';
import AutoUpdate from './AutoUpdate';
import { Button, FormRow } from '../../../../theme/components';
import QuoteInputField from '../../../../components/QuoteInputField/QuoteInputField';
import CurrencySelect, {
  CurrencySelectContainer,
} from '../../../../components/CurrencySelect/CurrencySelect';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import Fee from './Fee';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  CALCULATOR_FORM_NAME,
  incrementStep,
  QuoteInputName,
  selectApp,
  setFee,
  setInitialValuesForm,
  setLastChangedQuoteInputName,
  setQuotesAutoUpdateEnable,
  setQuotesLoading,
  setQuotesUserDecimalSeparator,
} from '../../../../state/applicationSlice';
import WidgetHead from '../../Widget/WidgetHead';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
// import { useGetQuote } from '../../../../redux/quotesHooks';

export type UserDecimalSeparator = ',' | '.' | undefined

export type QuoteFormValues = {
  quoteSourceAmount: string;
  quoteTargetAmount: string;
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

const QuoteInputBox = styled.div<{ hasError: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-flow: column nowrap;
  background: ${({ theme }) => theme.alt4};
  border-radius: 16px;
  box-shadow: 0 0 0 1px ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
  padding: 14px 20px ${({ hasError }) => (hasError ? '14px' : '0')} 26px;

  ${CurrencySelectContainer} {
    transform: translateY(13px);
    padding-left: 8px;
  }

  ${FormFieldErrorMessageWrapper} {
    height: 20px;
    font-size: 14px;
    padding: 2px 36px;
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

const QuoteInputRow = styled.div`
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

const replaceCommaWithDot = (value: string) => value.replace(',', '.');

const validQuoteInputValueRegEx = /^(?:\d{1,3}(?:\d{3})*|\d+)(?:[.|,]\d{0,2})?$/;

const validate = (values: QuoteFormValues) => {
  const errors: Partial<QuoteFormValues> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (+(replaceCommaWithDot(value)) === 0 || !value) {
      errors[key as keyof QuoteFormValues] = 'Type non zero value';
    }

    if (+(replaceCommaWithDot(value)) < 20) {
      errors[key as keyof QuoteFormValues] = 'Must be at least 20$';
    }

    if (+(replaceCommaWithDot(value)) > 1000000000000) {
      errors[key as keyof QuoteFormValues] = 'The most you can send is 1000000000000$';
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

const QuotesStep: FC = () => {
  const dispatch = useAppDispatch();

  const application = useAppSelector(selectApp);

  const {
    quotes: {
      target_amount,
      absolute_internal_fee,
      source_amount,
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

  // mock dropdowns TODO(@ruslan): move to formik selectors
  const [sourceCurrency] = useState('USD');
  const [targetCurrency] = useState('USDC_EVMOS');

  // const {
  //   quotes,
  //   isLoading,
  //   isLoaded,
  // } = useGetQuote({
  //   source_currency: sourceCurrency,
  //   target_currency: targetCurrency,
  //   source_amount: initialQuotesValuesForm.quoteSourceAmount,
  // });

  const [triggerGetQuotes, {
    fulfilledTimeStamp,
    status: requestQuoteStatus,
    isError: isQuoteRequestError,
  }] = useGetQuoteMutation();

  // get data for 1st step
  useEffect(() => {
    if (!isQuotesLoaded) {
      triggerGetQuotes({
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        source_amount: initialQuotesValuesForm.quoteSourceAmount,
      });
    }
  }, [
    initialQuotesValuesForm.quoteSourceAmount,
    isQuotesLoaded,
    sourceCurrency,
    targetCurrency,
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
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        target_amount: values.quoteTargetAmount,
      });
      await request.current;
    } else {
      request.current = triggerGetQuotes({
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        source_amount: values.quoteSourceAmount,
      });
      await request.current;
    }
  }, [lastChangedQuoteInputName, sourceCurrency, targetCurrency, triggerGetQuotes]);

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
        quoteTargetAmount: target_amount,
        quoteSourceAmount: source_amount,
      },
    }));
  }, [
    dispatch,
    isQuotesLoaded,
    source_amount,
    target_amount,
    fulfilledTimeStamp,
  ]);

  const updateQuotes = useCallback(async (values: QuoteFormValues) => {
    try {
      // replace comma to dot and trim comma/dot in the end of string
      const regexReplacer = (match: string, numberPart: string) => numberPart;
      const endWithDotOrCommaRegex = /(^[0-9]+)([,|.])$/i;
      const finalSourceValue = replaceCommaWithDot(values.quoteSourceAmount)
        .replace(endWithDotOrCommaRegex, regexReplacer);
      const finalTargetValue = replaceCommaWithDot(values.quoteTargetAmount)
        .replace(endWithDotOrCommaRegex, regexReplacer);
      await handleTriggerUpdateQuotes({
        ...values,
        quoteSourceAmount: finalSourceValue,
        quoteTargetAmount: finalTargetValue,
      });
      dispatch(setQuotesLoading(false));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [dispatch, handleTriggerUpdateQuotes]);

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

  const handleClickNext: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(incrementStep());
  };

  return (
    <Flex flexDirection="column" flexWrap="nowrap" data-testid="QuoteStep">
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
                  <CurrencySelect text="USD" type="usd" />
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
                  <Fee
                    c14Fee={c14 || '0'}
                    networkFee={network || '0'}
                    currencyCode={sourceCurrency}
                    totalFee={total || '0'}
                  />
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
                  <CurrencySelect text="USDC_EVMOS" type="evmos" />
                </QuoteInputRow>
                <FormFieldErrorMessage
                  name="quoteTargetAmount"
                />
              </QuoteInputBox>
            </FormRow>
            <FormRow>
              <ButtonBox>
                <Button
                  onClick={handleClickNext}
                  disabled={isSubmitting || !isValid || isQuoteLoading || isQuoteRequestError}
                  data-testid="submitButton"
                  type="submit"
                >
                  Buy Now
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
