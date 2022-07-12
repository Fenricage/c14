import { rest } from 'msw';
import { QuoteResponse } from '../../redux/quotesApi';
import { server } from '../utils';
import { serverQuoteRequestMock } from '../quotes/mocks';

export const setupServerPersonalInformation_GET = (responseBody?: Partial<QuoteResponse>) => {
  server.use(
    rest.get(`${process.env.REACT_APP_SERVER_URL}user-details`, (req, res, ctx) => res(ctx.json({
      ...serverQuoteRequestMock,
      ...responseBody,
    }))),
  );
};
