import React, {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  PropsWithChildren,
  KeyboardEvent,
  useRef,
  ChangeEvent,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldHookConfig,
  FieldProps,
  FormikContextType,
  useField, useFormikContext,
} from 'formik';
import _merge from 'lodash/merge';
import styled from 'styled-components/macro';
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

export const InputInner = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  background-color: transparent;
  border: 0 solid transparent;
  outline: none;
  font-style: normal;
  font-family: "Inter",serif;
  font-weight: 600;
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
  label: string;
  onHandleChange?: OnChangeInputField;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
} &
  /* from Field HOC, if wrapped. */
  Partial<FieldProps<string, FormValues>> &
  /* Any extra props. */
  FieldHookConfig<string>;

const InputField = forwardRef<HTMLDivElement, PropsWithChildren<InputFieldProps>>(
  ({
    label,
    autoComplete,
    autoFocus = false,
    /* from Field HOC. */
    field,
    onHandleChange,
    onKeyDown,
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

    const { current: htmlId } = useRef(uuidv4());

    const [
      fieldInputProps,,
      fieldHelpers,
    ] = useField(_merge(fieldHookConfig, field) as FieldHookConfig<string>);

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
        setTouched(true, SHOULD_VALIDATE.FALSE);
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
      <InputContainer ref={ref}>
        {label && (
        <InputLabel htmlFor={htmlId}>
          {label}
        </InputLabel>
        )}
        <InputBox>
          <InputInner>
            <Input
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
              onBlur={handleBlur as FocusEventHandler<HTMLInputElement>}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </InputInner>
        </InputBox>
      </InputContainer>
    );
  },
);

export default InputField;
