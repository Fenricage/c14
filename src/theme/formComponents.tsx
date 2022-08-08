import styled from 'styled-components/macro';
import {
  BaseInputContainer,
} from '../components/inputs/BaseInputField/BaseInputField';
import {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../components/FormFieldErrorMessage/FormFieldErrorMessage';
import { Select } from '../components/SelectField/SelectField';

const PRIMARY_BORDER_RADIUS = '10px';
/* Primary Controls Theme */
export const PrimaryInputBox = styled.div<{ hasError: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;

  margin-bottom: 12px;
  padding-bottom: 12px;
  
  ${BaseInputContainer} {
    margin-bottom: 0;
  }

  ${Select}, input {
    border-bottom-left-radius: ${({ hasError }) => (hasError ? '0' : '10px')};
    border-bottom-right-radius: ${({ hasError }) => (hasError ? '0' : '10px')};
    border-top-right-radius: ${PRIMARY_BORDER_RADIUS};
    border-top-left-radius: ${PRIMARY_BORDER_RADIUS};
    border-bottom: 1px solid transparent;
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
