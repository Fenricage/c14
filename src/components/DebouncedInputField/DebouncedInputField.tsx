import React, {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  PropsWithChildren,
  KeyboardEvent,
  useRef,
  ChangeEvent,
} from 'react';
import { DebounceInput } from 'react-debounce-input';

import { v4 as uuidv4 } from 'uuid';
import {
  FieldHookConfig,
  FieldProps,
  FormikContextType,
  useField,
  useFormikContext,
} from 'formik';
import styled, { css } from 'styled-components/macro';
import { InputLabel } from '../../theme/components';
import { SHOULD_VALIDATE } from '../../constants';

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

export const InputBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  width: 100%;
`;

export const sharedInputStyle = css`
  width: 100%;
  color: ${({ theme }) => theme.white};
  background-color: transparent;
  border: 0 solid transparent;
  outline: none;
  font-style: normal;
  font-family: "Inter",serif;
  font-weight: 600;
  
  &:disabled {
    opacity: .75;
  }
`;

export const InputInner = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  
  input {
    ${sharedInputStyle};
    // TODO: Move these into separate sharedInputStyleContainer component that will be used here instead
    // Right now there is a circular dependency problem 
    font-size: 24px;
    line-height: 24px;
    letter-spacing: -0.035em;
    padding: 0;
    &::placeholder {
      color: rgb(82, 120, 141);
    }
  }
`;

export type OnChangeInputField = ({
  context,
  value,
  event,
}: {
  context: FormikContextType<any>;
  value: string;
  event: ChangeEvent<HTMLInputElement>
}) => unknown;

export type InputFieldProps<FormValues = unknown> = {
  label?: string;
  min?: string;
  max?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
} &
  /* from Field HOC, if wrapped. */
  Partial<FieldProps<string, FormValues>> &
  /* Any extra props. */
  FieldHookConfig<string>;

export type InputFieldFormikHOCProps = {
  onHandleChange?: OnChangeInputField;
} & InputFieldProps

export const DebouncedInputField = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldProps>>(
  ({
    label,
    autoComplete,
    autoFocus = false,
    name,
    type,
    placeholder,
    tabIndex,
    value,
    style,
    onKeyDown,
    onBlur,
    onChange,
    disabled,
    min,
    max,
  }, ref) => {
    const { current: htmlId } = useRef(uuidv4());

    return (
      <InputContainer ref={ref}>
        {label && (
          <InputLabel htmlFor={htmlId}>
            {label}
          </InputLabel>
        )}
        <InputBox>
          <InputInner>
            <DebounceInput
              debounceTimeout={650}
              data-testid={name}
              id={htmlId}
              name={name}
              type={type}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              placeholder={placeholder}
              tabIndex={tabIndex}
              onKeyDown={onKeyDown}
              value={value}
              style={style}
              min={min}
              max={max}
              onBlur={onBlur as FocusEventHandler<HTMLInputElement>}
              onChange={onChange as ChangeEventHandler<HTMLInputElement>}
              disabled={disabled}
            />
          </InputInner>
        </InputBox>
      </InputContainer>
    );
  },
);

const DebouncedInputFieldFormikHOC = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldFormikHOCProps>>(
  ({
    label,
    autoComplete,
    autoFocus = false,
    /* from Field HOC. */
    onHandleChange,
    onKeyDown,
    min,
    max,
    /* Any extra props. */
    ...fieldHookConfig
  }, ref) => {
    const {
      type,
      placeholder,
      tabIndex,
      style,
      onBlur,
      disabled,
    } = fieldHookConfig;

    const formikContext = useFormikContext();

    const {
      validateOnBlur,
    } = formikContext;

    const [
      fieldInputProps,,
      fieldHelpers,
    ] = useField(fieldHookConfig as FieldHookConfig<string>);

    const {
      name,
      value,
    } = fieldInputProps;

    const {
      setTouched,
      setValue,
    } = fieldHelpers;

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { value: newValue } = e.target;
      // control changing value in formik
      if (onHandleChange) {
        onHandleChange({ context: formikContext, value: newValue, event: e });
      }

      if (!e.defaultPrevented) {
        setValue(newValue, SHOULD_VALIDATE.TRUE);
      }
    };

    const handleBlur = (e: any) => {
      if (onBlur) {
        onBlur(e);
      }
      setTouched(true, validateOnBlur);
    };

    return (
      <DebouncedInputField
        ref={ref}
        disabled={disabled}
        label={label}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        name={name}
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        tabIndex={tabIndex}
        value={value}
        style={style}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        onChange={handleInputChange}
      />
    );
  },
);

export default DebouncedInputFieldFormikHOC;
