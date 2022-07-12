import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import { Formik, Form } from 'formik';
import {
  isPossiblePhoneNumber,
} from 'react-phone-number-input';
import styled from 'styled-components/macro';
import { QueryStatus } from '@reduxjs/toolkit/query';
import {
  Button, FormRow,
} from '../../../../theme/components';
import WidgetHead from '../../Widget/WidgetHead';
import { useAppDispatch } from '../../../../app/hooks';
import {
  incrementWidgetStep,
} from '../../../../state/applicationSlice';
import PhoneInputField, {
  PhoneInputFieldContainer,
} from '../../../../components/PhoneInputField/PhoneInputField';
import { useVerifyPhoneNumberMutation } from '../../../../redux/userApi';
import FormFieldErrorMessage, {
  FormFieldErrorMessageWrapper,
  FormFieldErrorMessageText,
} from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { ReactComponent as PhoneIcon } from '../../../../assets/phone_icon.svg';
import { PRIMARY_BORDER_RADIUS } from '../../../../components/PrimaryInputField/PrimaryInputField';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

type PhoneFormValues = {
  phone?: string;
}

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

const PhoneInputBox = styled.div<{hasError: boolean}>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
  box-shadow: 0 0 0 1px ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
  border-radius: ${PRIMARY_BORDER_RADIUS};
  margin-bottom: 12px;
  padding-bottom: 12px;
  
  ${PhoneInputFieldContainer} {
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

const validate = (values: PhoneFormValues) => {
  const errors: Partial<PhoneFormValues> = {};

  if (!values?.phone) {
    errors.phone = 'Required';
  }

  if (values.phone && !isPossiblePhoneNumber(values.phone)) {
    errors.phone = 'Insert a valid phone number';
  }

  return errors;
};

const PhoneInputStep: FC = () => {
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
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead
        text="Verify Your Phone Number"
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
            isValid, isSubmitting, errors, touched,
          }) => (
            <StyledForm name="phoneAuthentication">
              <Flex flexDirection="column" flex={1} justifyContent="center">
                <PhoneInputBox hasError={!!errors.phone && !!touched.phone}>
                  <PhoneInputField name="phone" />
                  <FormFieldErrorMessage name="phone" />
                </PhoneInputBox>
              </Flex>
              <FormRow margin="auto 0 0 0">
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

export default PhoneInputStep;
