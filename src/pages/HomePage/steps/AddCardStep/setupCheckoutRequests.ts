import { rest } from 'msw';
import { QuoteResponse } from '../../../../redux/quotesApi';
import { server } from '../../../../testHandlers/utils';
import { serverQuoteRequestMock } from '../../../../testHandlers/quotes/mocks';

export const setupCheckoutRequests = (responseBody?: Partial<QuoteResponse>) => {
  server.use(
    rest.post(`${process.env.REACT_APP_SERVER_URL}quotes`, (req, res, ctx) => res(ctx.json({
      ...serverQuoteRequestMock,
      ...responseBody,
    }))),
  );
};
