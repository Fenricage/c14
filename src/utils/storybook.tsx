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
    stepperSteps: {
      currentStep: 2,
    },
    widgetSteps: {
      currentStep: 2,
    },
    wizard: {
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
