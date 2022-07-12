import { rest } from 'msw';
import { QuoteResponse } from '../../redux/quotesApi';
import { server } from '../utils';
import { serverQuoteRequestMock } from './mocks';

export const setupServerQuoteRequest = (responseBody?: Partial<QuoteResponse>) => {
  server.use(
    rest.post(`${process.env.REACT_APP_SERVER_URL}quotes`, (req, res, ctx) => res(ctx.json({
      ...serverQuoteRequestMock,
      ...responseBody,
    }))),
  );
};
