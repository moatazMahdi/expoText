export const getVouchers = '/wallets/vouchers';
export const getMerchants = '/wallets/merchants';
export const getMerchantById = (id: string) => `/products/merchants/${id}`;
export const getUserVouchers = (id: number) => `/wallets/${id}/vouchers`;
export const addVoucher = (id: number) => `/wallets/${id}/vouchers`;
export const getMerchantOffer = () => `/products/offers`;
export const getUserWallet = (id: string) => `/wallets/${id}`;
export const getUserTransactions = (id: number) =>
  `/wallets/${id}/transactions`;
export const createVoucherTransaction = '/transactions/voucher-transaction';
