import React from 'react';
import {
  act,
} from '@testing-library/react';
import { render } from '../../../../utils/test-utils';
import AddCardStep from './AddCardStep';

describe('AddCardStep tests', () => {
  it(
    'check form is loading',
    async () => {
      const {
        getByTestId,
      } = render(<AddCardStep />);

      await act(() => {
        expect(getByTestId('PaymentAddingLoader')).toBeInTheDocument();
      });
    },
  );
});
