import React from 'react';
import { act } from '@testing-library/react';
import { render } from './utils/test-utils';

import App from './App';

describe('App tests', () => {
  it('check that main app container is rendered', async () => {
    const { findAllByText } = render(<App />);
    await act(async () => {
      await findAllByText('Select Amount');
    });
  });
});
