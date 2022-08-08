import React, { FC, useEffect } from 'react';
import PersonalInformationStep from './PersonalInformationStep';
import {
  goToWidgetStep,
  incrementWidgetStep, logout,
  setGeneralError,
  WidgetSteps,
} from '../../../../state/applicationSlice';
import {
  selectUserDetails,
  setSkipPersonalInfoStep,
  setUserUpdated,
} from '../../../../state/userDetailsSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useGetUserQuery, useLazyGetUserQuery, useUpdateUserMutation } from '../../../../redux/userApi';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import statesUS from './statesUS';

export const stateOptions = statesUS.map((value) => ({ value, label: value }));

export type PersonalFormValues = {
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

const PersonalInformationStepContainer: FC = () => {
  const dispatch = useAppDispatch();

  const {
    isUserUpdated,
    isUserVerified,
    isEmailVerified,
    isUserLoaded,
    user,
    skipPersonalInfoStep,
  } = useAppSelector(selectUserDetails);

  const { isLoading: isUserLoading, isFetching: isUserFetching } = useGetUserQuery();
  const [triggerLazyGetUser] = useLazyGetUserQuery();
  const [triggerUpdateUser] = useUpdateUserMutation();

  useEffect(() => () => {
    dispatch(setUserUpdated(false));
  }, [dispatch]);

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
    } else if (isUserUpdated && isUserVerified && !isEmailVerified) {
      dispatch(goToWidgetStep({
        shouldUpdateStepper: false,
        widgetStep: WidgetSteps.EMAIL_VERIFICATION,
      }));
      // user already exists
    } else if (isUserNotEmpty && isUserVerified && isEmailVerified) {
      dispatch(incrementWidgetStep());
      //  user exists and verified, but email is not confirmed
    } else if (isUserNotEmpty && !isEmailVerified && isUserVerified) {
      dispatch(goToWidgetStep({
        shouldUpdateStepper: false,
        widgetStep: WidgetSteps.EMAIL_VERIFICATION,
      }));
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

  const initialFormValues: PersonalFormValues = {
    firstNames: user?.first_names || '',
    lastNames: user?.last_names || '',
    country: 'United States',
    email: user?.email || '',
    stateCode: stateOptions[0].value || '',
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

  const onClickNavigateBack = () => {
    dispatch(logout());
  };

  return (
    <PersonalInformationStep
      isLoading={isUserLoading || isUserFetching}
      submitForm={submitForm}
      onClickNavigateBack={onClickNavigateBack}
      stateOptions={stateOptions}
      initialValues={initialFormValues}
    />
  );
};

export default PersonalInformationStepContainer;
