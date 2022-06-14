import { GetUserCardsResponse } from '../../redux/cardsApi';

export const serverQuoteRequestMock = {
  id: 'uuid534-23423423-234234-4343',
  source_currency: 'USD',
  target_currency: 'USDC_EVMOS',
  source_amount: '100',
  target_amount: '110',
  fiat_blockchain_fee: '30',
  absolute_internal_fee: '40',
  internal_fee_percent: '0',
  total_fee: '70',
  expires_at: new Date(new Date().getTime() + 3 * 60000).toISOString(),
};

export const serverGetUserCardsMock: GetUserCardsResponse = {
  customer_cards: [
    {
      card_id: 'id1',
      expiry_year: '2034',
      expiry_month: '09',
      last4: '4242',
      type: 'VISA',
    },
    {
      card_id: 'id2',
      expiry_year: '2045',
      expiry_month: '10',
      last4: '4444',
      type: 'MasterCard',
    },
    {
      card_id: 'id3',
      expiry_year: '2065',
      expiry_month: '04',
      last4: '5452',
      type: 'MasterCard',
    },
  ],
};
