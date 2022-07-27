import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeeData } from '../pages/HomePage/Widget/Widget';
import { QuoteResponse, quotesApi } from '../redux/quotesApi';
import {
  QuoteFormValues,
} from '../pages/HomePage/steps/QuotesStep/QuotesStepContainer';
import { RootState } from '../app/store';
import { cardsApi, GetUserCardsResponse, PaymentCard } from '../redux/cardsApi';
import { PaymentSelectFormValues } from '../pages/HomePage/steps/PaymentSelectStep/PaymentSelectStep';
import { GetPurchaseDetailsResponse, purchaseApi } from '../redux/purchaseApi';
import { LoginResponse, userApi, UserDetails } from '../redux/userApi';

export const CALCULATOR_FORM_NAME = 'calculator-form';
export const PAYMENT_SELECT_FORM_NAME = 'payment-select-form';

export type ServerError = {
  error_code: string;
  message: null;
}

export enum StepperSteps {
  QUOTES,
  PHONE_VERIFICATION,
  PERSONAL_INFORMATION,
  PAYMENT_DETAILS,
  REVIEW_ORDER,
}

export enum WidgetSteps {
  QUOTES = 0,
  PHONE_VERIFICATION = 1,
  PHONE_CONFIRMATION = 2,
  PERSONAL_INFORMATION = 3,
  EMAIL_VERIFICATION = 3.1,
  PAYMENT_ADDING = 3.2,
  PAYMENT_SELECT = 4,
  REVIEW_ORDER = 5,
  PROCESS = 6,
  COMPLETE= 7,
}

const getPrevStepperStep = (currentStep: StepperSteps) => {
  switch (currentStep) {
    case StepperSteps.REVIEW_ORDER: {
      return StepperSteps.PAYMENT_DETAILS;
    }
    case StepperSteps.PAYMENT_DETAILS: {
      return StepperSteps.PERSONAL_INFORMATION;
    }
    case StepperSteps.PERSONAL_INFORMATION: {
      return StepperSteps.PHONE_VERIFICATION;
    }
    case StepperSteps.PHONE_VERIFICATION: {
      return StepperSteps.QUOTES;
    }
    case StepperSteps.QUOTES: {
      return StepperSteps.REVIEW_ORDER;
    }

    default: {
      return StepperSteps.REVIEW_ORDER;
    }
  }
};

const getNextStepperStep = (currentStep: StepperSteps) => {
  switch (currentStep) {
    case StepperSteps.QUOTES: {
      return StepperSteps.PHONE_VERIFICATION;
    }
    case StepperSteps.PHONE_VERIFICATION: {
      return StepperSteps.PERSONAL_INFORMATION;
    }
    case StepperSteps.PERSONAL_INFORMATION: {
      return StepperSteps.PAYMENT_DETAILS;
    }
    case StepperSteps.PAYMENT_DETAILS: {
      return StepperSteps.REVIEW_ORDER;
    }
    case StepperSteps.REVIEW_ORDER: {
      return StepperSteps.QUOTES;
    }

    default: {
      return StepperSteps.QUOTES;
    }
  }
};

const getNextWidgetStep = (currentStep: WidgetSteps) => {
  switch (currentStep) {
    case WidgetSteps.QUOTES: {
      return WidgetSteps.PHONE_VERIFICATION;
    }
    case WidgetSteps.PHONE_VERIFICATION: {
      return WidgetSteps.PHONE_CONFIRMATION;
    }
    case WidgetSteps.PHONE_CONFIRMATION: {
      return WidgetSteps.PERSONAL_INFORMATION;
    }
    case WidgetSteps.EMAIL_VERIFICATION: {
      return WidgetSteps.PAYMENT_SELECT;
    }
    case WidgetSteps.PAYMENT_ADDING: {
      return WidgetSteps.PAYMENT_SELECT;
    }
    case WidgetSteps.PERSONAL_INFORMATION: {
      return WidgetSteps.PAYMENT_SELECT;
    }
    case WidgetSteps.PAYMENT_SELECT: {
      return WidgetSteps.REVIEW_ORDER;
    }
    case WidgetSteps.REVIEW_ORDER: {
      return WidgetSteps.PROCESS;
    }
    case WidgetSteps.PROCESS: {
      return WidgetSteps.COMPLETE;
    }

    default: {
      return WidgetSteps.QUOTES;
    }
  }
};

