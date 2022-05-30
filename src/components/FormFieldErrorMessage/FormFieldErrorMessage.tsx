import React, { FC } from 'react';
import { ErrorMessage } from 'formik';
import styled from 'styled-components/macro';

interface FormFieldErrorMessageProps {
  name: string;
}

export const FormFieldErrorMessageWrapper = styled.div`
  color: ${({ theme }) => theme.red};
  padding: 2px 0 0 0;
  height: 12px;
`;

export const FormFieldErrorMessageText = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
`;

const FormFieldErrorMessage: FC<FormFieldErrorMessageProps> = ({ name }) => (
  <FormFieldErrorMessageWrapper>
    <ErrorMessage
      name={name}
      render={(errorMessage) => (
        <FormFieldErrorMessageText data-testid={`ErrorMessage-${name}`}>
          {errorMessage}
        </FormFieldErrorMessageText>
      )}
    />
  </FormFieldErrorMessageWrapper>
);

export default FormFieldErrorMessage;
