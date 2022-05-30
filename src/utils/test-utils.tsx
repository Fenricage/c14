import { Provider } from 'react-redux';
import { render as rtlRender } from '@testing-library/react';
import React from 'react';
import ThemeProvider from '../theme';
import { ThemedGlobalStyle } from '../theme/components';
import { createStoreWithMiddlewares } from '../app/store';

export function render(
  ui: any,
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    preloadedState,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    store = createStoreWithMiddlewares(preloadedState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }: { children: any }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
