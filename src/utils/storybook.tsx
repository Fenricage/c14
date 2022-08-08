import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import ThemeProvider from '../theme';
import { ThemedGlobalStyle } from '../theme/components';
import { createStoreWithMiddlewares, RootState } from '../app/store';

// TODO(@ruslan) - duplicated code, import store from app to here
export const mockStore: Partial<RootState> = {
  userDetails: {
    user: null,
    isEmailVerified: false,
    // TODO(@ruslan): set to NOT_STARTED, whole app
    documentVerificationStatus: null,
    skipPersonalInfoStep: true,
    isUserUpdated: false,
    isUserUpdating: false,
    isUserVerified: false,
    isUserLoading: false,
    isUserLoaded: false,
    isSMSSended: false,
    isSMSSending: false,
    phoneNumber: null,
    isEmailVerificationSent: false,
    isEmailVerificationSending: false,
  },
  application: {
    isQuoteLoaded: true,
    quoteError: '',
    quotes: {},
    generalError: null,
    skipPaymentStep: true,
    isQuoteLoading: false,
    stepperSteps: {
      currentStep: 2,
    },
    widgetSteps: {
      currentStep: 2,
    },
    wizard: {
      'calculator-form': {
        initialValues: {
          quoteSourceAmount: '100',
          quoteTargetAmount: '',
          sourceCurrency: 'USD',
          targetCurrency: 'b2384bf2-b14d-4916-aa97-85633ef05742',
        },
        snapshot: {
          quoteSourceAmount: '100',
          quoteTargetAmount: '',
          sourceCurrency: 'USD',
          targetCurrency: 'b2384bf2-b14d-4916-aa97-85633ef05742',
        },
      },
    },
    purchaseDetails: null,
    jwtToken: null,
    isAuthenticated: false,
    isAuthenticating: false,
    blockChainTargetAddress: '123',
  },
};

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
