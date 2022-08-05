import styled from 'styled-components/macro';
import React, { FC } from 'react';
import { Flex } from 'rebass/styled-components';
import ReactLoading from 'react-loading';
import { ReactComponent as RemoveCardIcon } from '../../../../assets/remove_card_icon.svg';
import { ReactComponent as MasterCardIcon } from '../../../../assets/mastercard_icon.svg';

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

export const StyledMasterCardIcon = styled(MasterCardIcon)`
  margin-right: 12px;
`;

export const PaymentMethodName = styled.b`
  font-weight: 500;
`;

const OwnerContainer = styled.div`
  font-weight: 400;
  margin-top: 6px;
`;

export const LastNumbersContainer = styled.div`
  font-weight: 400;
  display: flex;
  margin-left: 6px;
`;

export const LastNumbersText = styled.span`

`;

export const LastNumbers = styled.span`
  margin-left: 4px;
`;

const ExpiredBox = styled.span`
  margin-left: 4px;
`;

const RemoveButton = styled.button`
  opacity: .5;
  margin-left: auto;
  
  &:hover {
    opacity: 1;
  }
`;

interface ICardRadioField {
  expired: string;
  name: string;
  value: string;
  isChecked: boolean;
  lastNumbers: string;
  paymentMethod: string;
  cardId: string;
  onDelete: any;
  isDeleting: boolean;
  onChange: (cardId: any) => void;
}

const Card: FC<ICardRadioField> = ({
  name,
  expired,
  lastNumbers,
  paymentMethod,
  isChecked,
  cardId,
  onDelete,
  isDeleting,
  value,
  onChange,
}) => {
  const handleClickDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    await onDelete(cardId);
  };

  const handleCardClick = () => {
    onChange(value);
  };

  return (
    <CardRadioFieldLabel
      data-testid="CardRadioFieldLabel"
      htmlFor={value}
    >
      <Flex alignItems="center">
        <Flex alignItems="center">
          <CardRadioFieldInput
            type="radio"
            checked={isChecked}
            data-testid="CardRadioFieldInput"
            onChange={handleCardClick}
            name={name}
            value={value}
            id={value}
          />
          <CardRadioPoint
            checked={isChecked}
          />
        </Flex>
      </Flex>
      <Flex marginLeft="20px">
        <Flex alignItems="center" fontSize="14px">
          <StyledMasterCardIcon />
          <Flex flexDirection="column" justifyContent="center">
            <Flex>
              <PaymentMethodName data-testid="CardPaymentMethod">
                {paymentMethod}
              </PaymentMethodName>
              <LastNumbersContainer>
                <LastNumbersText>
                  ending in
                </LastNumbersText>
                <LastNumbers data-testid="CardLastNumbers">
                  {lastNumbers}
                </LastNumbers>
              </LastNumbersContainer>
            </Flex>
            <Flex>
              <OwnerContainer>
                Expires on
                {' '}
                <ExpiredBox data-testid="CardExpiry">
                  {expired}
                </ExpiredBox>
              </OwnerContainer>
            </Flex>
          </Flex>
        </Flex>
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

export default Card;
