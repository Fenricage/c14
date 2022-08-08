import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import SelectField, {
  SelectContainer, Select, SelectFieldProps,
} from '../SelectField/SelectField';
import { InputLabel } from '../../theme/components';
import {
  FormFieldErrorMessageText,
  FormFieldErrorMessageWrapper,
} from '../FormFieldErrorMessage/FormFieldErrorMessage';
import { FORM_CONTROLS_LINE_HEIGHT } from '../../theme';

export const PRIMARY_BORDER_RADIUS = '10px';

export const PrimarySelectFieldContainer = styled.div`
  width: 100%;

  ${Select} {
    border-radius: ${PRIMARY_BORDER_RADIUS};
    border: 1px solid transparent;
    padding: 15px;
    line-height: ${FORM_CONTROLS_LINE_HEIGHT}px;
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

export const PrimarySelectBox = styled.div<{ hasError: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;

  margin-bottom: 12px;
  padding-bottom: 12px;
  
  ${SelectContainer} {
    margin-bottom: 0;
  }

  ${Select} {
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

const PrimarySelectField = forwardRef<HTMLDivElement, PropsWithChildren<SelectFieldProps>>((props, ref) => (
  <PrimarySelectFieldContainer>
    <SelectField {...props} ref={ref} />
  </PrimarySelectFieldContainer>
));

export default PrimarySelectField;