const getPrevWidgetStep = (currentStep: WidgetSteps) => {
  switch (currentStep) {
    case WidgetSteps.COMPLETE: {
      return WidgetSteps.PROCESS;
    }
    case WidgetSteps.PROCESS: {
      return WidgetSteps.REVIEW_ORDER;
    }
    case WidgetSteps.REVIEW_ORDER: {
      return WidgetSteps.PAYMENT_SELECT;
    }
    case WidgetSteps.PAYMENT_ADDING: {
      return WidgetSteps.PAYMENT_SELECT;
    }
    case WidgetSteps.EMAIL_VERIFICATION: {
      return WidgetSteps.PERSONAL_INFORMATION;
    }
    case WidgetSteps.PAYMENT_SELECT: {
      return WidgetSteps.PERSONAL_INFORMATION;
    }
    case WidgetSteps.PERSONAL_INFORMATION: {
      return WidgetSteps.PHONE_CONFIRMATION;
    }
    case WidgetSteps.PHONE_CONFIRMATION: {
      return WidgetSteps.PHONE_VERIFICATION;
    }
    case WidgetSteps.PHONE_VERIFICATION: {
      return WidgetSteps.QUOTES;
    }

    default: {
      return WidgetSteps.COMPLETE;
    }
  }
};

export type GeneralErrorKind = 'warn' | 'success' | 'error';

export type GeneralError = {
  type: GeneralErrorKind
  message: string
} | null

export type QuoteInputName = 'quoteSourceAmount' | 'quoteTargetAmount';
export type AppState = {
  isQuoteLoaded: boolean
  isQuoteLoading: boolean
  isUserCardsEmpty: boolean
  generalError: GeneralError
  user: null | UserDetails
  isUserLoading: boolean
  skipPaymentStep: boolean
  skipPersonalInfoStep: boolean
  isUserLoaded: boolean
  isUserUpdating: boolean
  isUserUpdated: boolean
  isUserVerified: boolean;
  isEmailVerified: boolean;
  quoteError: null | string
  quotes: QuoteResponse | Record<string, never>
  lastChangedQuoteInputName: QuoteInputName
  fee: FeeData
  stepperSteps: {
    currentStep: StepperSteps
  }
  widgetSteps: {
    currentStep: WidgetSteps
  }
  wizard: {
    [CALCULATOR_FORM_NAME]: {
      initialValues: QuoteFormValues
      snapshot: QuoteFormValues
    },
    [PAYMENT_SELECT_FORM_NAME]: {
      initialValues: PaymentSelectFormValues | Record<string, never>
      snapshot: PaymentSelectFormValues | Record<string, never>
    }
  },
  userCards: GetUserCardsResponse
  selectedUserCard: PaymentCard | null
  isUserCardsLoading: boolean
  isUserCardsLoaded: boolean
  userCardsError: string | null
  purchaseDetails: GetPurchaseDetailsResponse | null
  deletingCards: string[]
  jwtToken: LoginResponse | null;
  isSMSSended: boolean;
  isSMSSending: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  phoneNumber: string | null;
  isEmailVerificationSent: boolean;
  isEmailVerificationSending: boolean;
  blockChainTargetAddress: string | null
}

export const initialQuotesValuesForm: QuoteFormValues = {
  quoteSourceAmount: '100',
  quoteTargetAmount: '',
  sourceCurrency: 'USD',
  targetCurrency: 'b2384bf2-b14d-4916-aa97-85633ef05742',
};

type InitialFormValuesPayload = {
  formName: typeof CALCULATOR_FORM_NAME
  state: Partial<QuoteFormValues>
} | {
  formName: typeof PAYMENT_SELECT_FORM_NAME
  state: Partial<PaymentSelectFormValues>
}

