import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import { useField } from 'formik';
import BaseInputField, {
  BaseInputContainer,
  BaseInputFieldProps,
} from '../BaseInputField/BaseInputField';
import { InputLabel } from '../../../theme/components';
import { FORM_CONTROLS_LINE_HEIGHT } from '../../../theme';
import { PrimaryInputBox } from '../../../theme/formComponents';
import FormFieldErrorMessage from '../../FormFieldErrorMessage/FormFieldErrorMessage';

export const PRIMARY_BORDER_RADIUS = '10px';

const PrimaryInputFieldContainer = styled.div`
  width: 100%;

  ${BaseInputContainer} {
    //margin-bottom: 6px;
  }

  input {
    //border-radius: ${PRIMARY_BORDER_RADIUS};
    //border: 1px solid transparent;
    padding: 15px;
    line-height: ${FORM_CONTROLS_LINE_HEIGHT}px;
    background-color: ${({ theme }) => theme.alt4};
    color: ${({ theme }) => theme.white};
    
    /* TODO(@ruslan): date input has another default height, to fix this -  
        rewrite all input, select controls to box-sizing: content-box */
    &[type=date] {
      height: 42px;
    }
    
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

const PrimaryInputField = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseInputFieldProps>
  >((props, ref) => {
    const [, fieldMeta] = useField(props.name);
    const { error, touched } = fieldMeta;
    return (
      <PrimaryInputBox hasError={!!error && touched}>
        <PrimaryInputFieldContainer>
          <BaseInputField {...props} ref={ref} />
        </PrimaryInputFieldContainer>
        <FormFieldErrorMessage name={props.name} />
      </PrimaryInputBox>
    );
  });

export default PrimaryInputField;
