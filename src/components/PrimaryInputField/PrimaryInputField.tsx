import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import InputField, {
  Input, InputContainer, InputFieldProps,
} from '../InputField/InputField';
import { InputLabel } from '../../theme/components';
import {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../FormFieldErrorMessage/FormFieldErrorMessage';

export const PRIMARY_BORDER_RADIUS = '10px';

const PrimaryInputFieldContainer = styled.div`
  width: 100%;

  ${InputContainer} {
    margin-bottom: 6px;
  }

  ${Input} {
    border-radius: ${PRIMARY_BORDER_RADIUS};
    border: 1px solid transparent;
    padding: 15px;
    background-color: ${({ theme }) => theme.alt4};
    color: ${({ theme }) => theme.white};
    
    &:hover {
      border-color: ${({ theme }) => theme.alt6};
    }

    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }

  ${InputLabel} {
    font-size: 14px;
    font-weight: 400;
    padding-bottom: 4px;
  }

`;

export const PrimaryInputBox = styled.div<{ hasError: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;

  margin-bottom: 12px;
  padding-bottom: 12px;
  
  ${InputContainer} {
    margin-bottom: 0;
  }

  ${Input} {
    border-bottom-left-radius: ${({ hasError }) => (hasError ? '0' : '10px')};
    border-bottom-right-radius: ${({ hasError }) => (hasError ? '0' : '10px')};
    border-top: 1px solid transparent;
    border-left: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
    border-right: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
    border-top: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
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
    width: auto;
    background: ${({ theme, hasError }) => (hasError ? theme.beige : 'transparent')};
    border-left: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
    border-right: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
    border-bottom: 1px solid ${({ theme, hasError }) => (hasError ? theme.red : 'transparent')};
    border-bottom-left-radius: ${({ hasError }) => (hasError ? '10px' : '0')};
    border-bottom-right-radius: ${({ hasError }) => (hasError ? '10px' : '0')};
  }

  ${FormFieldErrorMessageText} {
    font-size: 14px;
  }
`;

const PrimaryInputField = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldProps>>((props, ref) => (
  <PrimaryInputFieldContainer>
    <InputField {...props} ref={ref} />
  </PrimaryInputFieldContainer>
));

export default PrimaryInputField;
