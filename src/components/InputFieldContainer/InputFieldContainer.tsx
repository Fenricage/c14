import React, { forwardRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components/macro';
import InputFieldFormikHOC, {
  InputField,
  InputFieldProps,
  Input,
  InputContainer,
  InputFieldFormikHOCProps,
} from '../InputField/InputField';
import { InputLabel } from '../../theme/components';

export const sharedInputStyles = css`
  font-size: 24px;
  line-height: 24px;
  letter-spacing: -0.035em;
  padding: 0;
`;

export const sharedLabelStyles = css`
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 10px;
  font-weight: 700;
`;

const InputFieldContainerElement = styled.div`
  width: 100%;

  ${InputContainer} {
    margin-bottom: 6px;
  }

  ${Input} {
    color: ${({ theme }) => theme.white};
    ${sharedInputStyles};

    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }

  ${InputLabel} {
    ${sharedLabelStyles};
  }

`;

const InputFieldContainer = forwardRef<HTMLDivElement,
  PropsWithChildren<InputFieldFormikHOCProps | InputFieldProps>>(
    (props, ref) => (
      <InputFieldContainerElement>
        {props.disabled ? <InputField {...props} ref={ref} /> : <InputFieldFormikHOC {...props} ref={ref} /> }
      </InputFieldContainerElement>
    ),
  );

export default InputFieldContainer;
