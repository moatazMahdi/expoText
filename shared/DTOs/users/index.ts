import { BaseDTO } from '../types';
import { ProductType } from 'src/stores/backend/products';

export class Credits extends BaseDTO {
  product: ProductType;

  amount: number;

  limit: number;
}

export class User extends BaseDTO {
  id: number;

  name: string;

  email: string;

  phone: string;

  avatar: string;

  nationalId: string;

  secondPhone: string;

  isEligible: boolean;

  refContact: RefContact;
}

export class RefContact extends BaseDTO {
  name: string;
  phone: string;
}

export class UpdateUserInfo extends BaseDTO {
  name: string;

  email: string;

  avatar: string;

  secondPhone?: string;

  refContact?: { name: string; phone: string };
}

export class Contract extends BaseDTO {
  loanType: ProductType;

  contractId: number;

  loanItem: string;

  totalInstallmentMonths: number;

  totalPaidMonths: number;

  remainingPercentage: number;

  nextDueDate: string;

  totalAmount: string;

  merchant: string;

  contractDate: string;

  dueDate: string;
}

export class ContractDetailsDto extends BaseDTO {
  loanStartDate: string;
  loanEndDate: string;
  remainingAmount: number;
  totalAmount: number;
  remainingPercentage: number;
  nextInstallmentAmount: number;
  nextDueDate: string;
  paymentIntegrationId: number;
  kioskIntegrationId: number;
  lastTransactions?: ContractTransactionDto[];
  paymobFlatFee: number;
  paymobCreditCardFeeRate: number;
  paymobKioskFeeRate: number;
  paymobCreditCardFees: number;
  paymobKioskFees: number;
  contractDate: string;
  earlyEligible?: string;
  latePaymentFees?: number;
}

export class ContractTransactionDto {
  amount: number;

  dueDate: string;
}

export class UserData {
  appVersion?: string;

  extraInfo?: object;

  location?: object;
}

export class FCMToken {
  firebaseNotificationToken: string;
}

export class ContactUsForm {
  fullName: string;

  mobileNumber: string;

  email: string;

  message: string;
}

export class InstantApprovalStatus {
  mobile: boolean;
  signed: boolean;
  limit: number;
  nationalId: boolean;
  isWaiting: boolean;
  lowIscore: boolean;
  fakeNationalId: boolean;
  fakeLicense: boolean;
  rejectedReason: string;
  status: string;
  clientStatus: string;
  rejectedFromOtherProducts?: boolean;
}
