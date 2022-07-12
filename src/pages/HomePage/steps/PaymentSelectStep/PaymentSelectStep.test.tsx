import React from 'react';
import {
  act, waitFor, waitForElementToBeRemoved, within,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import PaymentSelectStep from './PaymentSelectStep';
import { server } from '../../../../testHandlers/utils';
import { setupUserCardsRequestServer } from '../../../../testHandlers/userCards/setupUserCardsServer';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { WidgetSteps } from '../../../../state/applicationSlice';
import { serverGetUserCardsMock } from '../../../../testHandlers/userCards/mocks';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PaymentSelectStep tests', () => {
  it(
    'check add cards button is rendered',
    async () => {
      setupUserCardsRequestServer(serverGetUserCardsMock);
      const {
        getByTestId,
      } = render(<PaymentSelectStep />);

      await act(() => {
        expect(getByTestId('AddNewCardButton')).toBeInTheDocument();
      });
    },
  );

  it(
    'check loader is rendered',
    async () => {
      setupUserCardsRequestServer(serverGetUserCardsMock);
      const {
        getByTestId,
      } = render(<PaymentSelectStep />);

      await act(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });
    },
  );

  it(
    'check cards is rendered correctly',
    async () => {
      setupUserCardsRequestServer(serverGetUserCardsMock);
      const {
        getByTestId,
        queryByTestId,
        getByText,
      } = render(<PaymentSelectStep />);

      await waitFor(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('CardsLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('RadioGroupItem-0')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('RadioGroupItem-1')).toBeInTheDocument();
      });

      // eslint-disable-next-line no-restricted-syntax
      for await (const c of Object.values(serverGetUserCardsMock.customer_cards)) {
        // eslint-disable-next-line no-loop-func
        await waitFor(() => {
          expect(getByText(c.last4)).toBeInTheDocument();
          const month = c.expiry_month;
          const year = c.expiry_year;
          expect(getByText(`${month}/${year}`)).toBeInTheDocument();
        });
      }
    },
  );

  it(
    'check initial value is set',
    async () => {
      setupUserCardsRequestServer(serverGetUserCardsMock);
      const {
        getByTestId,
        queryByTestId,
      } = render(<PaymentSelectStep />);

      await waitFor(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('CardsLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('RadioGroupItem-0')).toBeInTheDocument();
      });

      const firstRadioInput = within(getByTestId('RadioGroupItem-0')).getByTestId('CardRadioFieldInput');

      await waitFor(() => {
        expect(firstRadioInput as HTMLInputElement).toBeChecked();
      });

      const secondRadioLabel = within(getByTestId('RadioGroupItem-1')).getByTestId('CardRadioFieldLabel');

      await act(async () => {
        await user.click(secondRadioLabel);
      });

      await waitFor(() => {
        const secondRadioInput = within(getByTestId('RadioGroupItem-1')).getByTestId('CardRadioFieldInput');
        expect(secondRadioInput as HTMLInputElement).toBeChecked();
      });
    },
  );

  it(
    'check delete card and autoset to first element after deleting',
    async () => {
      setupUserCardsRequestServer(serverGetUserCardsMock);
      const {
        getByTestId,
        queryByTestId,
      } = render(<PaymentSelectStep />);

      await waitFor(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('CardsLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(queryByTestId('RadioGroupItem-0')).toBeInTheDocument();
      });

      const firstRadioInput = within(getByTestId('RadioGroupItem-0')).getByTestId('CardRadioFieldInput');

      await waitFor(() => {
        expect(firstRadioInput as HTMLInputElement).toBeChecked();
      });

      const secondRadioLabel = within(getByTestId('RadioGroupItem-1')).getByTestId('CardRadioFieldLabel');

      await act(async () => {
        await user.click(secondRadioLabel);
      });

      const secondDeleteButton = within(getByTestId('RadioGroupItem-1')).getByTestId('CardRadioFieldRemove');

      await waitFor(() => {
        const secondRadioInput = within(getByTestId('RadioGroupItem-1')).getByTestId('CardRadioFieldInput');
        expect(secondRadioInput as HTMLInputElement).toBeChecked();
      });

      await act(async () => {
        await user.click(secondDeleteButton);
      });

      await waitFor(() => {
        expect(
          within(getByTestId('RadioGroupItem-1')).queryByTestId('CardRadioFieldLoading'),
        )
          .toBeInTheDocument();
      });

      await act(async () => {
        await user.tab();
      });

      // catch setDeleting act
      await act(() => {
        expect(getByTestId('RadioGroupItem-1')).toBeInTheDocument();
      });

      // catch reset Form act
      await act(() => {
        expect(getByTestId('RadioGroupItem-1')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          within(getByTestId('RadioGroupItem-1')).queryByTestId('CardRadioFieldLoading'),
        )
          .not.toBeInTheDocument();
      });

      // element deleted
      await waitFor(() => {
        expect(
          queryByTestId('RadioGroupItem-2'),
        )
          .not.toBeInTheDocument();
      });

      // first element checked again
      await waitFor(() => {
        expect(firstRadioInput as HTMLInputElement).toBeChecked();
      });
    },
  );

  it(
    'check that redirected on empty card list',
    async () => {
      setupUserCardsRequestServer({ customer_cards: [] });
      const store = createStoreWithMiddlewares();
      const {
        getByTestId,
      } = render(<PaymentSelectStep />, { preloadedState: store.getState(), store });

      await act(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });

      await waitForElementToBeRemoved(getByTestId('CardsLoader'));

      // redirected back to payment adding
      await waitFor(() => {
        expect(store.getState().application.widgetSteps.currentStep === WidgetSteps.PAYMENT_ADDING);
      });
    },
  );

  it(
    'check that redirected on delete last card',
    async () => {
      setupUserCardsRequestServer({
        customer_cards: [{
          card_id: 'id1',
          expiry_month: '10',
          expiry_year: '2033',
          type: 'VISA',
          last4: '4234',
        }],
      });
      const store = createStoreWithMiddlewares();
      const {
        getByTestId,
      } = render(<PaymentSelectStep />, { preloadedState: store.getState(), store });

      await act(() => {
        expect(getByTestId('CardsLoader')).toBeInTheDocument();
      });

      await waitForElementToBeRemoved(getByTestId('CardsLoader'));

      await act(() => {
        expect(getByTestId('RadioGroupItem-0')).toBeInTheDocument();
      });

      const radioInput = within(getByTestId('RadioGroupItem-0')).getByTestId('CardRadioFieldInput');

      await waitFor(() => {
        expect(radioInput as HTMLInputElement).toBeChecked();
      });

      const deleteButton = within(getByTestId('RadioGroupItem-0')).getByTestId('CardRadioFieldRemove');

      await act(async () => {
        await user.click(deleteButton);
      });

      await act(() => {
        expect(
          within(getByTestId('RadioGroupItem-0')).queryByTestId('CardRadioFieldLoading'),
        )
          .toBeInTheDocument();
      });

      await act(async () => {
        await user.tab();
      });

      // catch setDeleting act
      await act(() => {
        expect(getByTestId('RadioGroupItem-0')).toBeInTheDocument();
      });

      // redirected back to payment adding
      await waitFor(() => {
        expect(store.getState().application.widgetSteps.currentStep === WidgetSteps.PAYMENT_ADDING);
      });
    },
  );
});
