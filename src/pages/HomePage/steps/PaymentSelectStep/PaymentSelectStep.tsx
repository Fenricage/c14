import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass/styled-components';
import { useFormik } from 'formik';
import ReactLoading from 'react-loading';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  goToWidgetStep,
  incrementWidgetStep,
  selectApp,
  setUserCardsEmpty,
  resetUserCards,
  WidgetSteps,
  setSnapshotValuesForm,
  PAYMENT_SELECT_FORM_NAME, setSelectedUserCard, logout,
} from '../../../../state/applicationSlice';
import CardRadioField from './CardRadioField';
import { useDeleteUserCardMutation, useGetUserCardsQuery } from '../../../../redux/cardsApi';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';

const RadioGroupItem = styled.div`
  
`;

export type PaymentSelectFormValues = {
  card?: string;
}

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

const PaymentSelectStep: FC = () => {
  const dispatch = useAppDispatch();

  const [isSomeCardDeleting, setSomeCardDeleting] = useState(false);

  const {
    isFetching: isCardsFetching,
  } = useGetUserCardsQuery({});

  const [triggerDeleteCard] = useDeleteUserCardMutation();

  const onDeleteCard = useCallback(async (cardId: string) => {
    await triggerDeleteCard(cardId);
  }, [triggerDeleteCard]);

  const {
    userCards: {
      customer_cards,
    },
    isUserCardsLoaded,
    skipPaymentStep,
    deletingCards,
  } = useAppSelector(selectApp);

  useEffect(() => {
    if (!isUserCardsLoaded || !skipPaymentStep) {
      return;
    }

    if (customer_cards.length) {
      dispatch(setSelectedUserCard(customer_cards[0]));
      dispatch(incrementWidgetStep());
    }
  }, [customer_cards, dispatch, isUserCardsLoaded, skipPaymentStep]);

  useEffect(() => {
    if (!isUserCardsLoaded) {
      return;
    }

    if (!customer_cards.length) {
      dispatch(setUserCardsEmpty(true));
      dispatch(goToWidgetStep(WidgetSteps.PAYMENT_ADDING));
    } else {
      dispatch(setUserCardsEmpty(false));
    }
  }, [customer_cards.length, dispatch, isUserCardsLoaded]);

  const handleClickNextStep = () => {
    dispatch(incrementWidgetStep());
  };

  useEffect(() => () => {
    dispatch(resetUserCards());
  }, [dispatch]);

  const {
    getFieldProps,
    values,
    resetForm,
    isSubmitting,
    isValid,
  } = useFormik<PaymentSelectFormValues>({
    initialValues: {
      card: customer_cards[0]?.card_id,
    },
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: () => handleClickNextStep(),
    validate: (formValues) => {
      const formErrors: {card?: string} = {};
      if (!formValues.card) {
        formErrors.card = 'Required field';
      }

      return formErrors;
    },
  });

  useEffect(() => {
    if (!isUserCardsLoaded) {
      return;
    }

    return () => {
      const selectedCard = customer_cards?.find((c) => c.card_id === values.card);
      if (selectedCard) {
        dispatch(setSelectedUserCard(selectedCard));
      }
    };
  }, [customer_cards, dispatch, isUserCardsLoaded, values.card]);

  useEffect(() => () => {
    dispatch(setSnapshotValuesForm({
      formName: PAYMENT_SELECT_FORM_NAME,
      state: {
        card: values.card,
      },
    }));
  }, [dispatch, values.card]);

  useClearGeneralError();

  const handleClickAddNewCard = () => {
    dispatch(goToWidgetStep(WidgetSteps.PAYMENT_ADDING));
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
        customBackCallback={() => dispatch(logout())}
      />
      <RadioGroupContainer>
        {!isUserCardsLoaded ? (
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            data-testid="CardsLoader"
            height={50}
            width={50}
          />
        ) : (
          <RadioGroup>
            {customer_cards.map((c, index) => {
              const isCardDeleting = deletingCards.find((dc) => dc === c.card_id);
              return (
                <RadioGroupItem
                  key={c.card_id}
                  data-testid={`RadioGroupItem-${index}`}
                >
                  <CardRadioField
                    {...getFieldProps('card')}
                    name="card"
                    owner="John Doe"
                    cardId={c.card_id}
                    resetForm={resetForm}
                    checked={values.card === c.card_id}
                    lastNumbers={c.last4}
                    setSomeCardDeleting={setSomeCardDeleting}
                    onDelete={onDeleteCard}
                    isDeleting={!!isCardDeleting}
                    paymentMethod={c.type}
                    expired={`${c.expiry_month}/${c.expiry_year}`}
                    value={c.card_id}
                  />
                </RadioGroupItem>
              );
            })}
          </RadioGroup>
        )}
      </RadioGroupContainer>
      <AddNewCardButtonBox>
        <AddNewCardButton
          type="button"
          data-testid="AddNewCardButton"
          onClick={handleClickAddNewCard}
        >
          +Add New Card
        </AddNewCardButton>
      </AddNewCardButtonBox>
      <FormRow margin="auto 0 0 0">
        <Button
          disabled={isCardsFetching || !isValid || (customer_cards?.length === 1 && isSomeCardDeleting)}
          onClick={handleClickNextStep}
          data-testid="submitButton"
          type="submit"
        >
          {isSubmitting ? <ButtonLoader /> : 'Continue'}
        </Button>
      </FormRow>
    </Flex>
  );
};

export default PaymentSelectStep;
