import { UserDecimalSeparator } from '../pages/HomePage/steps/QuotesStep/QuotesStepContainer';

export const replaceDecimalSeparator = (separator: UserDecimalSeparator, value: string): string => {
  let finalValue = value;
  if (separator === '.') {
    finalValue = finalValue.replace(',', '.');
  }

  if (separator === ',') {
    finalValue = finalValue.replace('.', ',');
  }
  return finalValue;
};
