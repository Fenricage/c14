import React from 'react';
import {
  act, within, waitFor,
} from '@testing-library/react';
import { render } from '../../../../utils/test-utils';
import OrderReviewStep from './OrderReviewStep';
import { setupServerQuoteRequest } from '../../../../testHandlers/quotes/setupServerQuotes';
import { server } from '../../../../testHandlers/utils';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { setupServerLimits } from '../../../../testHandlers/limits/setupServerLimits';
import { goToWidgetStep, setSelectedUserCard, WidgetSteps } from '../../../../state/applicationSlice';
import { serverQuoteRequestMock } from '../../../../testHandlers/quotes/mocks';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('OrderReviewStep tests', () => {
  it(
    'check order is rendered correctly',
    async () => {
      setupServerQuoteRequest();
      setupServerLimits();
      const store = createStoreWithMiddlewares();

      const {
        getByTestId,
        queryByTestId,
      } = render(<OrderReviewStep />, { preloadedState: store.getState(), store });

      const cardToSelect = {
        last4: '3333',
        type: 'VISA',
        card_id: 'id1',
        expiry_year: '2034',
        expiry_month: '10',
      };

      await act(async () => {
        await store.dispatch(setSelectedUserCard(cardToSelect));
      });

      const submitButton = getByTestId('submitButton');
      await act(() => {
        expect(submitButton).toBeDisabled();
      });

      await act(async () => {
        await store.dispatch(goToWidgetStep(WidgetSteps.REVIEW_ORDER));
      });

      await act(() => {
        expect(getByTestId('ReviewOrderLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('ReviewOrderLoader')).not.toBeInTheDocument();
      });

      const payItem = getByTestId('ReviewOrderItemPay');
      const feeItem = getByTestId('ReviewOrderItemFee');
      const paymentMethodItem = getByTestId('ReviewOrderItemPaymentMethod');
      const receiveItem = getByTestId('ReviewOrderItemReceive');
      expect(payItem).toBeInTheDocument();
      expect(feeItem).toBeInTheDocument();
      expect(paymentMethodItem).toBeInTheDocument();
      expect(receiveItem).toBeInTheDocument();

      expect(within(payItem).getByTestId('quoteSourceAmount'))
        .toHaveValue(serverQuoteRequestMock.source_amount);

      expect(within(feeItem).getByTestId('NetworkFee'))
        .toHaveTextContent(serverQuoteRequestMock.fiat_blockchain_fee);
      expect(within(feeItem).getByTestId('C14Fee'))
        .toHaveTextContent(serverQuoteRequestMock.absolute_internal_fee);
      expect(within(feeItem).getByTestId('TotalFee'))
        .toHaveTextContent(serverQuoteRequestMock.total_fee);

      expect(within(paymentMethodItem).getByTestId('BadgeCardPaymentMethod'))
        .toHaveTextContent(cardToSelect.type);
      expect(within(paymentMethodItem).getByTestId('BadgeCardLastNumbers'))
        .toHaveTextContent(cardToSelect.last4);

      expect(within(receiveItem).getByTestId('quoteTargetAmount'))
        .toHaveValue(serverQuoteRequestMock.target_amount);

      expect(submitButton).not.toBeDisabled();
    },
  );

  // it(
  //   'test limits exceeded',
  //   async () => {
  //     setupServerQuoteRequest({
  //       source_amount: '600',
  //       target_amount: '600',
  //     });
  //     setupServerLimits();
  //     const store = createStoreWithMiddlewares();
  //
  //     const {
  //       getByTestId,
  //       queryByTestId,
  //     } = render(<OrderReviewStep />, { preloadedState: store.getState(), store });
  //
  //     const cardToSelect = {
  //       last4: '3333',
  //       type: 'VISA',
  //       card_id: 'id1',
  //       expiry_year: '2034',
  //       expiry_month: '10',
  //     };
  //
  //     await act(async () => {
  //       await store.dispatch(setSelectedUserCard(cardToSelect));
  //     });
  //
  //     const submitButton = getByTestId('submitButton');
  //     await act(() => {
  //       expect(submitButton).toBeDisabled();
  //     });
  //
  //     await act(async () => {
  //       await store.dispatch(goToWidgetStep(WidgetSteps.REVIEW_ORDER));
  //     });
  //
  //     await act(() => {
  //       expect(getByTestId('ReviewOrderLoader')).toBeInTheDocument();
  //     });
  //
  //     await waitFor(() => {
  //       expect(queryByTestId('ReviewOrderLoader')).not.toBeInTheDocument();
  //     });
  //
  //     const payItem = getByTestId('ReviewOrderItemPay');
  //     const feeItem = getByTestId('ReviewOrderItemFee');
  //     const paymentMethodItem = getByTestId('ReviewOrderItemPaymentMethod');
  //     const receiveItem = getByTestId('ReviewOrderItemReceive');
  //     expect(payItem).toBeInTheDocument();
  //     expect(feeItem).toBeInTheDocument();
  //     expect(paymentMethodItem).toBeInTheDocument();
  //     expect(receiveItem).toBeInTheDocument();
  //
  //     expect(within(payItem).getByTestId('AmountBadgeValue'))
  //       .toHaveTextContent(serverQuoteRequestMock.source_amount);
  //
  //     expect(within(feeItem).getByTestId('NetworkFee'))
  //       .toHaveTextContent(serverQuoteRequestMock.fiat_blockchain_fee);
  //     expect(within(feeItem).getByTestId('C14Fee'))
  //       .toHaveTextContent(serverQuoteRequestMock.absolute_internal_fee);
  //     expect(within(feeItem).getByTestId('TotalFee'))
  //       .toHaveTextContent(serverQuoteRequestMock.total_fee);
  //
  //     expect(within(paymentMethodItem).getByTestId('BadgeCardPaymentMethod'))
  //       .toHaveTextContent(cardToSelect.type);
  //     expect(within(paymentMethodItem).getByTestId('BadgeCardLastNumbers'))
  //       .toHaveTextContent(cardToSelect.last4);
  //
  //     expect(within(receiveItem).getByTestId('AmountBadgeValue'))
  //       .toHaveTextContent(serverQuoteRequestMock.target_amount);
  //
  //     expect(submitButton).not.toBeDisabled();
  //   },
  // );
});
