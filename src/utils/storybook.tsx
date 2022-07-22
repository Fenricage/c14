import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import ThemeProvider from '../theme';
import { ThemedGlobalStyle } from '../theme/components';
import { createStoreWithMiddlewares } from '../app/store';

function Provider({ children, store }: { children?: any, store: any}) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <ThemedGlobalStyle />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}

// eslint-disable-next-line default-param-last
export const withProvider = (store = createStoreWithMiddlewares(), story: any) => (
  <Provider store={store}>
    { story() }
  </Provider>
);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const mockFn = () => {};
