export const serverQuoteRequestMock = {
  id: 'uuid534-23423423-234234-4343',
  source_currency: 'USD',
  target_crypto_asset_id: 'b2384bf2-b14d-4916-aa97-85633ef05742',
  source_amount: '100',
  target_amount: '110',
  fiat_blockchain_fee: '30',
  absolute_internal_fee: '40',
  internal_fee_percent: '0',
  total_fee: '70',
  expires_at: new Date(new Date().getTime() + 3 * 60000).toISOString(),
};