export const initialState = {
  isQuoteLoaded: false,
  quoteError: null,
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
  quotesUserDecimalSeparator: undefined,
  isQuotesAutoUpdateEnabled: false,
  lastChangedQuoteInputName: 'quoteSourceAmount',
  requestCounter: 0,
  fee: {
    c14: undefined,
    network: undefined,
    total: undefined,
  },
  stepperSteps: {
    currentStep: StepperSteps.QUOTES,
  },
  widgetSteps: {
    currentStep: WidgetSteps.QUOTES,
  },
  wizard: {
    [CALCULATOR_FORM_NAME]: {
      initialValues: initialQuotesValuesForm,
      snapshot: initialQuotesValuesForm,
    },
    [PAYMENT_SELECT_FORM_NAME]: {
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
  // jwtToken: localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN) as string) : null,
  jwtToken: null,
  isSMSSending: false,
  // isAuthenticated: localStorage.getItem(TOKEN) !== null,
  isAuthenticated: false,
  isAuthenticating: false,
  phoneNumber: null,
  isEmailVerificationSent: false,
  isEmailVerificationSending: false,
  blockChainTargetAddress: '',
} as AppState;

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setFee(state, action: PayloadAction<FeeData>) {
      state.fee = action.payload;
    },
    setUserCardsEmpty(state, action: PayloadAction<boolean>) {
      state.isUserCardsEmpty = action.payload;
    },
    incrementWidgetStep(state) {
      state.widgetSteps.currentStep = getNextWidgetStep(state.widgetSteps.currentStep);
    },
    decrementWidgetStep(state) {
      state.widgetSteps.currentStep = getPrevWidgetStep(state.widgetSteps.currentStep);
    },
    goToWidgetStep(state, action: PayloadAction<WidgetSteps>) {
      state.widgetSteps.currentStep = action.payload;
    },
    incrementStepperStep(state) {
      state.stepperSteps.currentStep = getNextStepperStep(state.stepperSteps.currentStep);
    },
    decrementStepperStep(state) {
      state.stepperSteps.currentStep = getPrevStepperStep(state.stepperSteps.currentStep);
    },
    goToStepperStep(state, action: PayloadAction<StepperSteps>) {
      state.stepperSteps.currentStep = action.payload;
    },
    setLastChangedQuoteInputName(state, action: PayloadAction<QuoteInputName>) {
      state.lastChangedQuoteInputName = action.payload;
    },
    setQuotesLoading(state, action: PayloadAction<boolean>) {
      state.isQuoteLoading = action.payload;
    },
    setQuotesLoaded(state, action: PayloadAction<boolean>) {
      state.isQuoteLoaded = action.payload;
    },
    setSelectedUserCard(state, action: PayloadAction<PaymentCard>) {
      state.selectedUserCard = action.payload;
    },
    clearSelectedUserCard(state) {
      state.selectedUserCard = null;
    },
    setInitialValuesForm(state, action: PayloadAction<InitialFormValuesPayload>) {
      if (action.payload.formName === CALCULATOR_FORM_NAME) {
        state.wizard[action.payload.formName].initialValues = {
          ...state.wizard[action.payload.formName].initialValues,
          ...action.payload.state,
        };
      }

      if (action.payload.formName === PAYMENT_SELECT_FORM_NAME) {
        state.wizard[action.payload.formName].initialValues = {
          ...state.wizard[action.payload.formName].initialValues,
          ...action.payload.state,
        };
      }
    },
    setSnapshotValuesForm(state, action: PayloadAction<InitialFormValuesPayload>) {
      if (action.payload.formName === CALCULATOR_FORM_NAME) {
        state.wizard[action.payload.formName].snapshot = {
          ...state.wizard[action.payload.formName].snapshot,
          ...action.payload.state,
        };
      }

      if (action.payload.formName === PAYMENT_SELECT_FORM_NAME) {
        state.wizard[action.payload.formName].snapshot = {
          ...state.wizard[action.payload.formName].snapshot,
          ...action.payload.state,
        };
      }
    },
    resetUserCards(state) {
      state.userCards = {
        customer_cards: [],
      };
      state.isUserCardsLoading = true;
      // state.isUserCardsEmpty = false;
      state.isUserCardsLoaded = false;
      state.userCardsError = null;
    },
    resetApplication: () => initialState,
    logout: () => initialState,
    setUserUpdated: (state, action: PayloadAction<boolean>) => {
      state.isUserUpdated = action.payload;
    },
    setGeneralError: (state, action: PayloadAction<GeneralError>) => {
      state.generalError = action.payload;
    },
    setSkipPaymentStep: (state, { payload }: PayloadAction<boolean>) => {
      state.skipPaymentStep = payload;
    },
    setSkipPersonalInfoStep: (state, { payload }: PayloadAction<boolean>) => {
      state.skipPersonalInfoStep = payload;
    },
    setEmailVerificationSent: (state, { payload }: PayloadAction<boolean>) => {
      state.isEmailVerificationSent = payload;
    },
    setBlockchainTargetAddress: (state, { payload }: PayloadAction<string | null>) => {
      state.blockChainTargetAddress = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      applicationSlice.actions.incrementWidgetStep.match,
      (state) => {
        switch (state.widgetSteps.currentStep) {
          case WidgetSteps.PHONE_VERIFICATION: {
            state.stepperSteps.currentStep = StepperSteps.PHONE_VERIFICATION;
            break;
          }
          case WidgetSteps.PERSONAL_INFORMATION: {
            state.stepperSteps.currentStep = StepperSteps.PERSONAL_INFORMATION;
            break;
          }

          case WidgetSteps.PAYMENT_SELECT: {
            state.stepperSteps.currentStep = StepperSteps.PAYMENT_DETAILS;
            break;
          }

          case WidgetSteps.REVIEW_ORDER: {
            state.stepperSteps.currentStep = StepperSteps.REVIEW_ORDER;
            break;
          }

          default: {
            break;
          }
        }
      },
    );

    builder.addMatcher(
      applicationSlice.actions.decrementWidgetStep.match,
      (state) => {
        switch (state.widgetSteps.currentStep) {
          case WidgetSteps.PAYMENT_SELECT: {
            state.stepperSteps.currentStep = StepperSteps.PAYMENT_DETAILS;
            break;
          }

          case WidgetSteps.PERSONAL_INFORMATION: {
            state.stepperSteps.currentStep = StepperSteps.PERSONAL_INFORMATION;
            break;
          }

          case WidgetSteps.PHONE_CONFIRMATION: {
            state.stepperSteps.currentStep = StepperSteps.PHONE_VERIFICATION;
            break;
          }

          case WidgetSteps.QUOTES: {
            state.stepperSteps.currentStep = StepperSteps.QUOTES;
            break;
          }

          default: {
            break;
          }
        }
      },
    );

    builder.addMatcher(
      applicationSlice.actions.goToWidgetStep.match,
      (state) => {
        switch (state.widgetSteps.currentStep) {
          case WidgetSteps.PERSONAL_INFORMATION: {
            if (!state.isUserCardsEmpty) {
              return;
            }
            state.stepperSteps.currentStep = StepperSteps.PERSONAL_INFORMATION;
            break;
          }

          default: {
            break;
          }
        }
      },
    );

    builder.addMatcher(
      quotesApi.endpoints.getQuote.matchPending,
      (state) => {
        state.isQuoteLoading = true;
      },
    );

    builder.addMatcher(
      quotesApi.endpoints.getQuote.matchRejected,
      (state) => {
        state.isQuoteLoading = false;
        state.isQuoteLoaded = true;
        state.quoteError = 'Request is failed';
      },
    );

    builder.addMatcher(
      quotesApi.endpoints.getQuote.matchFulfilled,
      (state, { payload }) => {
        state.isQuoteLoading = false;
        state.isQuoteLoaded = true;
        state.quoteError = '';
        state.quotes = {
          ...payload,
          target_amount: payload.target_amount,
          source_amount: payload.source_amount,
        };
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.getUserCards.matchPending,
      (state) => {
        state.isUserCardsLoading = true;
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.getUserCards.matchRejected,
      (state) => {
        state.isUserCardsLoading = false;
        state.isUserCardsLoaded = true;
        state.userCardsError = 'Request is failed';
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.getUserCards.matchFulfilled,
      (state, { payload }) => {
        state.isUserCardsLoading = false;
        state.isUserCardsLoaded = true;
        state.userCardsError = '';
        state.userCards = payload;
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.deleteUserCard.matchPending,
      (state, { meta }) => {
        const toDeleteCardId = meta.arg.originalArgs;
        state.deletingCards = [...state.deletingCards, toDeleteCardId];
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.deleteUserCard.matchFulfilled,
      (state, { meta }) => {
        const toDeleteCardId = meta.arg.originalArgs;
        state.userCards.customer_cards = state.userCards.customer_cards
          .filter((c) => c.card_id !== toDeleteCardId);
        state.deletingCards = state.deletingCards.filter((c) => c !== toDeleteCardId);
      },
    );

    builder.addMatcher(
      purchaseApi.endpoints.getPurchaseDetails.matchFulfilled,
      (state, { payload }) => {
        state.purchaseDetails = payload;
      },
    );

    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchPending,
      (state) => {
        state.isSMSSending = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchFulfilled,
      (state, { meta }) => {
        state.isSMSSending = false;
        state.phoneNumber = meta.arg.originalArgs.phone_number;

        state.isSMSSended = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchRejected,
      (state) => {
        state.isSMSSending = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.login.matchPending,
      (state) => {
        state.isAuthenticating = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.jwtToken = payload;
        state.isAuthenticated = true;
        state.isAuthenticating = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.login.matchRejected,
      (state) => {
        state.isAuthenticating = false;
      },
    );

    builder.addMatcher(applicationSlice.actions.logout.match, (state) => {
      state.widgetSteps.currentStep = WidgetSteps.QUOTES;
      state.stepperSteps.currentStep = StepperSteps.QUOTES;
    });

    builder.addMatcher(
      userApi.endpoints.getUser.matchPending,
      (state) => {
        state.isUserLoading = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isUserVerified = payload.identity_verified;
        state.isEmailVerified = payload.email_verified;
        state.isUserLoaded = true;
        state.isUserLoading = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.getUser.matchRejected,
      (state) => {
        state.isUserLoading = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.updateUser.matchPending,
      (state) => {
        state.isUserUpdating = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.updateUser.matchFulfilled,
      (state, { meta, payload }) => {
        state.user = meta.arg.originalArgs;
        state.isUserVerified = payload.identity_verified;
        state.isUserUpdated = true;
        state.isUserUpdating = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.updateUser.matchRejected,
      (state) => {
        state.isUserUpdating = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchPending,
      (state) => {
        state.isEmailVerificationSending = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchFulfilled,
      (state) => {
        state.isEmailVerificationSent = true;
        state.isEmailVerificationSending = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchRejected,
      (state) => {
        state.isEmailVerificationSending = false;
      },
    );
  },
});

export const selectApp = (state: RootState) => state.application;

export const {
  setFee,
  decrementWidgetStep,
  incrementWidgetStep,
  goToWidgetStep,
  incrementStepperStep,
  logout,
  goToStepperStep,
  setInitialValuesForm,
  setSelectedUserCard,
  setQuotesLoading,
  setLastChangedQuoteInputName,
  setUserCardsEmpty,
  setQuotesLoaded,
  setSnapshotValuesForm,
  resetUserCards,
  resetApplication,
  setUserUpdated,
  setSkipPaymentStep,
  setGeneralError,
  setSkipPersonalInfoStep,
  setEmailVerificationSent,
  setBlockchainTargetAddress,
} = applicationSlice.actions;

export default applicationSlice;
