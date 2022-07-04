import { rest } from 'msw';
import { GetUserCardsResponse } from '../redux/cardsApi';
import { server } from './utils';

export const setupUserCardsRequestServer = (responseBody: Partial<GetUserCardsResponse>) => {
  server.use(
    rest.get(`${process.env.REACT_APP_SERVER_URL}cards`, (req, res, ctx) => res(ctx.json(responseBody))),
    rest.delete(`${process.env.REACT_APP_SERVER_URL}cards/id2`, (req, res, ctx) => res(ctx.json(null))),
    rest.delete(`${process.env.REACT_APP_SERVER_URL}cards/id1`, (req, res, ctx) => res(ctx.json(null))),
  );
};
