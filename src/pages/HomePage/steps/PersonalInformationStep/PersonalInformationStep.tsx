import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import { Form, Formik } from 'formik';
import styled from 'styled-components/macro';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-duplicates
import isDateFormatMatch from 'date-fns/isMatch';
// eslint-disable-next-line import/no-duplicates
import formatDate from 'date-fns/format';
// eslint-disable-next-line import/no-duplicates
import subDate from 'date-fns/sub';
import ReactLoading from 'react-loading';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  goToWidgetStep,
  incrementWidgetStep,
  logout,
  selectApp,
  setGeneralError,
  setSkipPersonalInfoStep,
  setUserUpdated,
  WidgetSteps,
} from '../../../../state/applicationSlice';
import PrimaryInputField, {
  PrimaryInputBox,
} from '../../../../components/PrimaryInputField/PrimaryInputField';
import { Input } from '../../../../components/InputField/InputField';
import FormFieldErrorMessage from '../../../../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { useGetUserQuery, useLazyGetUserQuery, useUpdateUserMutation } from '../../../../redux/userApi';
import PrimarySelectField from '../../../../components/PrimarySelectField/PrimarySelectField';
import { emailRegEx } from '../../../../constants/regex';
import { Select } from '../../../../components/SelectField/SelectField';
import statesUS from './statesUS';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

const stateOptions = statesUS.map((value) => ({ value, label: value }));

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
  
  ${PrimaryInputBox} {
    margin: 0;
  }
  
  ${Input}, ${Select} {
    padding: 10px;
  }
