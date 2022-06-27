import {
  configureStore,
  ThunkAction,
  Action,
  isRejectedWithValue,
  Middleware,
  isRejected,
} from '@reduxjs/toolkit';
import { quotesApi } from '../redux/quotesApi';
import { cardsApi } from '../redux/cardsApi';
import { purchaseApi } from '../redux/purchaseApi';
import { userApi } from '../redux/userApi';
import applicationSlice from '../state/applicationSlice';
import { notify } from '../utils/toast';

// macro logginng errors middleware
// api: MiddlewareAPI
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood,
  // so we're able to utilize these matchers!

  if (isRejectedWithValue(action)) {
    notify.error(action.payload.data);
  }

  if (isRejected(action)) {
    if (action?.error?.message && action.payload) {
      if (action.payload.data.detail) {
        notify.error(action.payload.data.detail);
        return;
      }
    }

    if (action?.payload?.data?.error_code) {
      notify.error(action.payload.data.error_code);
      return;
    }
  }

  return next(action);
};

export const reducer = {
  [quotesApi.reducerPath]: quotesApi.reducer,
  [cardsApi.reducerPath]: cardsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [applicationSlice.name]: applicationSlice.reducer,
};

export const createStoreWithMiddlewares = (
  initialState = {},
) => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
      {
        serializableCheck: false,
      },
    )
      .concat(quotesApi.middleware)
      .concat(cardsApi.middleware)
      .concat(purchaseApi.middleware)
      .concat(userApi.middleware)
      .concat(rtkQueryErrorLogger),
    preloadedState: initialState,
  });

  return store;
};

export const store = createStoreWithMiddlewares(undefined);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
