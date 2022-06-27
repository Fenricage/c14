import React, { forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components/macro';
import InputField, {
  InputFieldProps,
  Input,
  InputContainer,
} from '../../../../components/InputField/InputField';
import { InputLabel } from '../../../../theme/components';

export const PRIMARY_BORDER_RADIUS = '10px';

const PrimaryInputFieldContainer = styled.div`
  width: 100%;

  ${InputContainer} {
    margin-bottom: 6px;
  }

  ${Input} {
    border-radius: ${PRIMARY_BORDER_RADIUS};
    border: 0;
    padding: 15px;
    background-color: ${({ theme }) => theme.alt4};
    color: ${({ theme }) => theme.white};

    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }

  ${InputLabel} {
    
  }

`;

const PrimaryInputField = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldProps>>((props, ref) => (
  <PrimaryInputFieldContainer>
    <InputField {...props} ref={ref} />
  </PrimaryInputFieldContainer>
));

export default PrimaryInputField;
