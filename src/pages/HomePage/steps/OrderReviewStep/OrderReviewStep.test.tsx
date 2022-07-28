import React from 'react';
import {
  act, within, waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import ReactModal from 'react-modal';
import differenceInYears from 'date-fns/differenceInYears';
import { render } from '../../../../utils/test-utils';
import OrderReviewStep, { YEARS_OLD_CAP } from './OrderReviewStep';
import { setupServerQuoteRequest } from '../../../../testHandlers/quotes/setupServerQuotes';
import { server } from '../../../../testHandlers/utils';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { setupServerLimits } from '../../../../testHandlers/limits/setupServerLimits';
import { goToWidgetStep, setSelectedUserCard, WidgetSteps } from '../../../../state/applicationSlice';
import { serverQuoteRequestMock } from '../../../../testHandlers/quotes/mocks';

beforeAll(() => server.listen());
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  server.resetHandlers();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
afterAll(() => server.close());

ReactModal.setAppElement(document.body);

const toCheckCorrectModalRenderedUserValues = [
  {
    email: 'fenricage+9@gmail.com',
    first_names: 'Bran',
    last_names: 'Ganza',
    building: '20',
    street_name: 'Central Avenue',
    unit_number: '10',
    city: 'Tucson',
    state_code: 'DE',
    postal_code: '97531',
    date_of_birth: '1992-05-31',
    identity_verified: true,
    email_verified: true,
  },
  {
    email: 'fenricage+9@gmail.com',
    first_names: 'Bran',
    last_names: 'Ganza',
    building: '20',
    street_name: 'Central Avenue',
    unit_number: '10',
    city: 'Tucson',
    state_code: 'DE',
    postal_code: '97531',
    date_of_birth: '1900-05-31',
    identity_verified: true,
    email_verified: true,
  },
];

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

      await waitFor(() => {
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
        .toHaveValue(parseInt(serverQuoteRequestMock.source_amount, 10));

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
        .toHaveValue(parseInt(serverQuoteRequestMock.target_amount, 10));

      expect(submitButton).not.toBeDisabled();
    },
  );

  it.each(toCheckCorrectModalRenderedUserValues)(
    'check that correct popup renders when user less/more than 60 y.o',
    async (userMock) => {
      setupServerQuoteRequest();
      setupServerLimits();

      const initialStore = createStoreWithMiddlewares();

      const cardToSelect = {
        last4: '3333',
        type: 'VISA',
        card_id: 'id1',
        expiry_year: '2034',
        expiry_month: '10',
      };

      const updatedStoreState = {
        ...initialStore.getState(),
        application: {
          ...initialStore.getState().application,
          user: userMock,
          widgetSteps: {
            currentStep: WidgetSteps.REVIEW_ORDER,
          },
          selectedUserCard: cardToSelect,
        },
      };

      const updatedStore = createStoreWithMiddlewares(updatedStoreState);

      const {
        getByTestId,
        queryByTestId,
      } = render(<OrderReviewStep />, {
        preloadedState: undefined,
        store: updatedStore,
      });

      const submitButton = getByTestId('submitButton');
      await act(() => {
        expect(submitButton).toBeDisabled();
      });

      await waitFor(() => {
        expect(getByTestId('ReviewOrderLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('ReviewOrderLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await act(async () => {
        user.click(submitButton);
      });

      const isUserTooManyYearsOld = differenceInYears(
        new Date(),
        new Date(userMock.date_of_birth),
      ) >= YEARS_OLD_CAP;

      const modalToExpect = isUserTooManyYearsOld
        ? 'ModalInnerTooManyYearsContainer'
        : 'ModalInnerConfirmContainer';

      await waitFor(() => {
        expect(getByTestId(modalToExpect)).toBeInTheDocument();
      });
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
