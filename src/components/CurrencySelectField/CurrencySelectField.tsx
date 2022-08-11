import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { FormikContextType, useField, useFormikContext } from 'formik';
import ReactModal from 'react-modal';
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';
import { sourceOptions } from '../../pages/HomePage/steps/QuotesStep/QuotesStepContainer';
import { SHOULD_VALIDATE } from '../../constants';
import CurrencySelectIcon from '../CurrencySelectIcon/CurrencySelectIcon';
import Modal from '../Modal/Modal';

export type Currency = 'USD' | 'b2384bf2-b14d-4916-aa97-85633ef05742' | 'c00b9be1-9472-44cc-b384-7f549274de3b'

export type CurrencySelectOption = {
  value: Currency
  description?: string;
  label: string
}

export type OnChangeCurrencySelectField = ({
  context,
  value,
}: {
  context: FormikContextType<any>;
  value: string;
}) => unknown;

type CommonSelectFieldProps = {
  disabled?: boolean;
  options: CurrencySelectOption[];
}

type CurrencySelectFieldHOCProps = CommonSelectFieldProps & {
  name: string;
  onHandleChange: OnChangeCurrencySelectField;
  modalStyle?: ReactModal.Styles;
}

type CurrencySelectFieldProps = CommonSelectFieldProps & {
  value: Currency;
  onOpenModalClick?: () => void;
  children?: React.ReactElement;
}

type CurrencySelectFieldItemProps = {
  name: string;
  icon: JSX.Element;
}

export const CurrencySelectContainer = styled.div`
  cursor: pointer;
  display: flex;
  position: relative;
  border-radius: 12px;
  align-items: center;
  &:hover {
    background-color: rgba(0, 0, 0, .15);
  }
`;

const Name = styled.span`
  font-weight: 700;
  font-family: 'Pragmatica Extended', serif;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: -0.035em;
  margin-right: 12px;
`;

export const StyledArrowIcon = styled(ArrowIcon)`
  display: block;
  position: absolute;
  transform: scale(.6);
  top: calc(50% - 6px);
  right: 6px;
`;

const CurrencyItem = styled.div`
  cursor: pointer;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  color: ${({ theme }) => theme.alt3};
  
  &:hover {
    background: rgba(0, 0, 0, .05);
  }
`;

const CurrencySelectFieldItem: FC<CurrencySelectFieldItemProps> = ({ name, icon }) => (
  <>
    <Name>{name}</Name>
    {icon}
  </>
);

export const CurrencySelectField: FC<CurrencySelectFieldProps> = ({
  options,
  disabled,
  onOpenModalClick,
  value,
  children,
}) => {
  const selected = options.find((o) => o.value === value);
  const handleClickSelect = () => {
    if (!disabled && onOpenModalClick) {
      onOpenModalClick();
    }
  };

  return (
    <CurrencySelectContainer onClick={handleClickSelect}>
      <CurrencySelectFieldItem
        name={selected?.label || sourceOptions[0].label}
        icon={<CurrencySelectIcon optionValue={selected?.value || 'USD'} />}
      />
      {!disabled && children}
    </CurrencySelectContainer>
  );
};

const CurrencySelectFieldHOC: FC<CurrencySelectFieldHOCProps> = ({
  name,
  options,
  onHandleChange,
  disabled = false,
  modalStyle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    fieldProps,,
    fieldHelpers,
  ] = useField<string>(name);

  const context = useFormikContext();

  const {
    value,
  } = fieldProps;

  const {
    setTouched,
    setValue,
  } = fieldHelpers;

  const handleClickSelect = () => {
    setIsModalOpen(true);
  };

  const handleClickClose = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  }, []);

  const handleModalParentSelector = useCallback(() => {
    const widgetNode = document.getElementById('widget');
    if (widgetNode) {
      return widgetNode;
    }

    return document.body;
  }, []);

  return (
    <CurrencySelectField
      value={value as Currency}
      disabled={disabled}
      options={options}
      onOpenModalClick={handleClickSelect}
    >
      <>
        <StyledArrowIcon />
        <Modal
          style={modalStyle}
          parentSelector={handleModalParentSelector}
          isOpen={isModalOpen}
          title="Select currency"
          onClickClose={handleClickClose}
        >
          {options.map((o) => (
            <CurrencyItem
              key={o.value}
              onClick={(e) => {
                e.stopPropagation();
                if (o.value === value) {
                  setIsModalOpen(false);
                  return;
                }
                setTouched(true, SHOULD_VALIDATE.FALSE);
                setValue(o.value, SHOULD_VALIDATE.TRUE);
                onHandleChange({
                  context,
                  value: o.value,
                });
                setIsModalOpen(false);
              }}
            >
              <CurrencySelectFieldItem
                name={o.description ?? o.label}
                icon={<CurrencySelectIcon optionValue={o.value} />}
              />
            </CurrencyItem>
          ))}

        </Modal>
      </>
    </CurrencySelectField>
  );
};

export const CurrencySelect: FC<CurrencySelectFieldProps | CurrencySelectFieldHOCProps> = (props) => (
  // eslint-disable-next-line react/destructuring-assignment
  props.disabled
    ? <CurrencySelectField {...props as CurrencySelectFieldProps} />
    : <CurrencySelectFieldHOC {...props as CurrencySelectFieldHOCProps} />
);

export default CurrencySelect;
