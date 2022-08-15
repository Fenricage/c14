import React, { FC } from 'react';
import { Flex } from 'rebass/styled-components';
import { Form, Formik } from 'formik';
import styled from 'styled-components/macro';
// eslint-disable-next-line import/no-duplicates
import formatDate from 'date-fns/format';
import { use100vh } from 'react-div-100vh';
// eslint-disable-next-line import/no-duplicates
import subDate from 'date-fns/sub';
import ReactLoading from 'react-loading';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-duplicates
import isDateFormatMatch from 'date-fns/isMatch';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import PrimaryInputField from '../../../../components/inputs/PrimaryInputField/PrimaryInputField';
import FormFieldErrorMessage from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import PrimarySelectField from '../../../../components/PrimarySelectField/PrimarySelectField';
import { Select, SelectOption } from '../../../../components/SelectField/SelectField';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import { PrimaryInputBox } from '../../../../theme/formComponents';
import { PersonalFormValues } from './PersonalInformationStepContainer';
import { emailRegEx } from '../../../../constants/regex';

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
  
  ${PrimaryInputBox} {
    margin: 0;
  }
  
  ${Select}, input {
    padding: 10px;
  }
`;

const ROW_MARGIN = '0 0 0px 0';
const GAP = '30px';

const WIDGET_TITLE_HEIGHT = 40;
const WIDGET_TITLE_MARGIN = 20;
const WIDGET_TOP_PADDING = 19;
const WIDGET_BOTTOM_PADDING = 30;

const OFFSETS = WIDGET_TITLE_HEIGHT + WIDGET_TITLE_MARGIN + WIDGET_TOP_PADDING + WIDGET_BOTTOM_PADDING;

type PersonalInformationStepProps = {
  initialValues: PersonalFormValues;
  isLoading: boolean;
  submitForm: (values: PersonalFormValues) => Promise<void>;
  stateOptions: SelectOption[];
  onClickNavigateBack: () => void;
}

export const personalInformationValidationSchema = Yup.object({
  firstNames: Yup.string().required('Required'),
  lastNames: Yup.string().required('Required'),
  building: Yup.string().required('Required'),
  streetName: Yup.string().required('Required'),
  email: Yup.string()
    .max(50, 'Must be maximum 50 symbols')
    .matches(emailRegEx, 'Email is invalid')
    .required('Required'),
  stateCode: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required'),
  dob: Yup.string()
    .test(
      'Date of birth validation',
      'yyyy-MM-dd',
      (value) => isDateFormatMatch(value as string, 'yyyy-MM-dd'),
    ),
});

const PersonalInformationStep: FC<PersonalInformationStepProps> = ({
  isLoading,
  submitForm,
  initialValues,
  stateOptions,
  onClickNavigateBack,
}) => {
  const final100Vh = use100vh();

  if (isLoading) {
    return (
      <Flex flex={1} height="100%" alignItems="center" justifyContent="center">
        <ReactLoading
          type="spinningBubbles"
          color="#fff"
          data-testid="ReviewOrderLoader"
          height={50}
          width={50}
        />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
      height="100%"
    >
      <WidgetHead
        text="Personal Information"
        customBackCallback={onClickNavigateBack}
      />
      <Flex height={[
        final100Vh ? `${final100Vh - OFFSETS}px` : 'calc(100% - 120px)',
        'calc(100% - 60px)',
      ]}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={submitForm}
          initialTouched={{
            stateCode: !!initialValues?.stateCode,
          }}
          validationSchema={personalInformationValidationSchema}
          validateOnMount
          enableReinitialize
        >
          {({
            isValid,
            isSubmitting,
            errors,
            touched,
          }) => (
            <StyledForm name="personal-form">
              <Flex flexDirection="column" flex={1} overflow="auto">
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex>
                      <PrimaryInputField
                        disabled
                        label="First Name"
                        name="firstNames"
                      />
                    </Flex>
                    <Flex marginLeft={GAP}>
                      <PrimaryInputField
                        disabled
                        label="Last Name"
                        name="lastNames"
                      />
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputField name="email" label="Email" />
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputField disabled name="country" label="Country" />
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex flex={1}>
                      <PrimaryInputBox hasError={!!errors.stateCode && !!touched.stateCode}>
                        <PrimarySelectField
                          label="State"
                          placeholder="Select state"
                          options={stateOptions}
                          name="stateCode"
                        />
                        <FormFieldErrorMessage name="stateCode" />
                      </PrimaryInputBox>
                    </Flex>
                    <Flex flex={1} marginLeft={GAP}>
                      <PrimaryInputField
                        label="DOB"
                        name="dob"
                        disabled
                        type="date"
                        max={
                          formatDate(
                            subDate(
                              new Date(),
                              { years: 18 },
                            ),
                            'yyyy-MM-dd',
                          )
                        }
                      />
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex>
                      <PrimaryInputField
                        name="unitNumber"
                        label="Unit number"
                      />
                    </Flex>
                    <Flex marginLeft={GAP}>
                      <PrimaryInputField
                        label="Building"
                        name="building"
                      />
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputField
                    label="Street name"
                    name="streetName"
                  />
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex>
                      <PrimaryInputField
                        label="City"
                        name="city"
                      />
                    </Flex>
                    <Flex marginLeft={GAP}>
                      <PrimaryInputField
                        label="Postal code"
                        name="postalCode"
                      />
                    </Flex>
                  </Flex>
                </FormRow>
              </Flex>
              <FormRow margin="14px 0 0 0">
                <Button
                  disabled={!isValid || isSubmitting}
                  data-testid="submitButton"
                  type="submit"
                >
                  {isSubmitting ? <ButtonLoader /> : 'Continue'}
                </Button>
              </FormRow>
            </StyledForm>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default PersonalInformationStep;
