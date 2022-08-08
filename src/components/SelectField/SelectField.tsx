import React, {
  ChangeEventHandler,
  forwardRef,
  PropsWithChildren,
  useRef,
  ChangeEvent,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldHookConfig,
  FieldProps,
  FormikContextType,
  useField,
  useFormikContext,
} from 'formik';
import styled from 'styled-components/macro';
import { InputLabel } from '../../theme/components';
import { SHOULD_VALIDATE } from '../../constants';
import { sharedBaseInputStyle } from '../../theme/sharedStyles';

export const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

export const SelectBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  width: 100%;
`;

export const SelectInner = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
`;

export const Select = styled.select`
  ${sharedBaseInputStyle};
`;

export type SelectOption = {
  label: string;
  value: string;
}

export type OnChangeSelectField = ({
  context,
  value,
  event,
}: {
  context: FormikContextType<any>;
  value: string;
  event: ChangeEvent<HTMLSelectElement>
}) => unknown;

export type SelectFieldProps<FormValues = unknown> = {
  label?: string;
  placeholder: string;
  options: SelectOption[];
  onHandleChange?: OnChangeSelectField;
} &
  /* from Field HOC, if wrapped. */
  Partial<FieldProps<string, FormValues>> &
  /* Any extra props. */
  FieldHookConfig<string>;

const SelectField = forwardRef<HTMLDivElement, PropsWithChildren<SelectFieldProps>>(
  ({
    label,
    autoComplete,
    /* from Field HOC. */
    onHandleChange,
    options,
    /* Any extra props. */
    ...fieldHookConfig
  }, ref) => {
    const {
      placeholder,
      tabIndex,
      style,
      disabled,
    } = fieldHookConfig;

    const formikContext = useFormikContext();

    const { current: htmlId } = useRef(uuidv4());

    const [
      fieldInputProps,,
      fieldHelpers,
    ] = useField(fieldHookConfig as FieldHookConfig<string>);

    const {
      name,
      value,
    } = fieldInputProps;

    const {
      setValue,
    } = fieldHelpers;

    const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
      const { value: newValue } = e.target;
      // control changing value in formik
      if (onHandleChange) {
        onHandleChange({ context: formikContext, value: newValue, event: e });
      }

      if (!e.defaultPrevented) {
        setValue(newValue, SHOULD_VALIDATE.TRUE);
      }
    };

    return (
      <SelectContainer ref={ref}>
        {label && (
        <InputLabel htmlFor={htmlId}>
          {label}
        </InputLabel>
        )}
        <SelectBox>
          <SelectInner>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <Select
              id={htmlId}
              name={name}
              autoComplete={autoComplete}
              placeholder={placeholder}
              tabIndex={tabIndex}
              value={value}
              style={style}
              onChange={handleSelectChange}
              disabled={disabled}
            >
              <option disabled value="">{placeholder}</option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </SelectInner>
        </SelectBox>
      </SelectContainer>
    );
  },
);

export default SelectField;
