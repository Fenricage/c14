import React from 'react';
import {
  screen, act, waitFor, fireEvent,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import QuotesStep from './QuotesStep';
import { server } from '../../../../testHandlers/utils';
import { setupServerQuoteRequest } from '../../../../testHandlers/setupServerQuoteRequest';

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

const invalidValues = ['0', '19', '19.9', '1000000000000,3', '1000000000001'];
// const validValues = ['20'];
const validValues = ['20', '200,9', '300.3', '5000'];

describe('QuotesStep tests', () => {
  it(
    'check input values, button is disabled on invalid values, button is enabled on valid values',
    async () => {
      setupServerQuoteRequest();

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
        expect((quoteTargetInput as HTMLInputElement).value).toBe('110');
      });

      setupServerQuoteRequest({
        source_amount: '200',
        target_amount: '210',
      });

      await act(() => {
        fireEvent.input(quoteTargetInput, { target: { value: '' } });
        fireEvent.input(quoteSourceInput, { target: { value: '' } });
      });
      expect(submitButton).toBeDisabled();

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

    const {
      getByTestId,
    } = render(<QuotesStep />);

    await act(() => {
      expect(getByTestId('QuoteStep')).toBeInTheDocument();
    });

    const quoteSourceInput = screen.getByLabelText('You Pay');
    const quoteTargetInput = screen.getByLabelText('You Receive');
    const submitButton = screen.getByTestId('submitButton');

    await act(() => {
      fireEvent.input(quoteTargetInput, { target: { value: '' } });
      fireEvent.input(quoteSourceInput, { target: { value: '' } });
    });

    await act(async () => {
      await user.type(quoteSourceInput, '30,3');
    });

    await act(async () => {
      jest.runAllTimers();
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
      const quoteTargetErrorFieldTestId = 'ErrorMessage-quoteTargetAmount';
      (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement)
        .setSelectionRange(0, (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value.length);

      (getByLabelText(quoteTargetInputLabelText) as HTMLInputElement)
        .setSelectionRange(0, (getByLabelText(quoteTargetInputLabelText) as HTMLInputElement).value.length);

      await act(async () => {
        await user.type(getByLabelText(quoteSourceInputLabelText), invalidValue);
        user.tab();
        await user.type(getByLabelText(quoteTargetInputLabelText), invalidValue);
        user.tab();
      });

      await waitFor(() => {
        expect((getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value).toBe(invalidValue);
        expect((getByLabelText(quoteTargetInputLabelText) as HTMLInputElement).value).toBe(invalidValue);
      });

      await waitFor(() => {
        expect(getByTestId(quoteSourceErrorFieldTestId)).toBeInTheDocument();
        expect(getByTestId(quoteTargetErrorFieldTestId)).toBeInTheDocument();
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
      const quoteTargetErrorFieldTestId = 'ErrorMessage-quoteTargetAmount';
      (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement)
        .setSelectionRange(0, (getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value.length);

      (getByLabelText(quoteTargetInputLabelText) as HTMLInputElement)
        .setSelectionRange(0, (getByLabelText(quoteTargetInputLabelText) as HTMLInputElement).value.length);

      await act(async () => {
        await user.type(getByLabelText(quoteSourceInputLabelText), validValue);
        user.tab();
        await user.type(getByLabelText(quoteTargetInputLabelText), validValue);
        user.tab();
      });

      await waitFor(() => {
        expect((getByLabelText(quoteSourceInputLabelText) as HTMLInputElement).value).toBe(validValue);
        expect((getByLabelText(quoteTargetInputLabelText) as HTMLInputElement).value).toBe(validValue);
      });

      await waitFor(() => {
        expect(queryByTestId(quoteSourceErrorFieldTestId)).not.toBeInTheDocument();
        expect(queryByTestId(quoteTargetErrorFieldTestId)).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(getByTestId(submitButtonTestId)).toBeDisabled();
      });

      await act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(getByTestId(submitButtonTestId)).not.toBeDisabled();
      });
    },
  );
});
