import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { setQuotesLoading } from '../../../../state/applicationSlice';
import { QuoteFormValues, replaceCommaWithDot } from './QuotesStep';
import { useAppDispatch } from '../../../../app/hooks';

export const useUpdateQuotes = (handleTriggerUpdateQuotes: (values: QuoteFormValues) => Promise<void>) => {
  const dispatch = useAppDispatch();
  return useCallback(async (values: QuoteFormValues) => {
    try {
      // replace comma to dot and trim comma/dot in the end of string
      const regexReplacer = (match: string, numberPart: string) => numberPart;
      const endWithDotOrCommaRegex = /(^[0-9]+)([,|.])$/i;
      const finalSourceValue = replaceCommaWithDot(values.quoteSourceAmount)
        .replace(endWithDotOrCommaRegex, regexReplacer);
      const finalTargetValue = replaceCommaWithDot(values.quoteTargetAmount)
        .replace(endWithDotOrCommaRegex, regexReplacer);
      await handleTriggerUpdateQuotes({
        ...values,
        quoteSourceAmount: finalSourceValue,
        quoteTargetAmount: finalTargetValue,
      });
      dispatch(setQuotesLoading(false));
    } catch (e) {
      toast.error('Failed to update quotes');
    }
  }, [dispatch, handleTriggerUpdateQuotes]);
};
