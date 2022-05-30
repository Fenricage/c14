import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QuoteResponse } from '../redux/quotesApi';

export const server = setupServer();

export const serverQuoteRequestMock = {
  id: 'uuid534-23423423-234234-4343',
  source_currency: 'USD',
  target_currency: 'USDC_EVMOS',
  source_amount: '100',
  target_amount: '110',
  fiat_blockchain_fee: '30',
  absolute_internal_fee: '40',
  internal_fee_percent: '0',
  total_fee: '70',
  expires_at: new Date(new Date().getTime() + 3 * 60000).toISOString(),
};

export const setupServerQuoteRequest = (responseBody?: Partial<QuoteResponse>) => {
  server.use(
    rest.post(`${process.env.REACT_APP_SERVER_URL}quotes`, (req, res, ctx) => res(ctx.json({
      ...serverQuoteRequestMock,
      ...responseBody,
    }))),
  );
};
