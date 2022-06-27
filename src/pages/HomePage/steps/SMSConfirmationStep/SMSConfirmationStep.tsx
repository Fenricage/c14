import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components/macro';
import { Form, Formik } from 'formik';
import WidgetHead from '../../Widget/WidgetHead';
import {
  Button, FormRow,
} from '../../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  incrementWidgetStep, selectApp,
} from '../../../../state/applicationSlice';
import PrimaryInputField, { PRIMARY_BORDER_RADIUS } from './PrimaryInputField';
import { useLoginMutation } from '../../../../redux/userApi';
import { notify } from '../../../../utils/toast';
import { Input, InputContainer } from '../../../../components/InputField/InputField';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { ReactComponent as PhoneIcon } from '../../../../assets/phone_icon.svg';

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

type ConfirmationFormValues = {
  code: string;
}

const PrimaryInputBox = styled.div<{hasError: boolean}>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
  box-shadow: 0 0 0 1px ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
  border-radius: ${PRIMARY_BORDER_RADIUS};
  margin-bottom: 12px;
  padding-bottom: 12px;
  
  ${InputContainer} {
    margin-bottom: 0;
  }

  ${Input} {
    border-radius: ${({ hasError }) => (hasError ? '0' : '10px')};
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

const validate = (values: ConfirmationFormValues) => {
  const errors: Partial<ConfirmationFormValues> = {};

  if (typeof +values.code !== 'number' || values.code.length !== 6) {
    errors.code = 'Must be 6 digits value';
  }

  return errors;
};

const SMSConfirmationStep: FC = () => {
  const dispatch = useAppDispatch();

  const [triggerLogin] = useLoginMutation();
  const { phoneNumber, isAuthenticated } = useAppSelector(selectApp);

  const submitForm = async (values: ConfirmationFormValues) => {
    await triggerLogin({
      verification_code: values.code,
      phone_number: phoneNumber as string,
    });
  };

  const initialFormValues: ConfirmationFormValues = {
    code: '',
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(incrementWidgetStep());
      notify.success('Authentication success');
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead
        text="Confirm Your Phone Number"
      />
      <Flex marginTop="12px" width="100%" justifyContent="center">
        <PhoneIcon />
      </Flex>
      <Flex flex={1} alignItems="center">
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
                  Verify
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
