import { waitFor } from '@testing-library/react';
import slice, {
  // decrementWidgetStep,
  // incrementWidgetStep,
  initialState,
  // Steps,
  selectApp,
} from './applicationSlice';
import { quotesApi } from '../redux/quotesApi';
import { server } from '../testHandlers/utils';
import { createStoreWithMiddlewares, store as rootStore } from '../app/store';
import {
  setupServerQuoteRequest,
} from '../testHandlers/quotes/setupServerQuotes';
import { serverQuoteRequestMock } from '../testHandlers/quotes/mocks';

beforeAll(() => server.listen());
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
