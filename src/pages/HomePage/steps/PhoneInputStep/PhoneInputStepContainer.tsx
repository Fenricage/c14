import React, { FC, useEffect } from 'react';
import {
  isValidPhoneNumber,
} from 'react-phone-number-input';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '../../../../app/hooks';
import {
  incrementWidgetStep,
} from '../../../../state/applicationSlice';
import { useVerifyPhoneNumberMutation } from '../../../../redux/userApi';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import PhoneInputStep from './PhoneInputStep';

export type PhoneFormValues = {
  phone?: string;
}

const validate = (values: PhoneFormValues) => {
  const errors: Partial<PhoneFormValues> = {};

  if (!values?.phone) {
    errors.phone = 'Required';
  }

  if (values.phone && !isValidPhoneNumber(values.phone)) {
    errors.phone = 'Insert a valid phone number';
  }

  return errors;
};

const PhoneInputStepContainer: FC = () => {
  const dispatch = useAppDispatch();
  const [triggerVerifyNumber, { status }] = useVerifyPhoneNumberMutation();

  const initialFormValues = {
    phone: undefined,
  };

  const submitForm = async (values: PhoneFormValues) => {
    if (!values.phone) {
      return;
    }
    await triggerVerifyNumber({ phone_number: values.phone });
  };

  useClearGeneralError();
  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, status]);

  return (
    <PhoneInputStep
      validate={validate}
      initialFormValues={initialFormValues}
      submitForm={submitForm}
    />
  );
};

export default PhoneInputStepContainer;