`;

const ROW_MARGIN = '0 0 0px 0';

type PersonalFormValues = {
  firstNames: string;
  lastNames: string;
  building: string;
  streetName: string;
  country: string;
  email: string;
  stateCode: string;
  city: string;
  postalCode: string;
  dob: string;
  unitNumber: string;
}

const validationSchema = Yup.object({
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

const PersonalInformationStep: FC = () => {
  const dispatch = useAppDispatch();

  const {
    isUserUpdated,
    isUserVerified,
    isEmailVerified,
    isUserLoaded,
    user,
    skipPersonalInfoStep,
  } = useAppSelector(selectApp);

  const { isLoading: isUserLoading, isFetching: isUserFetching } = useGetUserQuery();
  const [triggerLazyGetUser] = useLazyGetUserQuery();
  const [triggerUpdateUser] = useUpdateUserMutation();

  const initialFormValues: PersonalFormValues = {
    firstNames: user?.first_names || '',
    lastNames: user?.last_names || '',
    country: 'United States',
    email: user?.email || '',
    stateCode: user?.state_code || '',
    dob: user?.date_of_birth || '',
    city: user?.city || '',
    postalCode: user?.postal_code || '',
    streetName: user?.street_name || '',
    building: user?.building || '',
    unitNumber: user?.unit_number || '',
  };

  const submitForm = async (values: PersonalFormValues) => {
    try {
      await triggerUpdateUser({
        city: values.city,
        email: values.email,
        building: values.building,
        date_of_birth: values.dob,
        first_names: values.firstNames,
        last_names: values.lastNames,
        postal_code: values.postalCode,
        state_code: values.stateCode,
        street_name: values.streetName,
        unit_number: values.unitNumber,
      }).unwrap();
    } catch {
      return;
    }

    await triggerLazyGetUser();
    dispatch(setSkipPersonalInfoStep(true));
  };

  useEffect(() => {
    if (!isUserVerified && isUserUpdated) {
      dispatch(setGeneralError({
        type: 'error',
        message: 'Unable to verify your identity. Please check that provided details are correct.',
      }));
    }
  }, [dispatch, isUserUpdated, isUserVerified]);

  /* NAVIGATION */
  useEffect(() => {
    if (!skipPersonalInfoStep) {
      return;
    }

    const isUserNotEmpty = isUserLoaded && user && Object.values(user).length;

    // form submitted, user updated and email verified
    if (isUserUpdated && isUserVerified && isEmailVerified) {
      dispatch(incrementWidgetStep());
      // form is submitted but user is not verified
    } else if (isUserUpdated && !isUserVerified) {
      dispatch(goToWidgetStep(WidgetSteps.EMAIL_VERIFICATION));
    // user already exists
    } else if (isUserNotEmpty && isUserVerified && isEmailVerified) {
      dispatch(incrementWidgetStep());
    //  user exists and verified, but email is not confirmed
    } else if (isUserNotEmpty && !isEmailVerified && isUserVerified) {
      dispatch(goToWidgetStep(WidgetSteps.EMAIL_VERIFICATION));
    }
  }, [
    dispatch,
    isEmailVerified,
    isUserLoaded,
    isUserUpdated,
    isUserVerified,
    skipPersonalInfoStep,
    user,
  ]);

  useClearGeneralError();

  useEffect(() => () => {
    dispatch(setUserUpdated(false));
  }, [dispatch]);

  if (isUserLoading || isUserFetching) {
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
        text="Enter the Personal Informations"
        customBackCallback={() => {
          dispatch(logout());
        }}
      />
      <Flex flex={1} height="calc(100% - 60px)">
        <Formik
          initialValues={initialFormValues}
          onSubmit={submitForm}
          validationSchema={validationSchema}
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
                      <PrimaryInputBox hasError={!!errors.firstNames && !!touched.firstNames}>
                        <PrimaryInputField
                          label="First Name"
                          name="firstNames"
                        />
                        <FormFieldErrorMessage name="firstNames" />
                      </PrimaryInputBox>
                    </Flex>
                    <Flex>
                      <PrimaryInputBox hasError={!!errors.lastNames && !!touched.lastNames}>
                        <PrimaryInputField
                          label="Last Name"
                          name="lastNames"
                        />
                        <FormFieldErrorMessage name="lastNames" />
                      </PrimaryInputBox>
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputBox hasError={!!errors.email && !!touched.email}>
                    <PrimaryInputField name="email" label="Email" />
                    <FormFieldErrorMessage name="email" />
                  </PrimaryInputBox>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputBox hasError={!!errors.country && !!touched.country}>
                    <PrimaryInputField disabled name="country" label="Country" />
                    <FormFieldErrorMessage name="country" />
                  </PrimaryInputBox>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex flex={1}>
                      <PrimaryInputBox hasError={!!errors.stateCode && !!touched.stateCode}>
                        <PrimarySelectField
                          label="State"
                          options={stateOptions}
                          name="stateCode"
                        />
                        <FormFieldErrorMessage name="stateCode" />
                      </PrimaryInputBox>
                    </Flex>
                    <Flex flex={1} marginLeft="50px">
                      <PrimaryInputBox hasError={!!errors.dob && !!touched.dob}>
                        <PrimaryInputField
                          label="DOB"
                          name="dob"
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
                        <FormFieldErrorMessage name="dob" />
                      </PrimaryInputBox>
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex>
                      <PrimaryInputBox hasError={!!errors.unitNumber && !!touched.unitNumber}>
                        <PrimaryInputField name="unitNumber" label="Unit number" />
                        <FormFieldErrorMessage name="unitNumber" />
                      </PrimaryInputBox>
                    </Flex>
                    <Flex>
                      <PrimaryInputBox hasError={!!errors.building && !!touched.building}>
                        <PrimaryInputField
                          label="Building"
                          name="building"
                        />
                        <FormFieldErrorMessage name="building" />
                      </PrimaryInputBox>
                    </Flex>
                  </Flex>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <PrimaryInputBox hasError={!!errors.streetName && !!touched.streetName}>
                    <PrimaryInputField
                      label="Street name"
                      name="streetName"
                    />
                    <FormFieldErrorMessage name="streetName" />
                  </PrimaryInputBox>
                </FormRow>
                <FormRow margin={ROW_MARGIN}>
                  <Flex width="100%" justifyContent="space-between">
                    <Flex>
                      <PrimaryInputBox hasError={!!errors.city && !!touched.city}>
                        <PrimaryInputField
                          label="City"
                          name="city"
                        />
                        <FormFieldErrorMessage name="city" />
                      </PrimaryInputBox>
                    </Flex>
                    <Flex>
                      <PrimaryInputBox hasError={!!errors.postalCode && !!touched.postalCode}>
                        <PrimaryInputField
                          label="Postal code"
                          name="postalCode"
                        />
                        <FormFieldErrorMessage name="postalCode" />
                      </PrimaryInputBox>
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
