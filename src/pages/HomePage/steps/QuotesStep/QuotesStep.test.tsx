import React from 'react';
import {
  screen, act, waitFor, fireEvent,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import QuotesStep from './QuotesStep';
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

describe('QuotesStep tests', () => {
  it(
    'check input values, button is disabled on invalid values, button is enabled on valid values',
    async () => {
      setupServerQuoteRequest();
      setupServerLimits();

      const {
        getByTestId,
      } = render(<QuotesStep />);

      await act(() => {
        expect(getByTestId('QuoteStep')).toBeInTheDocument();
      });

      const quoteSourceInput = screen.getByLabelText('You Pay');
      const quoteTargetInput = screen.getByLabelText('You Receive');
      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect((quoteTargetInput as HTMLInputElement).value).toBe('110');
      });

      setupServerQuoteRequest({
        source_amount: '200',
        target_amount: '210',
      });

      await waitFor(() => {
        expect(quoteSourceInput).not.toBeDisabled();
        expect(quoteTargetInput).not.toBeDisabled();
      });

      await act(() => {
        fireEvent.input(quoteTargetInput, { target: { value: '' } });
        fireEvent.input(quoteSourceInput, { target: { value: '' } });
      });

      await act(async () => {
        await user.type(quoteSourceInput, '2');
      });

      expect((quoteSourceInput as HTMLInputElement).value).toBe('2');
      expect((quoteTargetInput as HTMLInputElement).value).toBe('');
      expect(submitButton).toBeDisabled();

      await act(async () => {
        await user.type(quoteSourceInput, '00');
      });

      await waitFor(() => {
        expect((quoteSourceInput as HTMLInputElement).value).toBe('200');
      });

      await waitFor(() => {
        expect((quoteTargetInput as HTMLInputElement).value).toBe('210');
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
    } = render(<QuotesStep />);

    await act(() => {
      expect(getByTestId('QuoteStep')).toBeInTheDocument();
    });

    const quoteSourceInput = screen.getByLabelText('You Pay');
    const quoteTargetInput = screen.getByLabelText('You Receive');
    const submitButton = screen.getByTestId('submitButton');

    await waitFor(() => {
      expect(quoteSourceInput).not.toBeDisabled();
      expect(quoteTargetInput).not.toBeDisabled();
    });

    await act(() => {
      fireEvent.input(quoteTargetInput, { target: { value: '' } });
      fireEvent.input(quoteSourceInput, { target: { value: '' } });
    });

    await act(async () => {
      await user.type(quoteSourceInput, '30,3');
    });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect((quoteSourceInput as HTMLInputElement).value).toBe('30,3');
    });

    await waitFor(() => {
      expect((quoteTargetInput as HTMLInputElement).value).toContain('40,3');
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

      const {
        getByTestId, getByLabelText,
      } = render(<QuotesStep />);

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
        await user.type(getByLabelText(quoteSourceInputLabelText), invalidValue);
        user.tab();
      });

      await waitFor(() => {
        expect((getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value).toBe(invalidValue);
      });

      await waitFor(() => {
        expect(getByTestId(quoteSourceErrorFieldTestId)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(getByTestId(submitButtonTestId)).toBeDisabled();
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
      } = render(<QuotesStep />);

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
