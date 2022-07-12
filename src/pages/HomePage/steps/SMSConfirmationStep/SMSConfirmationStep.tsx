import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components/macro';
import { Form, Formik } from 'formik';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow, Subtitle } from '../../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  incrementWidgetStep,
  selectApp,
} from '../../../../state/applicationSlice';
import PrimaryInputField, {
  PrimaryInputBox,
} from '../../../../components/PrimaryInputField/PrimaryInputField';
import { useLoginMutation } from '../../../../redux/userApi';
import FormFieldErrorMessage from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { ReactComponent as PhoneIcon } from '../../../../assets/phone_icon.svg';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

type ConfirmationFormValues = {
  code: string;
}

const validate = (values: ConfirmationFormValues) => {
  const errors: Partial<ConfirmationFormValues> = {};

  if (typeof +values.code !== 'number' || values.code.length !== 6) {
    errors.code = 'Must be 6 digits value';
  }

  return errors;
};

const SMSConfirmationStep: FC = () => {
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
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead
        text="Confirm Your Phone Number"
      />
      <Flex marginTop="12px" width="100%" justifyContent="center">
        <PhoneIcon />
      </Flex>
      <Flex flex={1}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={submitForm}
          validate={validate}
          validateOnMount
          enableReinitialize
        >
          {({
            isValid,
            isSubmitting,
            errors,
            touched,
          }) => (
            <StyledForm name="confirm-form">
              <Flex flexDirection="column" flex={1} justifyContent="center">
                <Subtitle margin="0 0 24px 0">Enter SMS verification code</Subtitle>
                <PrimaryInputBox hasError={!!errors.code && !!touched.code}>
                  <PrimaryInputField name="code" type="tel" />
                  <FormFieldErrorMessage name="code" />
                </PrimaryInputBox>
              </Flex>
              <FormRow>
                <Button
                  disabled={!isValid || isSubmitting}
                  data-testid="submitButton"
                  type="submit"
                >

                  {isSubmitting ? <ButtonLoader /> : 'Verify'}
                </Button>
              </FormRow>
            </StyledForm>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default SMSConfirmationStep;
