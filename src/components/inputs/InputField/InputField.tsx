import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import BaseInputFieldFormikHOC, {
  BaseInputFieldProps,
  BaseInputContainer,
  BaseInputFieldFormikHOCProps,
  BaseInputField,
} from '../BaseInputField/BaseInputField';
import { InputLabel } from '../../../theme/components';

const InputFieldContainerElement = styled.div`
  width: 100%;

  ${BaseInputContainer} {
    margin-bottom: 6px;
  }

  input {
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

const InputField = forwardRef<HTMLDivElement,
  PropsWithChildren<BaseInputFieldFormikHOCProps | BaseInputFieldProps>>(
    (props, ref) => (
      <InputFieldContainerElement>
        {props.disabled ? <BaseInputField {...props as BaseInputFieldProps} ref={ref} />
          : <BaseInputFieldFormikHOC {...props as BaseInputFieldFormikHOCProps} ref={ref} /> }
      </InputFieldContainerElement>
    ),
  );

export default InputField;
