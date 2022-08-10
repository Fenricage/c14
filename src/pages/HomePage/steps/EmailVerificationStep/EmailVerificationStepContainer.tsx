import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import EmailVerificationStep from './EmailVerificationStep';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  selectUserDetails,
  setEmailVerificationSent,
  setSkipPersonalInfoStep,
} from '../../../../state/userDetailsSlice';
import { useLazyGetUserQuery, useSendEmailVerificationMutation } from '../../../../redux/userApi';
import useCallOnExpireTimer from '../../../../hooks/useCallOnExpireTimer';
import { decrementWidgetStep, incrementWidgetStep } from '../../../../state/applicationSlice';

const EmailVerificationStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  const {
    isEmailVerified,
    isEmailVerificationSending,
    isEmailVerificationSent,
  } = useAppSelector(selectUserDetails);

  const [triggerSendEmailVerification] = useSendEmailVerificationMutation();

  const [sendEmailExpiredAt, setSendEmailExpiredAt] = useState<null | string>(null);

  const [triggerGetUser] = useLazyGetUserQuery({ pollingInterval: 3000 });

  const setExpireSendEmailDate = useCallback(() => {
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 90);
    const iso = currentDate.toISOString();
    setSendEmailExpiredAt(iso);
  }, []);

  const callOnExpiredEmailSendTimer = useCallback(() => {
    setSendEmailExpiredAt(null);
  }, []);

  useCallOnExpireTimer(sendEmailExpiredAt as string, callOnExpiredEmailSendTimer);

  useEffect(() => {
    dispatch(setEmailVerificationSent(true));
  }, [dispatch]);

  useEffect(() => {
    if (!isEmailVerificationSent) {
      return;
    }

    const getUser = async () => {
      await triggerGetUser();
    };

    getUser();
  }, [isEmailVerificationSent, triggerGetUser]);

  useEffect(() => {
    if (isEmailVerified) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, isEmailVerified]);

  const handleClickModifyEmail = () => {
    dispatch(setSkipPersonalInfoStep(false));
    dispatch(decrementWidgetStep());
  };

  const handleClickResendEmail = async () => {
    setExpireSendEmailDate();
    await triggerSendEmailVerification();
  };

  return (
    <EmailVerificationStep
      onClickResendEmail={handleClickResendEmail}
      onClickModifyEmail={handleClickModifyEmail}
      isLoading={isEmailVerificationSending || !!sendEmailExpiredAt}
    />
  );
};

export default EmailVerificationStepContainer;
