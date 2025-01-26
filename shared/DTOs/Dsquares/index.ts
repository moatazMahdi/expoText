import { BaseDTO } from '../types';

export class Voucher extends BaseDTO {
  $id: string;
  Description: string;
  Discount: number;
  EndDate: string;
  ExpiryDate: string;
  Id: number;
  Image: string;
  IsLaddered: boolean;
  Merchant: string;
  OfferNumber: string;
  StartDate: string;
  Terms: string;
  Title: string;
  Points: number;
  MerchantMSISDN: any;
  MerchantId: number;
  OfferType: string;
  CategoryId: number;
  CategoryName: string;
  Logo: string;
  Externalpoints: any;
  IsLocked: boolean;
  Value: number;
}

export class MerchantOffer extends BaseDTO {
  id: number;
  Image: string;
  Title: string;
  Description: string;
  merchantName: string;
  maxTenor: number;
  minTenor: number;
  expiryDate: string;
}

export class DsquaresMerchant extends BaseDTO {
  id: number;

  image: string;

  name: string;

  branches: [];

  BurnDate: string;
}

export class UserWallet extends BaseDTO {
  AvailablePoints: number;
  WalletId: number;
  TotalPoints: number;
  LifeTimePoints: number;
  TotalTransactions: number;
  ReedemPoints: number;
  RedeemValue: number;
  SegmentPoints: number;
  TierName: string;
  TierPoints: number;
  Name: string;
  Email: string;
  TotalValue: number;
  PointsToExpire: number;
  ExpiryDate: string;
  MobileNumber: string;
  RedeemFactor: number;
}
export class RedeemVoucher extends BaseDTO {
  voucherId: number;
}

export class RedeemOfferResponse extends BaseDTO {
  code: string;

  offerNumber: string;

  title: string;

  status: string;

  description: string;
}

export interface GetVoucherParams {
  type: OfferStatus;
}
export enum OfferStatus {
  DISCOUNT = 'DISCOUNT',
  CASHBACK = 'CASHBACK',
  GENERAL = 'GENERAL'
}

export enum VoucherStatus {
  Burned = 'Burned',
  Subscribed = 'Subscribed',
  Expired = 'Expired',
  Canceled = 'Cancelled'
}
