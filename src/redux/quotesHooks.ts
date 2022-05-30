import { useEffect, useRef } from 'react';
import { QuoteRequestBody, useGetQuoteMutation } from './quotesApi';
import { useAppSelector } from '../app/hooks';
import { selectApp } from '../state/applicationSlice';

export const useGetQuote = (body: QuoteRequestBody) => {
  const application = useAppSelector(selectApp);

  const {
    isQuoteLoaded,
    quotes,
    isQuoteLoading,
  } = application;

  const request = useRef<any>(null);

  const [triggerGetQuotes, mutation] = useGetQuoteMutation();

  useEffect(() => {
    if (!isQuoteLoaded) {
      request.current = triggerGetQuotes(body);
    }
  }, [body, isQuoteLoaded, triggerGetQuotes]);

  return {
    triggerGetQuotes,
    mutation,
    request,
    isQuoteLoaded,
    isLoading: isQuoteLoading,
    quotes,
  };
};
