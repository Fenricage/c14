import { waitFor } from '@testing-library/react';
import slice, {
  decrementCounter,
  // decrementWidgetStep,
  // incrementWidgetStep,
  initialState,
  setFee,
  setLastChangedQuoteInputName,
  setQuotesAutoUpdateEnable,
  setQuotesUserDecimalSeparator,
  setRequestCounter,
  // Steps,
  selectApp,
} from './applicationSlice';
import { quotesApi } from '../redux/quotesApi';
import { server } from '../testHandlers/utils';
import { createStoreWithMiddlewares, store as rootStore } from '../app/store';
import {
  setupServerQuoteRequest,
} from '../testHandlers/setupServerQuoteRequest';
import { serverQuoteRequestMock } from '../testHandlers/mocks';

beforeAll(() => server.listen({
  onUnhandledRequest: 'bypass',
}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('application slice testing', () => {
  let store = rootStore;

  beforeEach(() => {
    store = createStoreWithMiddlewares(undefined);
  });

  it('Should return initial state', () => {
    expect(
      slice.reducer(undefined, {
        type: undefined,
      }),
    ).toEqual(initialState);
  });

  // it('should be able to increment/decrements step', () => {
  //   store.dispatch(incrementWidgetStep());
  //   expect(selectApp(store.getState()).stepper.currentStep).toBe(Steps.PHONE_VERIFICATION);
  //   store.dispatch(incrementWidgetStep());
  //   expect(selectApp(store.getState()).stepper.currentStep).toBe(Steps.PHONE_CONFIRMATION);
  //   store.dispatch(decrementWidgetStep());
  //   expect(selectApp(store.getState()).stepper.currentStep).toBe(Steps.PHONE_VERIFICATION);
  // });

  it('test counter', () => {
    store.dispatch(setRequestCounter(3000));
    expect(selectApp(store.getState()).requestCounter).toBe(3000);
    store.dispatch(decrementCounter(1000));
    expect(selectApp(store.getState()).requestCounter).toBe(2000);
  });

  it('test set fee', () => {
    const valueToSet = {
      c14: '100',
      network: '50',
      total: '150',
    };

    store.dispatch(setFee(valueToSet));
    expect(selectApp(store.getState()).fee).toBe(valueToSet);
  });

  it('test setting auto update', () => {
    store.dispatch(setQuotesAutoUpdateEnable(true));
    expect(selectApp(store.getState()).isQuotesAutoUpdateEnabled).toBe(true);
  });

  it('test last changed quote input name', () => {
    store.dispatch(setLastChangedQuoteInputName('quoteTargetAmount'));
    expect(selectApp(store.getState()).lastChangedQuoteInputName).toBe('quoteTargetAmount');
  });

  it('test last changed quote input name', () => {
    store.dispatch(setQuotesUserDecimalSeparator(','));
    expect(selectApp(store.getState()).quotesUserDecimalSeparator).toBe(',');
  });

  it('tests quote request', async () => {
    setupServerQuoteRequest({
      source_currency: 'USD',
      source_amount: '50',
      target_amount: '60',
      target_crypto_asset_id: 'b2384bf2-b14d-4916-aa97-85633ef05742',
    });

    store.dispatch(quotesApi.endpoints.getQuote.initiate({
      source_currency: 'USD',
      source_amount: '50',
      target_crypto_asset_id: 'b2384bf2-b14d-4916-aa97-85633ef05742',
    }));

    await waitFor(() => {
      expect(selectApp(store.getState()).isQuoteLoading).toEqual(true);
    });

    await waitFor(() => {
      expect(selectApp(store.getState()).quotes).toEqual({
        ...serverQuoteRequestMock,
        source_amount: '50',
        target_amount: '60',
        source_currency: 'USD',
        target_crypto_asset_id: 'b2384bf2-b14d-4916-aa97-85633ef05742',
      });
    });

    await waitFor(() => {
      expect(selectApp(store.getState()).isQuoteLoaded).toEqual(true);
      expect(selectApp(store.getState()).isQuoteLoading).toEqual(false);
    });
  });
});
