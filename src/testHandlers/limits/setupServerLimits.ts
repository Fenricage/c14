import { rest } from 'msw';
import { server } from '../utils';
import { serverLimitsRequestMock } from './mocks';
import { GetUserLimitsResponse } from '../../redux/limitsApi';

export const setupServerLimits = (responseBody?: Partial<GetUserLimitsResponse>) => {
  server.use(
    rest.get(`${process.env.REACT_APP_SERVER_URL}user-limits`, (req, res, ctx) => res(ctx.json({
      ...serverLimitsRequestMock,
      ...responseBody,
    }))),
  );
};
