import React, {
  FC, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import {
  Currency,
  CurrencySelectOption,
} from '../../../../components/CurrencySelectField/CurrencySelectField';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  QuoteInputName,
  incrementWidgetStep,
  selectApp,
  setQuote,
} from '../../../../state/applicationSlice';
import { useGetQuoteMutation } from '../../../../redux/quotesApi';
import QuotesStep from './QuotesStep';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import { useGetUserLimitsQuery } from '../../../../redux/limitsApi';
import { selectLimits } from '../../../../state/limitsSlice';

export type QuoteFormValues = {
  quoteSourceAmount: string;
  quoteTargetAmount: string;
  sourceCurrency: Currency;
  targetCurrency: Currency;
}

export const replaceCommaWithDot = (value: string) => value.replace(',', '.');
const countDecimals = (value: string) => {
  const float_value = parseFloat(value);
  if (float_value && float_value % 1 !== 0) {
    return float_value.toString()
      .split('.')[1].length;
  }
  return 0;
};
type FormAmounts = Pick<QuoteFormValues, 'quoteSourceAmount'>

export const sourceOptions: CurrencySelectOption[] = [
  {
    value: 'USD',
    label: 'USD',
    description: 'USD',
  },
];

export const targetOptions: CurrencySelectOption[] = [
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

  const { limits, isLimitsLoading } = useAppSelector(selectLimits);
  const { isQuoteLoading, blockChainTargetAddress } = useAppSelector(selectApp);

  useGetUserLimitsQuery();

  const [sourceCurrencyId, setSourceCurrencyId] = useState(sourceOptions[0].value as string);
  const [targetCurrencyId, setTargetCurrencyId] = useState(targetOptions[0].value as string);

  const [quoteSourceAmount, setQuoteSourceAmount] = useState('100');
  const [quoteTargetAmount, setQuoteTargetAmount] = useState('');
  const [lastChangedQuoteInputName, setLastChangedQuoteInputName] = useState('');

  const [c14Fee, setC14Fee] = useState('');
  const [networkFee, setNetworkFee] = useState('');
  const [totalFee, setTotalFee] = useState('');

  const [isPristine, setIsPristine] = useState(false);

  const request = useRef<any>(null);

  useClearGeneralError();

  const [triggerGetQuotes, { isError: isQuoteRequestError }] = useGetQuoteMutation();

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

      if (countDecimals(value) > 2) {
        errors[key as keyof FormAmounts] = 'Number of decimal places must be no more than 2';
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

  const runUpdateQuotes = useCallback(async () => {
    if (!(sourceCurrencyId && targetCurrencyId && (quoteSourceAmount || quoteTargetAmount))) {
      return;
    }

    if (isPristine) {
      return;
    }

    if (request.current) {
      request.current.abort();
    }

    const isValidInput = !Object.keys(validate({
      sourceCurrency: sourceCurrencyId as Currency,
      targetCurrency: targetCurrencyId as Currency,
      quoteSourceAmount,
      quoteTargetAmount,
    })).length;

    // deny request only on invalid form and last changed source input
    if (!isValidInput && lastChangedQuoteInputName === 'quoteSourceAmount') {
      return;
    }

    if (lastChangedQuoteInputName === 'quoteTargetAmount') {
      request.current = triggerGetQuotes({
        source_currency: sourceCurrencyId as Currency,
        target_crypto_asset_id: targetCurrencyId as Currency,
        target_amount: quoteTargetAmount,
      });
    } else {
      request.current = triggerGetQuotes({
        source_currency: sourceCurrencyId as Currency,
        target_crypto_asset_id: targetCurrencyId as Currency,
        source_amount: quoteSourceAmount,
      });
    }

    const json_response = (await request.current).data;

    if (json_response) {
      setQuoteSourceAmount(json_response.source_amount);
      setQuoteTargetAmount(json_response.target_amount);
      setC14Fee(json_response.absolute_internal_fee);
      setNetworkFee(json_response.fiat_blockchain_fee);
      setTotalFee(json_response.total_fee);
      dispatch(setQuote(json_response));
      setIsPristine(true);
    }
  }, [
    dispatch,
    isPristine,
    quoteSourceAmount,
    quoteTargetAmount,
    sourceCurrencyId,
    targetCurrencyId,
    triggerGetQuotes,
    validate,
    lastChangedQuoteInputName,
  ]);

  useEffect(() => {
    runUpdateQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // do not add runUpdateQuotes as a dependency, otherwise makes two calls to /quotes,
    sourceCurrencyId,
    targetCurrencyId,
    quoteSourceAmount,
    quoteTargetAmount,
  ]);

  const onSourceAmountChange = ((
    type: QuoteInputName,
    value: string,
  ) => {
    setIsPristine(false);
    setQuoteSourceAmount(value);
    setLastChangedQuoteInputName(type);
  });

  const onTargetAmountChange = ((
    type: QuoteInputName,
    value: string,
  ) => {
    setIsPristine(false);
    setQuoteTargetAmount(value);
    setLastChangedQuoteInputName(type);
  });
  const handleClickNextStep = () => {
    dispatch(incrementWidgetStep());
  };

  const onSourceCurrencyChange = (target_currency_id: string) => {
    setIsPristine(false);
    setSourceCurrencyId(target_currency_id);
  };

  const onTargetCurrencyChange = (target_currency_id: string) => {
    setIsPristine(false);
    setTargetCurrencyId(target_currency_id);
  };

  const initialTouched = useMemo(() => ({
    quoteSourceAmount: true,
    quoteTargetAmount: true,
  }), []);

  const isQuoteInputDisabled = isLimitsLoading || blockChainTargetAddress === null;

  const quotesValues = {
    sourceCurrency: sourceCurrencyId as Currency,
    targetCurrency: targetCurrencyId as Currency,
    quoteSourceAmount,
    quoteTargetAmount,
  } as QuoteFormValues;

  return (
    <QuotesStep
      initialQuotesValuesForm={quotesValues}
      submitForm={submitForm}
      validate={validate}
      amountUpdateDebounceMs={650}
      initialTouched={initialTouched}
      isQuoteInputDisabled={isQuoteInputDisabled}
      onSourceAmountChange={onSourceAmountChange}
      onTargetAmountChange={onTargetAmountChange}
      onSourceCurrencyChange={(currency_id) => onSourceCurrencyChange(currency_id)}
      onTargetCurrencyChange={(currency_id) => onTargetCurrencyChange(currency_id)}
      onSubmit={handleClickNextStep}
      isSubmitDisabled={isLimitsLoading || isQuoteLoading || isQuoteRequestError
        || blockChainTargetAddress === null}
      c14Fee={c14Fee}
      networkFee={networkFee}
      totalFee={totalFee}
    />
  );
};

export default QuotesStepContainer;
