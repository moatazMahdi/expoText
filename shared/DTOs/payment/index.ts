import { BaseDTO } from '../types';
import { User } from '../users';

export enum OrderType {
  INSTALLMENTS = 'INSTALLMENTS',
  WALLET = 'WALLET',
}

export enum PayMethod {
  PAYMOB = 'PAYMOB',
  KIOSK = 'KIOSK',
  VOUCHER = 'VOUCHER',
  WALLET = 'WALLET',
}

export enum KioskAggregator {
  FAWRY = 'FAWRY',
  AMAN = 'AMAN',
  MASARY = 'MASARY',
  AGGREGATOR = 'AGGREGATOR',
}

export enum paymobType {
  E = 'E',
  I = 'I',
}

export enum NewPayMethod {
  CREDIT_CARD = 'CreditCard',
  VOUCHER = 'Voucher',
  E_WALLET = 'E-Wallet',
}
export enum ProviderType {
  NOON = 'Noon',
  PAYMOB = 'Paymob',
  DSQUARES = 'DSquares',
  UPG = 'UPG-Wallet',
}

export class PaymentOptions extends BaseDTO {
  paymentMethod: NewPayMethod;
  provider: ProviderType;
  contractId: string;
  earlySettlement: boolean;
  voucher?: string;
  contractInfo:
    | {
        loanStartDate: string;
        loanEndDate: string;
        remainingAmount: number;
        remainingPercentage: number;
        paymentIntegrationId: string;
        kioskIntegrationId: string;
        totalAmount: number;
        nextDueDate: string;
        lastTransactions: [
          {
            amount: number;
            dueDate: string;
            paidVia: string;
          },
          {
            amount: number;
            dueDate: string;
            paidVia: string;
          },
        ];
        nextInstallmentAmount: number;
        loanType: string;
        paymobFlatFee: number;
        paymobCreditCardFeeRate: number;
        paymobKioskFeeRate: number;
        paymobCreditCardFees: number;
        paymobKioskFees: number;
        contractDate: string;
        earlyEligible: boolean;
        latePaymentFees: number;
        loanTypeData: {
          id: number;
          nameAr: string;
          nameEn: string;
        };
      }
    | {};
  earlySettlementDetails: {
    remainPrincipal?: number;
    overdue?: number;
    dueAmount?: number;
    earlyFees?: number;
    replyMessage?: string;
    ccFeesPrecent?: number;
  };
}

export class CreateOrderDto extends BaseDTO {
  userId: number;

  orderType: OrderType;

  orderParameters: Record<string, string>;
}

export class Order extends BaseDTO {
  id: number;

  orderType: OrderType;

  contractId: number;
}

export class CreateTransactionDto extends BaseDTO {
  userId: number;

  orderId: number;

  amount: number;

  paymentMethod: PayMethod;
}

export class TransactionDto extends BaseDTO {
  id: number;
  paymentMethod?: PayMethod;
  status?: string;
  amount?: number;
  user?: User;
  order?: Order;
  walletReference?: string;
  paymentReference?: number;
  message?: string;
  ReceiverScheme?: string;
}

export class PaymobIframeUrlParams extends BaseDTO {
  name: string;

  phone: string;

  email: string;

  transactionId?: number;

  integrationId?: number;

  nationalId?: string;
}

export class PaymobIframeUrlResponse extends BaseDTO {
  iframeURL: string;
}

export class PaymobKioskRefNumberParams extends PaymobIframeUrlParams {
  aggregator: KioskAggregator;
}

export class PaymobKioskRefNmberResponse extends BaseDTO {
  refNumber: number;
}

export class PaymentMethod {
  method: PayMethod;

  fees: number;

  label: string;
}

export class MyTransaction {
  amount: number;

  date: string;
}
