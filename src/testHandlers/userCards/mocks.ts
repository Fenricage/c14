import { GetUserCardsResponse } from '../../redux/cardsApi';

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
