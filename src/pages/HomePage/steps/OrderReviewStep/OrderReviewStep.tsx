import React, {
  FC, useCallback,
} from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components/macro';
import ReactLoading from 'react-loading';
import { PaymentCard } from '../../../../redux/cardsApi';
import WidgetHead from '../../Widget/WidgetHead';
import PreviewBadge from './PreviewBadge';
import Fee from '../QuotesStep/Fee';
import {
  Button, FormRow, BorderButton, widgetModalStyles,
} from '../../../../theme/components';
import { sourceOptions, targetOptions } from '../QuotesStep/QuotesStepContainer';
import AmountField from '../../../../components/AmountField/AmountField';
import CardBadge from './CardBadge';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import Modal from '../../../../components/Modal/Modal';
import ModalInnerConfirm from './ModalInnerConfirm';
import ModalInnerTooManyYears from './ModalInnerTooManyYears';
import { Currency } from '../../../../components/CurrencySelectField/CurrencySelectField';
import { UserDetails } from '../../../../redux/userApi';

type OrderReviewStepProps = {
  onClickNavigateBack: () => void;
  isQuoteLoaded: boolean;
  sourceAmount: string;
  sourceCurrency: Currency;
  targetAmount: string;
  targetCurrency: Currency;
  isModalOpen: boolean;
  onSubmit: () => void;
  isUserTooManyYearsOld: boolean;
  c14Fee: string;
  totalFee: string;
  networkFee: string;
  paymentCard: PaymentCard;
  onClickChangePayment: () => void;
  onClickChangePersonalInfo: () => void;
  onConfirm: () => void;
  onClose: (e: any) => void;
  isSubmitDisabled: boolean;
  isSubmitLoading: boolean;
  user: UserDetails;
}

export const YEARS_OLD_CAP = 60;

const ReviewOrderItem = styled.div`
  display: flex;
  position: relative;
  
  & + & {
    margin-top: 8px;
  }
  
  & + &:before {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.alt4};
    display: block;
    width: 1px;
    height: 12px;
    top: -12px;
    left: 34px;
  }
`;

const OrderReviewStep: FC<OrderReviewStepProps> = ({
  onClickNavigateBack,
  isQuoteLoaded,
  sourceAmount,
  sourceCurrency,
  isModalOpen,
  targetAmount,
  targetCurrency,
  onSubmit,
  isUserTooManyYearsOld,
  c14Fee,
  totalFee,
  networkFee,
  paymentCard,
  onClickChangePayment,
  onClickChangePersonalInfo,
  onConfirm,
  onClose,
  isSubmitDisabled,
  isSubmitLoading,
  user,
}) => {
  const handleModalParentSelector = useCallback(() => {
    const widgetNode = document.getElementById('widget');
    if (widgetNode) {
      return widgetNode;
    }

    return document.body;
  }, []);

  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      flex={1}
    >
      <WidgetHead
        text="Review Your Order"
        customBackCallback={onClickNavigateBack}
      />
      <Flex
        flexDirection="column"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        {!isQuoteLoaded ? (
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            data-testid="ReviewOrderLoader"
            height={50}
            width={50}
          />
        ) : (
          <Flex
            flexDirection="column"
            flex={1}
            justifyContent={['center', 'flex-start']}
            width="100%"
          >
            <ReviewOrderItem data-testid="ReviewOrderItemPay">
              <AmountField
                readOnly
                label="You Pay"
                amountFieldName="quoteSourceAmount"
                currencyFieldName="sourceCurrency"
                currencyOptions={sourceOptions}
                amountValue={sourceAmount}
                currencyType={sourceCurrency}
              />
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemFee">
              <PreviewBadge label="Fees">
                <Fee
                  c14Fee={c14Fee}
                  totalFee={totalFee}
                  networkFee={networkFee}
                  currencyCode={sourceCurrency}
                />
              </PreviewBadge>
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemPaymentMethod">
              <PreviewBadge label="Using Payment Method">
                <Flex justifyContent="space-between" alignItems="flex-end">
                  <CardBadge
                    paymentMethod={paymentCard.type}
                    city={user?.city as string}
                    postalCode={user?.postal_code as string}
                    owner={`${user?.first_names as string} ${user?.last_names as string}`}
                    lastNumbers={paymentCard.last4}
                  />
                  <Flex flexDirection="column">
                    <BorderButton
                      type="button"
                      onClick={onClickChangePayment}
                    >
                      Change
                    </BorderButton>
                    <BorderButton
                      type="button"
                      onClick={onClickChangePersonalInfo}
                    >
                      Change
                    </BorderButton>
                  </Flex>
                </Flex>
              </PreviewBadge>
            </ReviewOrderItem>
            <ReviewOrderItem data-testid="ReviewOrderItemReceive">
              <AmountField
                readOnly
                label="You Receive"
                amountFieldName="quoteTargetAmount"
                currencyFieldName="targetCurrency"
                currencyOptions={targetOptions}
                amountValue={targetAmount}
                currencyType={targetCurrency}
              />
            </ReviewOrderItem>
          </Flex>
        )}
      </Flex>
      <FormRow margin="auto 0 0 0">
        <Button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          data-testid="submitButton"
          type="submit"
        >
          {isSubmitLoading ? <ButtonLoader /> : 'Buy Now'}
        </Button>
      </FormRow>
      <Modal
        style={widgetModalStyles}
        parentSelector={handleModalParentSelector}
        isOpen={isModalOpen}
        title="Warning"
        onClickClose={onClose}
      >
        {isUserTooManyYearsOld ? (
          <ModalInnerTooManyYears onClose={onClose} />
        ) : (
          <ModalInnerConfirm onConfirm={onConfirm} />
        )}
      </Modal>
    </Flex>
  );
};

export default OrderReviewStep;
