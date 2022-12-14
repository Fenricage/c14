import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuoteResponse, quotesApi } from '../redux/quotesApi';
import {
  QuoteFormValues,
} from '../pages/HomePage/steps/QuotesStep/QuotesStepContainer';
import { RootState } from '../app/store';

import { GetPurchaseDetailsResponse, purchaseApi } from '../redux/purchaseApi';
import { LoginResponse, userApi } from '../redux/userApi';
import { AlertType } from '../pages/HomePage/Alert';

export const CALCULATOR_FORM_NAME = 'calculator-form';

export enum StepperSteps {
  QUOTES,
  PHONE_VERIFICATION,
  PERSONAL_INFORMATION,
  PAYMENT_DETAILS,
  REVIEW_ORDER,
}
export type DocumentVerificationStatus = 'FAILED' | 'SUCCESS' | 'IN_PROGRESS' | 'NOT_STARTED'

export enum WidgetSteps {
  QUOTES = 0,
  PHONE_VERIFICATION = 1,
  PHONE_CONFIRMATION = 2,
  DOCUMENT_VERIFICATION = 3,
  PERSONAL_INFORMATION = 4,
  EMAIL_VERIFICATION = 4.1,
  PAYMENT_ADDING = 4.2,
  PAYMENT_SELECT = 5,
  REVIEW_ORDER = 6,
  PROCESS = 7,
  COMPLETE= 8,
}

export type GoToWidgetAction = {
  widgetStep: WidgetSteps,
  shouldUpdateStepper?: boolean,
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
      return WidgetSteps.DOCUMENT_VERIFICATION;
    }
    case WidgetSteps.DOCUMENT_VERIFICATION: {
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
      return WidgetSteps.DOCUMENT_VERIFICATION;
    }
    case WidgetSteps.DOCUMENT_VERIFICATION: {
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

export type GeneralError = {
  type: AlertType
  message: string
} | null

export type QuoteInputName = 'quoteSourceAmount' | 'quoteTargetAmount';
export type AppState = {
  isQuoteLoaded: boolean
  isQuoteLoading: boolean
  generalError: GeneralError
  skipPaymentStep: boolean
  quoteError: null | string
  quotes: QuoteResponse | Record<string, never>
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
  },

  purchaseDetails: GetPurchaseDetailsResponse | null

  jwtToken: LoginResponse | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
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
}

export const initialState: AppState = {
  isQuoteLoaded: false,
  quoteError: null,
  quotes: {},
  generalError: null,
  skipPaymentStep: true,
  isQuoteLoading: false,
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
  },
  purchaseDetails: null,
  // jwtToken: localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN) as string) : null,
  jwtToken: null,
  // isAuthenticated: localStorage.getItem(TOKEN) !== null,
  isAuthenticated: false,
  isAuthenticating: false,
  blockChainTargetAddress: '',
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setQuote(state, action: PayloadAction<QuoteResponse>) {
      state.quotes = action.payload;
    },
    incrementWidgetStep(state) {
      state.widgetSteps.currentStep = getNextWidgetStep(state.widgetSteps.currentStep);
    },
    decrementWidgetStep(state) {
      state.widgetSteps.currentStep = getPrevWidgetStep(state.widgetSteps.currentStep);
    },
    goToWidgetStep(state, action: PayloadAction<GoToWidgetAction>) {
      state.widgetSteps.currentStep = action.payload.widgetStep;
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
    setQuotesLoading(state, action: PayloadAction<boolean>) {
      state.isQuoteLoading = action.payload;
    },
    setQuotesLoaded(state, action: PayloadAction<boolean>) {
      state.isQuoteLoaded = action.payload;
    },
    setInitialValuesForm(state, action: PayloadAction<InitialFormValuesPayload>) {
      if (action.payload.formName === CALCULATOR_FORM_NAME) {
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
    },
    resetApplication: () => initialState,
    logout: () => initialState,

    setGeneralError: (state, action: PayloadAction<GeneralError>) => {
      state.generalError = action.payload;
    },
    setSkipPaymentStep: (state, { payload }: PayloadAction<boolean>) => {
      state.skipPaymentStep = payload;
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
      (state, action) => {
        switch (state.widgetSteps.currentStep) {
          case WidgetSteps.PERSONAL_INFORMATION: {
            if (action.payload.shouldUpdateStepper === false) {
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
      purchaseApi.endpoints.getPurchaseDetails.matchFulfilled,
      (state, { payload }) => {
        state.purchaseDetails = payload;
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
  },
});

export const selectApp = (state: RootState) => state.application;

export const {
  setQuote,
  decrementWidgetStep,
  incrementWidgetStep,
  goToWidgetStep,
  incrementStepperStep,
  logout,
  goToStepperStep,
  setQuotesLoading,
  setQuotesLoaded,
  setSnapshotValuesForm,
  setSkipPaymentStep,
  setGeneralError,
  setBlockchainTargetAddress,
} = applicationSlice.actions;

export default applicationSlice;
