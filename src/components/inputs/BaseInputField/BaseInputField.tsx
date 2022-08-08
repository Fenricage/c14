import React, {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  KeyboardEvent,
  PropsWithChildren,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldHookConfig, FieldProps, FormikContextType, useField, useFormikContext,
} from 'formik';
import styled from 'styled-components/macro';
import { DebounceInput } from 'react-debounce-input';
import { InputLabel } from '../../../theme/components';
import { SHOULD_VALIDATE } from '../../../constants';
import { sharedBaseInputStyle } from '../../../theme/sharedStyles';

export const BaseInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

export const BaseInputBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  width: 100%;
`;

export const BaseInputInner = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  
  input {
    ${sharedBaseInputStyle};
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

export type BaseInputFieldProps<FormValues = unknown> = {
  label?: string;
  min?: string;
  max?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  debounceMs?: number;
} &
  /* from Field HOC, if wrapped. */
  Partial<FieldProps<string, FormValues>> &
  /* Any extra props. */
  FieldHookConfig<string>;

export type BaseInputFieldFormikHOCProps = {
  onHandleChange?: OnChangeInputField;
} & BaseInputFieldProps

export const BaseInputField = forwardRef<HTMLDivElement, PropsWithChildren<BaseInputFieldProps>>(
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
    debounceMs = 0,
  }, ref) => {
    const { current: htmlId } = useRef(uuidv4());

    return (
      <BaseInputContainer ref={ref}>
        {label && (
          <InputLabel htmlFor={htmlId}>
            {label}
          </InputLabel>
        )}
        <BaseInputBox>
          <BaseInputInner>
            <DebounceInput
              debounceTimeout={debounceMs}
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
          </BaseInputInner>
        </BaseInputBox>
      </BaseInputContainer>
    );
  },
);

const BaseInputFieldFormikHOC = forwardRef<
    HTMLDivElement,
    PropsWithChildren<BaseInputFieldFormikHOCProps>
  >(
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
        <BaseInputField
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

export default BaseInputFieldFormikHOC;
