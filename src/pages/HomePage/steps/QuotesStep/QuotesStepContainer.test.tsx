import React from 'react';
import {
  screen, act, waitFor, fireEvent,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import QuotesStepContainer from './QuotesStepContainer';
import { server } from '../../../../testHandlers/utils';
import { setupServerQuoteRequest } from '../../../../testHandlers/quotes/setupServerQuotes';
import { setupServerLimits } from '../../../../testHandlers/limits/setupServerLimits';
import { render } from '../../../../utils/test-utils';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
beforeEach(async () => {
  jest.useFakeTimers();
});
afterEach(() => {
  server.resetHandlers();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
afterAll(() => server.close());

const initSetup = async (mockedSourceAmount = 100, mockedTargetAmount = 110) => {
  setupServerQuoteRequest({
    source_amount: mockedSourceAmount.toString(),
    target_amount: mockedTargetAmount.toString(),
  });
  setupServerLimits();
  render(<QuotesStepContainer />);

  await waitFor(() => {
    expect(screen.getByTestId('QuoteStep')).toBeInTheDocument();
  });

  await waitFor(() => expect(screen.getByTestId('quoteSourceAmount')).toHaveValue(mockedSourceAmount));
  await waitFor(() => expect(screen.getByTestId('quoteTargetAmount')).toHaveValue(mockedTargetAmount));
};

const invalidValues = [0, 19, 19.9, 500.3, 501, 25.123];
const validValues = [20, 200.9, 300.3, 500, 25.20];

describe('QuotesStepContainer tests', () => {
  const quoteSourceAmount = () => screen.getByTestId('quoteSourceAmount');
  const quoteTargetAmount = () => screen.getByTestId('quoteTargetAmount');

  it('QuotesStepContainer component initialized with default values', async () => {
    await initSetup();

    await waitFor(() => {
      expect(quoteSourceAmount()).not.toBeDisabled();
      expect(quoteTargetAmount()).not.toBeDisabled();
    });

    await waitFor(() => expect(screen.getByTestId('quoteSourceAmount')).toHaveValue(100));
    await waitFor(() => expect(screen.getByTestId('quoteTargetAmount')).toHaveValue(110));

    const submitButton = screen.getByTestId('submitButton');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('QuotesStepContainer continue button disabled when input fields are empty', async () => {
    await initSetup();

    await act(() => {
      fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
      fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
    });

    await waitFor(() => expect(screen.getByTestId('quoteSourceAmount')).toHaveValue(null));
    await waitFor(() => expect(screen.getByTestId('quoteTargetAmount')).toHaveValue(null));

    const submitButton = screen.getByTestId('submitButton');
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('QuotesStepContainer when value changed quotes automatically fetched', async () => {
    await initSetup();
    const mockedSourceAmount = 200;
    const mockedTargetAmount = 220;

    setupServerQuoteRequest({
      source_amount: mockedSourceAmount.toString(),
      target_amount: mockedTargetAmount.toString(),
    });

    await act(() => {
      fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
      fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
    });

    await act(async () => {
      await user.type(quoteSourceAmount(), mockedSourceAmount.toString());
    });

    await waitFor(() => {
      expect(quoteSourceAmount()).toHaveValue(mockedSourceAmount);
      expect(quoteTargetAmount()).toHaveValue(mockedTargetAmount);
    });
  });

  it.each(invalidValues)(
    'QuotesStepContainer shows error message on invalid value',
    async (invalidValue) => {
      await initSetup();

      await act(() => {
        fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
        fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
      });

      await waitFor(() => expect(screen.getByTestId('quoteSourceAmount')).toHaveValue(null));
      await waitFor(() => expect(screen.getByTestId('quoteTargetAmount')).toHaveValue(null));

      await act(async () => {
        await user.type(quoteSourceAmount(), invalidValue.toString());
      });

      await waitFor(() => {
        expect(quoteSourceAmount()).toHaveValue(invalidValue);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('ErrorMessage-quoteSourceAmount')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submitButton');
      expect(submitButton).toBeDisabled();
    },
  );

  it.each(validValues)(
    'QuotesStepContainer does not show the error message on valid input',
    async (validValuee) => {
      await initSetup();

      await act(() => {
        fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
        fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
      });

      await waitFor(() => expect(screen.getByTestId('quoteSourceAmount')).toHaveValue(null));
      await waitFor(() => expect(screen.getByTestId('quoteTargetAmount')).toHaveValue(null));

      await act(async () => {
        await user.type(quoteSourceAmount(), validValuee.toString());
      });

      await waitFor(() => {
        expect(quoteSourceAmount()).toHaveValue(validValuee);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('ErrorMessage-quoteSourceAmount')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submitButton');
      expect(submitButton).not.toBeDisabled();
    },
  );
});
