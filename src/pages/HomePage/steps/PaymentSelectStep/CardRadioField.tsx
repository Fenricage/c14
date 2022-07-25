import styled from 'styled-components/macro';
import { FieldInputProps, FormikState } from 'formik/dist/types';
import React, { FC } from 'react';
import { Flex } from 'rebass/styled-components';
import ReactLoading from 'react-loading';
import { ReactComponent as RemoveCardIcon } from '../../../../assets/remove_card_icon.svg';
import { Card } from './Card';

const CardRadioFieldLabel = styled.label`
  cursor: pointer;
  padding: 18px;
  display: flex;
  border-radius: 13px;
  background: ${({ theme }) => theme.alt4};
  
  &:hover {
    box-shadow: inset 0 0 0 1px #ccc;
  }
`;

const CardRadioFieldInput = styled.input`
  display: none;
`;

const CardRadioPoint = styled.div<{checked: boolean}>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.white};
  background: ${({ theme, checked }) => (checked ? theme.white : 'transparent')};
`;

const RemoveButton = styled.button`
  opacity: .5;
  margin-left: auto;
  
  &:hover {
    opacity: 1;
  }
`;

type CardRadioTypeProps = FieldInputProps<any> & {
  expired: string;
  lastNumbers: string;
  paymentMethod: string;
  cardId: string;
  owner: string;
  onDelete: any;
  isDeleting: boolean;
  setSomeCardDeleting: (state: boolean) => void;
  resetForm: (nextState?: (Partial<FormikState<{card: string}>> | undefined)) => void;
}

const CardRadioField: FC<CardRadioTypeProps> = ({
  name,
  expired,
  lastNumbers,
  owner,
  paymentMethod,
  onChange,
  checked,
  resetForm,
  cardId,
  onDelete,
  isDeleting,
  setSomeCardDeleting,
  value,
  ...other
}) => {
  const handleClickDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSomeCardDeleting(true);
    await onDelete(cardId);
    setSomeCardDeleting(false);
    if (checked) {
      resetForm();
    }
  };

  return (
    <CardRadioFieldLabel
      data-testid="CardRadioFieldLabel"
      htmlFor={value}
    >
      <Flex alignItems="center">
        <Flex alignItems="center">
          <CardRadioFieldInput
            {...other}
            type="radio"
            checked={checked}
            data-testid="CardRadioFieldInput"
            onChange={onChange}
            name={name}
            value={value}
            id={value}
          />
          <CardRadioPoint
            checked={!!checked}
          />
        </Flex>
      </Flex>
      <Flex marginLeft="20px">
        <Card
          expired={expired}
          lastNumbers={lastNumbers}
          owner={owner}
          paymentMethod={paymentMethod}
        />
      </Flex>
      <RemoveButton
        data-testid="CardRadioFieldRemove"
        type="button"
        onClick={handleClickDelete}
      >
        {isDeleting ? (
          <ReactLoading
            data-testid="CardRadioFieldLoading"
            type="spin"
            color="#CBCBCB"
            height={16}
            width={16}
          />
        ) : (
          <RemoveCardIcon
            data-testid="CardRadioFieldRemoveIcon"
          />
        )}
      </RemoveButton>
    </CardRadioFieldLabel>
  );
};

export default CardRadioField;
