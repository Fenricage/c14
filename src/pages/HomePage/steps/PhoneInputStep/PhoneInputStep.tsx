import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Form, Formik } from 'formik';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { ReactComponent as PhoneIcon } from '../../../../assets/phone_icon.svg';
import PhoneInputField, {
  PhoneInputFieldContainer,
} from '../../../../components/inputs/PhoneInputField/PhoneInputField';
import FormFieldErrorMessage, {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { Button, FormRow } from '../../../../theme/components';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import { PRIMARY_BORDER_RADIUS } from '../../../../components/inputs/PrimaryInputField/PrimaryInputField';
import { PhoneFormValues } from './PhoneInputStepContainer';
import StepIcon from '../../../../components/StepIcon/StepIcon';

interface IPhoneInputStep {
  validate: (values: PhoneFormValues) => Partial<PhoneFormValues>;
  submitForm: (values: PhoneFormValues) => Promise<void>;
  initialFormValues: PhoneFormValues;
}

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  display: flex;
`;

const PhoneInputBox = styled.div<{ hasError: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
  box-shadow: 0 0 0 1px
    ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
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

const PhoneInputStep: FC<IPhoneInputStep> = ({
  validate,
  initialFormValues,
  submitForm,
}) => (
  <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
    <WidgetHead text="Verify Your Phone Number" />
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
            <Flex flexDirection="column" justifyContent="center" flex={1}>
              <StepIcon>
                <PhoneIcon />
              </StepIcon>
              <Flex flexDirection="column">
                <PhoneInputBox hasError={!!errors.phone && !!touched.phone}>
                  <PhoneInputField name="phone" />
                  <FormFieldErrorMessage name="phone" />
                </PhoneInputBox>
              </Flex>
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

export default PhoneInputStep;
