import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { QueryStatus } from '@reduxjs/toolkit/query';
import {
  setRequestCounter, decrementCounter, setFee, selectApp,
} from '../../../../state/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { SECOND_MS } from '../../../../constants';
import { QuoteFormValues } from './QuotesStep';
import usePrevious from '../../../../hooks/usePrevious';

function AutoUpdate({
  onChangeFormValues,
  onExpireTimer,
  requestStatus,
}: {
  onChangeFormValues: (values: any) => void;
  onExpireTimer: (values: QuoteFormValues) => Promise<void>;
  requestStatus: QueryStatus;
}): null {
  const application = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  const formik = useFormikContext<QuoteFormValues>();

  const {
    resetForm,
  } = formik;

  const {
    quotes: {
      expires_at,
      target_amount,
      source_amount,
    },
    isQuotesAutoUpdateEnabled,
  } = application;

  const prevSourceAmount = usePrevious(source_amount);
  const prevTargetAmount = usePrevious(target_amount);

  // NOTE(@ruslan):
  // reset form to initial values if we got same request as before
  // it is needed due to formik doesnt rerender form if got same initialValues as before
  useEffect(() => {
    if (QueryStatus.fulfilled !== requestStatus) {
      return;
    }

    if (prevTargetAmount !== target_amount) {
      return;
    }

    if (prevSourceAmount !== source_amount) {
      return;
    }

    resetForm();
  }, [
    resetForm,
    target_amount,
    requestStatus,
    prevTargetAmount,
    prevSourceAmount,
    source_amount,
  ]);

  // call update quotes data on timer tick
  useEffect(() => {
    if (!expires_at) {
      return;
    }

    const currentTimeMs = Date.now();

    const expiresMs = Date.parse(expires_at);
    const spareTimeBeforeNextReq = 5 * SECOND_MS;
    const diffTime = expiresMs - currentTimeMs - spareTimeBeforeNextReq;
    const counterStep = SECOND_MS;

    const counterTimerMark = setInterval(() => {
      dispatch(decrementCounter(counterStep));
    }, SECOND_MS);
    dispatch(setRequestCounter(diffTime));

    return () => {
      clearInterval(counterTimerMark);
    };
  }, [
    dispatch,
    expires_at,
    onExpireTimer,
  ]);

  useEffect(() => {
    if (!expires_at) {
      return;
    }

    const currentTimeMs = Date.now();

    const expiresMs = Date.parse(expires_at);
    const spareTimeBeforeNextReq = 5 * SECOND_MS;
    const diffTime = expiresMs - currentTimeMs - spareTimeBeforeNextReq;

    const timerMark = setTimeout(async () => {
      await onExpireTimer(formik.values);
    }, diffTime);

    return () => {
      clearTimeout(timerMark);
    };
  }, [expires_at, formik.values, onExpireTimer]);

  // call update quotes data on change form values
  useEffect(() => {
    if (!isQuotesAutoUpdateEnabled) {
      return;
    }

    if (!formik.isValid) {
      dispatch(setFee({
        c14: '0',
        network: '0',
        total: '0',
      }));
    }

    onChangeFormValues(formik.values);
  }, [
    onChangeFormValues,
    formik.values,
    formik.isValid,
    dispatch,
    isQuotesAutoUpdateEnabled,
  ]);

  return null;
}

export default AutoUpdate;
