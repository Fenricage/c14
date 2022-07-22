import React, {
  ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import debounce from 'just-debounce-it';
import { parse } from 'query-string';
import { toast } from 'react-toastify';

import {
  Currency,
  SelectOption,
} from '../../../../components/CurrencySelectField/CurrencySelectField';
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
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import { useUpdateQuotes } from './hooks';
import QuotesStep from './QuotesStep';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import { useGetUserLimitsQuery } from '../../../../redux/limitsApi';
import { selectLimits, setLimitsLoaded } from '../../../../state/limitsSlice';

export type UserDecimalSeparator = ',' | '.' | undefined

export type QuoteFormValues = {
  quoteSourceAmount: string;
  quoteTargetAmount: string;
  sourceCurrency: Currency;
  targetCurrency: Currency;
}

export const replaceCommaWithDot = (value: string) => value.replace(',', '.');
const validQuoteInputValueRegEx = /^(?:\d{1,3}(?:\d{3})*|\d+)(?:[.|,]\d{0,2})?$/;

type FormAmounts = Pick<QuoteFormValues, 'quoteSourceAmount'>

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

const QuotesStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  const {
    limits,
    isLimitsLoading,
  } = useAppSelector(selectLimits);

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
  } = useAppSelector(selectApp);

  useGetUserLimitsQuery();

  const [targetAddress, setTargetAddress] = useState('');

  useEffect(() => {
    const queryStringParsed = parse(window.location.search);

    if (!queryStringParsed.targetAddress) {
      toast.error('targetAddress is missing from URI query params.');
      return;
    }

    setTargetAddress((queryStringParsed as { targetAddress: string }).targetAddress);
  }, []);

  const request = useRef<any>(null);

  useClearGeneralError();

  useEffect(() => () => {
    dispatch(setLimitsLoaded(false));
  }, [dispatch]);

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

  const validate = useCallback((values: QuoteFormValues) => {
    const errors: Partial<QuoteFormValues> = {};

    const amounts: FormAmounts = {
      quoteSourceAmount: values.quoteSourceAmount,
    };

    Object.entries(amounts).forEach(([key, value]) => {
      if (+(replaceCommaWithDot(value)) === 0 || !value) {
        errors[key as keyof FormAmounts] = 'Type non zero value';
      }

      if (+(replaceCommaWithDot(value)) < 20) {
        errors[key as keyof FormAmounts] = 'Must be at least 20$';
      }

      if (limits?.weekly_limit_usd) {
        if (+(replaceCommaWithDot(value)) > +limits.weekly_limit_usd) {
          errors[key as keyof FormAmounts] = `The most you can buy is ${limits.weekly_limit_usd}`;
        }
      }
    });

    return errors;
  }, [limits?.weekly_limit_usd]);

  const submitForm = useCallback(() => Promise.resolve(true), []);

  const handleTriggerUpdateQuotes = useCallback(async (values: QuoteFormValues) => {
    const isValidInput = !Object.keys(validate(values)).length;

    // deny request only on invalid form and last changed source input
    if (!isValidInput && lastChangedQuoteInputName === 'quoteSourceAmount') {
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
  }, [
    lastChangedQuoteInputName,
    triggerGetQuotes,
    validate,
  ]);

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
  }, [
    dispatch,
    isQuotesLoaded,
    source_amount,
    target_amount,
    fulfilledTimeStamp,
    target_crypto_asset_id,
  ]);

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

  const handleClickNextStep = () => {
    dispatch(incrementWidgetStep());
  };

  const handleChangeCurrency = () => {
    dispatch(setQuotesLoading(true));
    dispatch(setQuotesAutoUpdateEnable(true));
  };

  const initialTouched = useMemo(() => ({
    quoteSourceAmount: true,
    quoteTargetAmount: true,
  }), []);

  const isQuoteInputDisabled = isLimitsLoading || !targetAddress;

  return (
    <QuotesStep
      initialQuotesValuesForm={initialQuotesValuesForm as QuoteFormValues}
      submitForm={submitForm}
      validate={validate}
      initialTouched={initialTouched}
      isQuoteInputDisabled={isQuoteInputDisabled}
      debouncedUpdateQuotes={debouncedUpdateQuotes}
      updateQuotes={updateQuotes}
      requestQuoteStatus={requestQuoteStatus}
      onAmountChange={handleSetLastChanged}
      onCurrencyChange={handleChangeCurrency}
      onSubmit={handleClickNextStep}
      isSubmitDisabled={isLimitsLoading || isQuoteLoading || isQuoteRequestError || !targetAddress}
      c14Fee={c14}
      networkFee={network}
      totalFee={total}
    />
  );
};

export default QuotesStepContainer;
