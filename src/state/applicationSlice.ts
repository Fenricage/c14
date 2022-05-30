import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeeData } from '../pages/HomePage/Widget/Widget';
import { QuoteResponse, quotesApi } from '../redux/quotesApi';
import { QuoteFormValues, UserDecimalSeparator } from '../pages/HomePage/steps/QuotesStep/QuotesStep';
import { replaceDecimalSeparator } from '../utils';
import { RootState } from '../app/store';
import { SECOND_MS } from '../constants';

export const CALCULATOR_FORM_NAME = 'calculator-form';

export enum Steps {
  QUOTES,
  PHONE_VERIFICATION,
  PHONE_CONFIRMATION,
  PERSONAL_INFORMATION,
  PAYMENT_METHOD,
  REVIEW_ORDER,
  PROCESS,
  COMPLETE,
}

const getNextStep = (currentStep: Steps) => {
  switch (currentStep) {
    case Steps.QUOTES: {
      return Steps.PHONE_VERIFICATION;
    }
    case Steps.PHONE_VERIFICATION: {
      return Steps.PHONE_CONFIRMATION;
    }
    case Steps.PHONE_CONFIRMATION: {
      return Steps.PERSONAL_INFORMATION;
    }
    case Steps.PERSONAL_INFORMATION: {
      return Steps.PAYMENT_METHOD;
    }
    case Steps.PAYMENT_METHOD: {
      return Steps.REVIEW_ORDER;
    }
    case Steps.REVIEW_ORDER: {
      return Steps.PROCESS;
    }
    case Steps.PROCESS: {
      return Steps.COMPLETE;
    }

    default: {
      return Steps.QUOTES;
    }
  }
};

const getPrevStep = (currentStep: Steps) => {
  switch (currentStep) {
    case Steps.COMPLETE: {
      return Steps.PROCESS;
    }
    case Steps.PROCESS: {
      return Steps.REVIEW_ORDER;
    }
    case Steps.REVIEW_ORDER: {
      return Steps.PAYMENT_METHOD;
    }
    case Steps.PAYMENT_METHOD: {
      return Steps.PERSONAL_INFORMATION;
    }
    case Steps.PERSONAL_INFORMATION: {
      return Steps.PHONE_CONFIRMATION;
    }
    case Steps.PHONE_CONFIRMATION: {
      return Steps.PHONE_VERIFICATION;
    }
    case Steps.PHONE_VERIFICATION: {
      return Steps.QUOTES;
    }

    default: {
      return Steps.COMPLETE;
    }
  }
};

export type QuoteInputName = 'quoteSourceAmount' | 'quoteTargetAmount';
export type AppState = {
  isQuoteLoaded: boolean
  isQuoteLoading: boolean
  requestCounter: number
  quoteError: null | string
  quotes: QuoteResponse
  isQuotesAutoUpdateEnabled: boolean
  quotesUserDecimalSeparator: UserDecimalSeparator
  lastChangedQuoteInputName: QuoteInputName
  fee: FeeData
  stepper: {
    currentStep: Steps
  }
  wizard: {
    [CALCULATOR_FORM_NAME]: {
      initialValues: QuoteFormValues,
      snapshot: QuoteFormValues,
    }
  }
}

export const initialQuotesValuesForm: QuoteFormValues = {
  quoteSourceAmount: '100',
  quoteTargetAmount: '',
};

type InitialFormValuesPayload = {
  formName: typeof CALCULATOR_FORM_NAME
  state: Partial<QuoteFormValues>
}

export const initialState = {
  isQuoteLoaded: false,
  quoteError: null,
  quotes: {},
  isQuoteLoading: false,
  quotesUserDecimalSeparator: undefined,
  isQuotesAutoUpdateEnabled: false,
  lastChangedQuoteInputName: 'quoteSourceAmount',
  requestCounter: 0,
  fee: {
    c14: undefined,
    network: undefined,
    total: undefined,
  },
  stepper: {
    currentStep: Steps.QUOTES,
  },
  wizard: {
    [CALCULATOR_FORM_NAME]: {
      initialValues: initialQuotesValuesForm,
      snapshot: initialQuotesValuesForm,
    },
  },
} as AppState;

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setRequestCounter(state, action: PayloadAction<number>) {
      state.requestCounter = action.payload;
    },
    decrementCounter(state, action: PayloadAction<number>) {
      if (!state.requestCounter) {
        return;
      }
      const decValue = action?.payload || SECOND_MS;
      state.requestCounter -= decValue;
    },
    setFee(state, action: PayloadAction<FeeData>) {
      state.fee = action.payload;
    },
    incrementStep(state) {
      state.stepper.currentStep = getNextStep(state.stepper.currentStep);
    },
    // prevent triggerGetQuotes on change form values
    setQuotesAutoUpdateEnable(state, action: PayloadAction<boolean>) {
      state.isQuotesAutoUpdateEnabled = action.payload;
    },
    setLastChangedQuoteInputName(state, action: PayloadAction<QuoteInputName>) {
      state.lastChangedQuoteInputName = action.payload;
    },
    setQuotesUserDecimalSeparator(state, action: PayloadAction<UserDecimalSeparator>) {
      state.quotesUserDecimalSeparator = action.payload;
    },
    setQuotesLoading(state, action: PayloadAction<boolean>) {
      state.isQuoteLoading = action.payload;
    },
    decrementStep(state) {
      state.stepper.currentStep = getPrevStep(state.stepper.currentStep);
    },
    setInitialValuesForm(state, action: PayloadAction<InitialFormValuesPayload>) {
      state.wizard[action.payload.formName].initialValues = {
        ...state.wizard[action.payload.formName].initialValues,
        ...action.payload.state,
      };
    },
    setSnapshotValuesForm(state, action: PayloadAction<InitialFormValuesPayload>) {
      state.wizard[action.payload.formName].snapshot = {
        ...state.wizard[action.payload.formName].snapshot,
        ...action.payload.state,
      };
    },
  },
  extraReducers: (builder) => {
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
          target_amount: replaceDecimalSeparator(state.quotesUserDecimalSeparator, payload.target_amount),
          source_amount: replaceDecimalSeparator(state.quotesUserDecimalSeparator, payload.source_amount),
        };
      },
    );
  },
});

export const selectApp = (state: RootState) => state.application;

export const {
  setRequestCounter,
  decrementCounter,
  setFee,
  decrementStep,
  incrementStep,
  setInitialValuesForm,
  setQuotesLoading,
  setQuotesAutoUpdateEnable,
  setLastChangedQuoteInputName,
  setSnapshotValuesForm,
  setQuotesUserDecimalSeparator,
} = applicationSlice.actions;

export default applicationSlice;
