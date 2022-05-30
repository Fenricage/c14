import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import InputField, { InputFieldProps, Input, InputContainer } from '../InputField/InputField';
import { InputLabel } from '../../theme/components';

const QuoteInputFieldContainer = styled.div`
  width: 100%;

  ${InputContainer} {
    margin-bottom: 6px;
  }

  ${Input} {
    color: ${({ theme }) => theme.white};
    font-size: 24px;
    line-height: 24px;
    letter-spacing: -0.035em;
    padding: 0;

    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }

  ${InputLabel} {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 10px;
    font-weight: 700;
  }

`;

const QuoteInputField = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldProps>>((props, ref) => (
  <QuoteInputFieldContainer>
    <InputField {...props} ref={ref} />
  </QuoteInputFieldContainer>
));

export default QuoteInputField;
