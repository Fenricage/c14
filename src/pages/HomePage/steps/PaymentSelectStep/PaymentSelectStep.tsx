import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass/styled-components';
import ReactLoading from 'react-loading';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import Card from './Card';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import { PaymentCard } from '../../../../redux/cardsApi';

interface IPaymentSelectStep {
  customerCards: PaymentCard[];
  deletingCards: string[];
  selectedCard: PaymentCard | null;
  areCardsLoading: boolean;
  onCardSelection: (card: PaymentCard) => void;
  onLogout: () => void;
  onAddNewCardClick: () => void;
  onDeleteCardClick: (cardId: string) => Promise<void>;
  onSubmitClick: () => void;
}

const RadioGroupItem = styled.div`
  
`;

const RadioGroupContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: center;
  padding-bottom: 40px;
  overflow: hidden;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: auto;

  
  ${RadioGroupItem} + ${RadioGroupItem} {
    margin-top: 14px;
  }
`;

const AddNewCardButtonBox = styled.div`
  display: flex;
  padding: 10px;
  margin-top: auto;
  justify-content: center;
`;

const AddNewCardButton = styled.button`
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  font-size: 14px;
  text-decoration: underline;
  line-height: 16px;
  
  &:hover {
    text-decoration: none;
  }
`;

const PaymentSelectStep: FC<IPaymentSelectStep> = ({
  customerCards,
  selectedCard,
  deletingCards,
  areCardsLoading,
  onLogout,
  onCardSelection,
  onAddNewCardClick,
  onDeleteCardClick,
  onSubmitClick,
}) => {
  const [isSubmitInProgress, setSubmitInProgress] = useState(false);

  const handleSubmitClick = () => {
    setSubmitInProgress(true);
    onSubmitClick();
  };

  const handleCardChange = (cardId: string) => {
    const newSelectedCard = customerCards.find((card) => card.card_id === cardId);
    if (newSelectedCard) {
      onCardSelection(newSelectedCard);
    }
  };

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
      height="100%"
    >
      <WidgetHead
        text="Select or Add a Credit Card"
        customBackCallback={onLogout}
      />
      <RadioGroupContainer>
        {areCardsLoading ? (
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            data-testid="CardsLoader"
            height={50}
            width={50}
          />
        ) : (
          <RadioGroup>
            {customerCards.map((card, index) => (
              <RadioGroupItem
                key={card.card_id}
                data-testid={`RadioGroupItem-${index}`}
              >
                <Card
                  name="card"
                  cardId={card.card_id}
                  isChecked={selectedCard?.card_id === card.card_id}
                  lastNumbers={card.last4}
                  onDelete={onDeleteCardClick}
                  isDeleting={!!deletingCards.find((dc) => dc === card.card_id)}
                  paymentMethod={card.type}
                  expired={`${card.expiry_month}/${card.expiry_year}`}
                  value={card.card_id}
                  onChange={handleCardChange}
                />
              </RadioGroupItem>
            ))}
          </RadioGroup>
        )}
      </RadioGroupContainer>
      <AddNewCardButtonBox>
        <AddNewCardButton
          type="button"
          data-testid="AddNewCardButton"
          onClick={onAddNewCardClick}
        >
          +Add New Card
        </AddNewCardButton>
      </AddNewCardButtonBox>
      <FormRow margin="auto 0 0 0">
        <Button
          disabled={areCardsLoading || (customerCards?.length === 1 && deletingCards.length === 1)}
          onClick={handleSubmitClick}
          data-testid="submitButton"
          type="submit"
        >
          {isSubmitInProgress ? <ButtonLoader /> : 'Continue'}
        </Button>
      </FormRow>
    </Flex>
  );
};

export default PaymentSelectStep;
