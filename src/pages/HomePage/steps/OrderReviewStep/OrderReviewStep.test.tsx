import React from 'react';
import {
  act, within, waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import OrderReviewStep from './OrderReviewStep';
import { setupServerQuoteRequest } from '../../../../testHandlers/setupServerQuoteRequest';
import { server } from '../../../../testHandlers/utils';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { serverQuoteRequestMock } from '../../../../testHandlers/mocks';
import { goToWidgetStep, setSelectedUserCard, WidgetSteps } from '../../../../state/applicationSlice';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('OrderReviewStep tests', () => {
  it(
    'check order is rendered correctly',
    async () => {
      setupServerQuoteRequest();
      const store = createStoreWithMiddlewares();

      const {
        getByTestId,
        queryByTestId,
        unmount,
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

      expect(within(payItem).getByTestId('AmountBadgeValue'))
        .toHaveTextContent(serverQuoteRequestMock.source_amount);

      expect(within(feeItem).getByTestId('NetworkFee'))
        .toHaveTextContent(serverQuoteRequestMock.fiat_blockchain_fee);
      expect(within(feeItem).getByTestId('C14Fee'))
        .toHaveTextContent(serverQuoteRequestMock.absolute_internal_fee);
      expect(within(feeItem).getByTestId('TotalFee'))
        .toHaveTextContent(serverQuoteRequestMock.total_fee);

      expect(within(paymentMethodItem).getByTestId('CardPaymentMethod'))
        .toHaveTextContent(cardToSelect.type);
      expect(within(paymentMethodItem).getByTestId('CardLastNumbers'))
        .toHaveTextContent(cardToSelect.last4);
      expect(within(paymentMethodItem)
        .getByTestId('CardExpiry'))
        .toHaveTextContent(`${cardToSelect.expiry_month}/${cardToSelect.expiry_year}`);

      expect(within(receiveItem).getByTestId('AmountBadgeValue'))
        .toHaveTextContent(serverQuoteRequestMock.target_amount);

      expect(submitButton).not.toBeDisabled();

      await act(async () => {
        await user.click(submitButton);
      });

      unmount();
    },
  );
});
