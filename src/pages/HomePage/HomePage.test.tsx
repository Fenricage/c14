import React from 'react';
import { act } from 'react-test-renderer';
import { render } from '../../utils/test-utils';
import HomePage from './HomePage';

describe('HomePage tests', () => {
  it('all main containers are rendered', async () => {
    const { container, getByTestId } = render(<HomePage />);
    await act(() => {
      expect(container).toBeInTheDocument();
      expect(getByTestId('Widget')).toBeInTheDocument();
      expect(getByTestId('Sidebar')).toBeInTheDocument();
      expect(getByTestId('QuoteStep')).toBeInTheDocument();
    });
  });
});
