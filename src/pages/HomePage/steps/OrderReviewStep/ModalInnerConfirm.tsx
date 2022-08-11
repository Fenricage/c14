import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';
import {
  Field, Form, Formik, FormikErrors,
} from 'formik';
import { Flex } from 'rebass/styled-components';
import { AnimatedContainer, Button, FormRow } from '../../../../theme/components';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import Alert from '../../Alert';

type ModalInnerConfirmProps = {
  onConfirm: () => void;
}

const ModalInnerConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  font-size: 14px;
`;

const text1 = 'The transaction you are attempting is irreversible. After this transaction\n'
  + 'is completed, no refund is possible.\n'
  + 'Please make sure you are comfortable with all risks associated with\n'
  + 'crypto before attempting to complete this transaction.';

const text2 = 'In order to proceed with this transaction. C14 will need to conduct\n'
  + 'additional verification.';

const ModalConfirmText = styled.p`
  font-weight: 500;
  margin: 5px 0;
  color: ${({ theme }) => theme.alt3}
`;

const StyledForm = styled(Form)`
  flex: 1;
  flex-direction: column;
  display: flex;
  margin-top: 10px;

  input[type=checkbox] {
    margin-right: 4px;
  }
  
  label {
    cursor: pointer;
    padding: 5px 20px;
    color: ${({ theme }) => theme.alt3};
  }
`;

type ConfirmFormValues = {
  confirmYouAreOwner: boolean;
  confirmYouAreNotBroker: boolean;
  agreeToTerms: boolean;
}

const TermsLink = styled.a`
  color: ${({ theme }) => theme.primary1};
  text-decoration: underline;
  font-weight: 600;
  display: inline;
`;

const TermsButton = styled.button`
  color: ${({ theme }) => theme.primary1};
  margin: 0;
  padding: 0;
  text-decoration: underline;
  display: inline;
  font-weight: 600;
`;

const validate = (values: ConfirmFormValues) => {
  const errors: FormikErrors<ConfirmFormValues> = {};

  if (!values.confirmYouAreOwner) {
    errors.confirmYouAreOwner = 'Required';
  }

  if (!values.agreeToTerms) {
    errors.agreeToTerms = 'Required';
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
    agreeToTerms: false,
  };

  const submitForm = () => onConfirm();
  const [showAlert, setShowAlert] = useState(false);

  const handleClickToggleAlert = () => {
    setShowAlert((prev) => !prev);
  };

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
              working with or being guided through this
              transaction by a broker/advisor
            </label>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>
              <Field type="checkbox" name="agreeToTerms" />
              I agree to the
              {' '}
              <TermsLink
                target="_blank"
                href="https://c14.squarespace.com/terms-of-service"
              >
                terms of service
              </TermsLink>
              {' '}
              of
              {' '}
              <TermsButton
                type="button"
                onClick={handleClickToggleAlert}
              >
                C14 Inc
              </TermsButton>
            </label>
            <AnimatedContainer animate={showAlert}>
              <Flex marginTop="14px" width="100%">
                <Alert
                  type="info"
                  showAlertIcon={false}
                  onClose={handleClickToggleAlert}
                >
                  <span>
                    C14 Incorporated,
                    {' '}
                    256 Aspinwall Avenue, Brookline,
                    {' '}
                    MA 02445, United States of America,
                    {' '}
                    Customer Service Contact: legal@c14.money
                    {' '}
                    <TermsLink
                      target="_blank"
                      href="https://c14.squarespace.com/terms-of-service"
                    >
                      Terms of Service — C14
                    </TermsLink>
                  </span>

                </Alert>
              </Flex>
            </AnimatedContainer>
            <FormRow margin="auto 0 0 0">
              <Button
                disabled={!isValid || isSubmitting}
                data-testid="submitButton"
                type="submit"
              >
                {
                  isSubmitting
                    ? <ButtonLoader />
                    : 'Continue'
                }
              </Button>
            </FormRow>
          </StyledForm>
        )}
      </Formik>
    </ModalInnerConfirmContainer>
  );
};

export default ModalInnerConfirm;
