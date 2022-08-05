import React from 'react';
import {
  act,
} from '@testing-library/react';
import { render } from '../../../../utils/test-utils';
import AddCardStepContainer from './AddCardStepContainer';

describe('AddCardStep tests', () => {
  it(
    'check form is loading',
    async () => {
      const {
        getByTestId,
      } = render(<AddCardStepContainer />);

      await act(() => {
        expect(getByTestId('PaymentAddingLoader')).toBeInTheDocument();
      });
    },
  );
});
