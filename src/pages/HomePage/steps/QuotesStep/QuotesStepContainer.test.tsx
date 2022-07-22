import React from 'react';
import {
  screen, act, waitFor, fireEvent,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import QuotesStepContainer from './QuotesStepContainer';
import { server } from '../../../../testHandlers/utils';
import { setupServerQuoteRequest } from '../../../../testHandlers/quotes/setupServerQuotes';
import { setupServerLimits } from '../../../../testHandlers/limits/setupServerLimits';

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

const invalidValues = ['0', '19', '19.9', '500,3', '501'];
const validValues = ['20', '200,9', '300.3', '500'];

describe('QuotesStepContainer tests', () => {
  const quoteSourceAmount = () => screen.getByTestId('quoteSourceAmount');
  const quoteTargetAmount = () => screen.getByTestId('quoteTargetAmount');
  it(
    'check input values, button is disabled on invalid values, button is enabled on valid values',
    async () => {
      setupServerQuoteRequest();
      setupServerLimits();

      const {
        getByTestId,
      } = render(<QuotesStepContainer />);

      await act(() => {
        expect(getByTestId('QuoteStep')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(quoteTargetAmount()).toHaveValue('110');
      });

      setupServerQuoteRequest({
        source_amount: '200',
        target_amount: '210',
      });

      await waitFor(() => {
        expect(quoteSourceAmount()).not.toBeDisabled();
        // console.debug(screen.getByTestId('quoteTargetAmount'));
        expect(quoteTargetAmount()).not.toBeDisabled();
      });

      await act(() => {
        fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
        fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
      });

      await act(async () => {
        await user.type(quoteSourceAmount(), '2');
      });

      await waitFor(() => {
        expect(quoteSourceAmount()).toHaveValue('2');
      });

      await waitFor(() => {
        expect(quoteTargetAmount()).toHaveValue('');
      });

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      await act(async () => {
        await user.type(quoteSourceAmount(), '00');
      });

      await waitFor(() => {
        expect(quoteSourceAmount()).toHaveValue('200');
      });

      await waitFor(() => {
        expect(quoteTargetAmount()).toHaveValue('210');
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    },
  );

  it('check comma replaced by dot', async () => {
    setupServerQuoteRequest({
      source_amount: '30.3',
      target_amount: '40.3',
    });

    setupServerLimits();

    const {
      getByTestId,
    } = render(<QuotesStepContainer />);

    await act(() => {
      expect(getByTestId('QuoteStep')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('submitButton');

    await waitFor(() => {
      expect(quoteSourceAmount()).not.toBeDisabled();
      expect(quoteTargetAmount()).not.toBeDisabled();
    });

    await act(() => {
      fireEvent.input(quoteSourceAmount(), { target: { value: '' } });
      fireEvent.input(quoteTargetAmount(), { target: { value: '' } });
    });

    await act(async () => {
      await user.type(quoteSourceAmount(), '30,3');
    });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect((quoteSourceAmount() as HTMLInputElement).value).toBe('30,3');
    });

    await waitFor(() => {
      expect((quoteTargetAmount() as HTMLInputElement).value).toContain('40,3');
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it.each(invalidValues)(
    'test invalid values validation',
    async (invalidValue) => {
      setupServerQuoteRequest();
      setupServerLimits();

      const { getByTestId } = render(<QuotesStepContainer />);

      await act(() => {
        expect(getByTestId('QuoteStep')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submitButton');

      const quoteSourceErrorFieldTestId = 'ErrorMessage-quoteSourceAmount';

      await waitFor(() => {
        expect(quoteSourceAmount()).not.toBeDisabled();
        expect(quoteTargetAmount()).not.toBeDisabled();
      });

      (quoteSourceAmount() as HTMLInputElement)
        .setSelectionRange(0, (quoteSourceAmount() as HTMLInputElement).value.length);

      await act(async () => {
        await user.type(quoteSourceAmount(), invalidValue);
        user.tab();
      });

      await waitFor(() => {
        expect((quoteSourceAmount() as HTMLInputElement).value).toBe(invalidValue);
      });

      await waitFor(() => {
        expect(getByTestId(quoteSourceErrorFieldTestId)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    },
  );

  it.each(validValues)(
    'test valid values validation',
    async (validValue) => {
      setupServerQuoteRequest();
      setupServerLimits();

      const {
        getByTestId, getByLabelText, queryByTestId,
      } = render(<QuotesStepContainer />);

      await act(() => {
        expect(getByTestId('QuoteStep')).toBeInTheDocument();
      });

      const quoteSourceInputLabelText = 'You Pay';
      const quoteTargetInputLabelText = 'You Receive';
      const submitButtonTestId = 'submitButton';

      const quoteSourceErrorFieldTestId = 'ErrorMessage-quoteSourceAmount';

      await waitFor(() => {
        expect(getByLabelText(quoteSourceInputLabelText)).not.toBeDisabled();
        expect(getByLabelText(quoteTargetInputLabelText)).not.toBeDisabled();
      });

      (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement)
        .setSelectionRange(0, (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value.length);

      await act(async () => {
        await user.type(getByLabelText(quoteSourceInputLabelText), validValue);
        user.tab();
      });

      await waitFor(() => {
        expect((getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value).toBe(validValue);
      });

      await waitFor(() => {
        expect(queryByTestId(quoteSourceErrorFieldTestId)).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(getByTestId(submitButtonTestId)).toBeDisabled();
      });

      await act(() => {
        jest.runOnlyPendingTimers();
      });

      await waitFor(() => {
        expect(getByTestId(submitButtonTestId)).not.toBeDisabled();
      });
    },
  );
});
