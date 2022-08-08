import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import withFormik from '@bbbtech/storybook-formik';
import AmountField from './AmountField';
import { sourceOptions } from '../../pages/HomePage/steps/QuotesStep/QuotesStepContainer';
import { createStoreWithMiddlewares } from '../../app/store';
import { mockFn, withProvider } from '../../utils/storybook';
import { CurrencySelectOption } from '../CurrencySelectField/CurrencySelectField';

export default {
  component: AmountField,
  argTypes: {
  },
} as ComponentMeta<typeof AmountField>;

const Template: ComponentStory<typeof AmountField> = (args) => <AmountField {...args} />;

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  readOnly: true,
  label: 'You Pay',
  amountFieldName: 'quoteSourceAmount',
  currencyFieldName: 'sourceCurrency',
  currencyOptions: sourceOptions,
  amountValue: '100',
  currencyType: 'USD',
};

const currencyOptions: CurrencySelectOption[] = [
  {
    value: 'b2384bf2-b14d-4916-aa97-85633ef05742',
    label: 'USDC',
    description: 'USDC (on Evmos)',
  },
  {
    value: 'c00b9be1-9472-44cc-b384-7f549274de3b',
    label: 'USDC',
    description: 'USDC (on HARMONY)',
  },
];

const store = createStoreWithMiddlewares();

export const Editable = Template.bind({});
Editable.decorators = [withProvider.bind(null, store), withFormik];
Editable.parameters = {
  formik: {
    initialValues: {
      AmountField: '100',
      CurrencyField: 'b2384bf2-b14d-4916-aa97-85633ef05742',
    },
  },
};
Editable.args = {
  label: 'Editable',
  amountFieldName: 'AmountField',
  currencyFieldName: 'CurrencyField',
  placeholder: '...Enter the value...',
  currencyOptions,
  hasError: false,
  onAmountChange: mockFn,
  onCurrencyChange: mockFn,
};
