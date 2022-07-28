import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import ThemeProvider from '../theme';
import { ThemedGlobalStyle } from '../theme/components';
import { createStoreWithMiddlewares, RootState } from '../app/store';

export const mockStore: Partial<RootState> = {
  application: {
    isQuoteLoaded: true,
    quoteError: '',
    quotes: {},
    user: null,
    generalError: null,
    skipPaymentStep: true,
    skipPersonalInfoStep: true,
    isUserLoading: false,
    isUserLoaded: false,
    isUserUpdating: false,
    isUserUpdated: false,
    isUserVerified: false,
    isEmailVerified: false,
    isQuoteLoading: false,
    isUserCardsEmpty: false,
    lastChangedQuoteInputName: 'quoteSourceAmount',
    fee: {
      c14: undefined,
      network: undefined,
      total: undefined,
    },
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
      'payment-select-form': {
        initialValues: {},
        snapshot: {},
      },
    },
    userCards: {
      customer_cards: [],
    },
    selectedUserCard: null,
    isUserCardsLoading: true,
    isUserCardsLoaded: false,
    userCardsError: null,
    purchaseDetails: null,
    deletingCards: [],
    isSMSSended: false,
    jwtToken: null,
    isSMSSending: false,
    isAuthenticated: false,
    isAuthenticating: false,
    phoneNumber: null,
    isEmailVerificationSent: false,
    isEmailVerificationSending: false,
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
