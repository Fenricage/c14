import {
  Action,
  configureStore,
  isRejected,
  isRejectedWithValue,
  Middleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import { quotesApi } from '../redux/quotesApi';
import { cardsApi } from '../redux/cardsApi';
import { purchaseApi } from '../redux/purchaseApi';
import { limitsApi } from '../redux/limitsApi';
import { userApi } from '../redux/userApi';
import applicationSlice, { setGeneralError } from '../state/applicationSlice';
import limitsSlice from '../state/limitsSlice';
import { notify } from '../utils/toast';
import paymentSelectSlice from '../state/paymentSelectSlice';

const errors: {[p: string]: string} = {
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  CARD_DECLINED: 'Card declined',
  INVALID_PHONE_NUMBER_FORMAT: 'Invalid phone number format',
  INVALID_VERIFICATION_CODE: 'Invalid verification code',
  VERIFICATION_NOT_STARTED: 'Verification not started',
  COUNTRY_BLACKLISTED: 'Country blaclister',
  JWT_TOKEN_EXPIRED: 'Token expired',
  USER_PURCHASE_LIMIT_EXCEEDED: 'Purchase limit exceeded',
  INVALID_PHONE_NUMBER: 'Invalid phone number',
  USER_IDENTITY_NOT_VERIFIED: 'User identity not verified',
  USER_EMAIL_NOT_VERIFIED: 'Email not verified',
};

const getGeneralErrorMessage = (errorCode: string) => {
  if (errors[errorCode]) {
    return errors[errorCode];
  }
  return 'Unexpected error';
};

// macro logginng errors middleware
// api: MiddlewareAPI
export const rtkQueryErrorLogger: Middleware = ({ dispatch }) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood,
  // so we're able to utilize these matchers!

  if (isRejectedWithValue(action)) {
    notify.error(action.payload.data);
  }

  if (isRejected(action)) {
    if (action?.error?.message && action.payload) {
      if (action.payload.data.detail) {
        notify.error(action.payload.data.detail);
      }
    }

    if (action?.payload?.data?.error_code) {
      const generalErrorMessage = getGeneralErrorMessage(action.payload.data.error_code);
      dispatch(setGeneralError({
        type: 'error',
        message: generalErrorMessage,
      }));
    }
  }

  return next(action);
};

export const reducer = {
  [quotesApi.reducerPath]: quotesApi.reducer,
  [cardsApi.reducerPath]: cardsApi.reducer,
  [limitsApi.reducerPath]: limitsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [applicationSlice.name]: applicationSlice.reducer,
  [paymentSelectSlice.name]: paymentSelectSlice.reducer,
  [limitsSlice.name]: limitsSlice.reducer,
};

export const createStoreWithMiddlewares = (
  initialState = {},
) => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false,
    },
  )
    .concat(quotesApi.middleware)
    .concat(cardsApi.middleware)
    .concat(limitsApi.middleware)
    .concat(userApi.middleware)
    .concat(purchaseApi.middleware)
    .concat(rtkQueryErrorLogger),
  preloadedState: initialState,
});

export const store = createStoreWithMiddlewares(undefined);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
