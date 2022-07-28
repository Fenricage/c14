import React, { FC } from 'react';
import styled from 'styled-components/macro';
import {
  Field, Form, Formik, FormikErrors,
} from 'formik';
import { Button, FormRow } from '../../../../theme/components';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

type ModalInnerConfirmProps = {
  onConfirm: () => void;
}

const ModalInnerConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const text1 = 'The transaction you are attempting is irreversible. After this transaction\n'
  + 'is completed, no refund is possible.\n'
  + 'Please make sure you are comfortable with all risks associated with\n'
  + 'crypto before attempting to complete this transaction.';

const text2 = 'In order to proceed with this transaction. C14 will need to conduct\n'
  + 'additional verification.';

const ModalConfirmText = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.alt3}
`;

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;

  input[type=checkbox] {
    margin-right: 4px;
  }
  
  label {
    cursor: pointer;
    padding: 10px 20px;
    color: ${({ theme }) => theme.alt3};
  }
`;

type ConfirmFormValues = {
  confirmYouAreOwner: boolean;
  confirmYouAreNotBroker: boolean;
}

const validate = (values: ConfirmFormValues) => {
  const errors: FormikErrors<ConfirmFormValues> = {};

  if (!values.confirmYouAreOwner) {
    errors.confirmYouAreOwner = 'Required';
  }

  if (!values.confirmYouAreNotBroker) {
    errors.confirmYouAreNotBroker = 'Required';
  }

  return errors;
};

const ModalInnerConfirm: FC<ModalInnerConfirmProps> = ({ onConfirm }) => {
  const initialFormValues: ConfirmFormValues = {
    confirmYouAreOwner: false,
    confirmYouAreNotBroker: false,
  };

  const submitForm = () => onConfirm();

  return (
    <ModalInnerConfirmContainer data-testid="ModalInnerConfirmContainer">
      <ModalConfirmText>{text1}</ModalConfirmText>
      <ModalConfirmText>{text2}</ModalConfirmText>
      <Formik
        initialValues={initialFormValues}
        onSubmit={submitForm}
        validateOnMount
        validate={validate}
        enableReinitialize
      >
        {({
          isValid,
          isSubmitting,
        }) => (
          <StyledForm>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>
              <Field type="checkbox" name="confirmYouAreOwner" />
              Please check this box to confirm you are making this
              transaction of your own free will
            </label>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>
              <Field type="checkbox" name="confirmYouAreNotBroker" />
              Please check this box to confirm you are not
              workign with or being guided through this
              transaciton by a broker/advisor
            </label>
            <FormRow margin="auto 0 0 0">
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
    </ModalInnerConfirmContainer>
  );
};

export default ModalInnerConfirm;
