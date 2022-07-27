import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  incrementWidgetStep,
  selectApp,
} from '../../../../state/applicationSlice';
import { useLoginMutation } from '../../../../redux/userApi';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import SMSConfirmationStep from './SMSConfirmationStep';

export type ConfirmationFormValues = {
  code: string;
}

const validate = (values: ConfirmationFormValues) => {
  const errors: Partial<ConfirmationFormValues> = {};

  if (typeof +values.code !== 'number' || values.code.length !== 6) {
    errors.code = 'Must be 6 digits value';
  }

  return errors;
};

const SMSConfirmationStepContainer: FC = () => {
  const [triggerLogin] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectApp);
  const {
    phoneNumber,
  } = useAppSelector(selectApp);

  const submitForm = async (values: ConfirmationFormValues) => {
    await triggerLogin({
      verification_code: values.code,
      phone_number: phoneNumber as string,
    });
  };

  const initialFormValues: ConfirmationFormValues = {
    code: '',
  };

  useClearGeneralError();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(incrementWidgetStep());
  }, [
    dispatch,
    isAuthenticated,
  ]);

  return (
    <SMSConfirmationStep
      submitForm={submitForm}
      validate={validate}
      initialFormValues={initialFormValues}
    />
  );
};

export default SMSConfirmationStepContainer;
