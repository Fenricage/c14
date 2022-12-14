import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Form, Formik } from 'formik';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { ReactComponent as PhoneIcon } from '../../../../assets/phone_icon.svg';
import {
  Button, FormRow, Subtitle,
} from '../../../../theme/components';
import PrimaryInputField from '../../../../components/inputs/PrimaryInputField/PrimaryInputField';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import { ConfirmationFormValues } from './SMSConfirmationStepContainer';
import StepIcon from '../../../../components/StepIcon/StepIcon';

interface ISMSConfirmationStep {
  validate: (values: ConfirmationFormValues) => Partial<ConfirmationFormValues>;
  submitForm: (values: ConfirmationFormValues) => Promise<void>;
  initialFormValues: ConfirmationFormValues;
}

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  display: flex;
`;

const SMSConfirmationStep: FC<ISMSConfirmationStep> = ({
  initialFormValues,
  validate,
  submitForm,
}) => (
  <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
    <WidgetHead text="Confirm Your Phone Number" />
    <Flex flex={1}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={submitForm}
        validate={validate}
        validateOnMount
        enableReinitialize
      >
        {({
          isValid, isSubmitting,
        }) => (
          <Flex flexDirection="column" width="100%">
            <StyledForm name="confirm-form">
              <Flex flexDirection="column" justifyContent="center" flex={1}>
                <StepIcon>
                  <PhoneIcon />
                </StepIcon>
                <Flex flexDirection="column">
                  <Subtitle margin="0 0 12px 0">
                    Enter SMS verification code
                  </Subtitle>
                  <PrimaryInputField name="code" type="tel" />
                </Flex>
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
          </Flex>
        )}
      </Formik>
    </Flex>
  </Flex>
);

export default SMSConfirmationStep;
