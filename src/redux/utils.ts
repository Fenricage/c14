import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { RootState } from '../app/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_SERVER_URL,
  prepareHeaders: (headers, { getState }) => {
    const { jwtToken } = (getState() as RootState).application;
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'no-cache');

    if (jwtToken) {
      headers.set('JWT-TOKEN', jwtToken.jwt_token);
    }

    return headers;
  },

});
