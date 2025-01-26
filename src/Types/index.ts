import { DropdownProps } from 'elephanz-rn-ui/src/components/inputs/Dropdown/types';
import { TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { ProductType } from 'src/stores/backend/products';

export interface purchaseHistoryCardItem {
  totalAmount: number;
  contractId: number;
  loanType: string;
  productId: number;
  loanItem: string;
  totalInstallmentMonths: number;
  totalPaidMonths: number;
  remainingPercentage: number;
  nextDueDate: string;
  paymentIntegrationId: number;
  nextInstallmentAmount: number;
  earlyEligible?: string;
}

export interface activeContractInterface {
  clientId: string;
  contractId: number;
  loanTypeName: string;
  loanItem: string;
  totalInstallmentMonths: number;
  totalPaidMonths: number;
  contractDate: string;
  merchant: string;
  remainingAmount: number;
  remainingPercentage: number;
  paymentIntegrationId: number;
  kioskIntegrationId: number;
  totalAmount: number;
  nextDueDate: string;
  nextInstallmentAmount: number;
  loanType: string;
  paymobFlatFee: number;
  paymobCreditCardFeeRate: number;
  paymobKioskFeeRate: number;
  paymobCreditCardFees: number;
  paymobKioskFees: number;
  walletPercent?: number;
  cPayWalletFees?: number;
  cPayWalletFeesVat?: number;
  cPayIntegrationId?: number;
  cPayFeesValue?: number;
  cPayVatValue?: number;
  latePaymentFees?: number;
  loanTypeData?: { id?: number };
  loanTypeId?: string;
}

export interface serviceItemInterface {
  id: number;
  image?: string;
  backgroundImage?: string;
  name: ProductType;
  productId?: number;
  title: string;
  description: string;
  type: 'program' | 'product';
  cname: string;
  longDescription: string;
  plans: [
    {
      id: number;
      title: { en: string; ar: string };
      benefits: [
        {
          en: string;
          ar: string;
        },
      ];
    },
  ];
  sections: [
    {
      id: number;
      order: 0;
      sectionBody: string;
      sectionName: string;
    },
  ];
  branches: [
    {
      title: string;
      address: string;
      phone: string;
      location: { latitude: number; longitude: number };
    },
  ];
}

export interface DefaultTextInputInterface extends TextInputProps {
  value: string;
  onchangeText: (text: string) => void;
  editable?: boolean;
  changed?: boolean;
  placeHolder?: string;
  title?: string;
  icon?: any;
  iconStyle?: any;
  iconWidth?: number;
  iconHeight?: number;
  onPress?: () => void;
  textOnly?: boolean;
  mt?: number;
  textInputStyle?: TextStyle;
  inputContainer?: any;
  viewStyle?: ViewStyle;
  startIcon?: any;
  startIconWidth?: number;
  startIconHeight?: number;
  svgProps?: SvgProps;
  noSeparator?:boolean
}

export interface DefaultDropDownInterface extends DropdownProps {
  title?: string;
  style?: any;
  withoutView?: boolean;
  removeBorderIfNotOpen?: boolean;
  notFullWidth?: boolean;
}

export interface notificationInterface {
  action: [
    {
      actionType: string;
      action: {
        navigationType: string;
        value: string;
        kvPair: {
          gcm_activityName: string;
          gcm_alert: string;
          moe_cid_attr: string;
          gcm_notificationType: string;
          push_from: string;
          moe_app_id: string;
          gcm_campaign_id: string;
          MOE_MSG_RECEIVED_TIME: number;
          gcm_title: string;
          moe_channel_id: string;
        };
      };
    },
  ];
  id: number;
  textContent?: any;
  campaign_id: string;
  is_clicked: boolean;
  received_time: string;
  expiry: string;
  tag: string;
  text_content: {
    title: string;
    message: string;
    summary: string;
  };
  media?: {
    mediaType: string;
    url: string;
  };
  payload: {
    gcm_activityName: string;
    moe_app_id: string;
    gcm_notificationType: string;
    moe_cid_attr: string;
    push_from: string;
    MOE_MSG_RECEIVED_TIME: number;
    gcm_alert: string;
    gcm_title: string;
    gcm_campaign_id: string;
    moe_channel_id: string;
  };
}

export interface merchantOfferInterface {
  image: string;
  title: string;
  description: string;
  maxTenor: number;
  minTenor: number;
  id: number;
  expiryDate: string;
  merchantName: string;
}

export interface merchantInterface {
  imageUrl: string;
  title: string;
  id: number;
  branches: {
    address: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    areaId: number;
  }[];
}
export interface searchInterface {
  offers: merchantOfferInterface[];
  merchants: merchantInterface[];
  services: {
    products: {}[];
    programs: {}[];
  };
}

export interface DefaultSeparatorInterface {
  width?: number | string;
  height?: number | string;
  color?: string;
  ms?: number;
  me?: number;
  mt?: number;
  mb?: number;
}

export interface bottomContainerInterface {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface cardWithCheckMarkInterface {
  checked: boolean;
  onPress: () => void;
  svgFile?: string;
  title: string;
  width?: number;
  height?: number;
  mt?: number;
  mb?: number;
  headLine?: string;
  Mandatory?: boolean;
  ImageStyle?: ViewStyle;
  rowImage?: boolean;
  textColor?: string;
}

export interface BPayModalTabsInterface {
  closeModal: () => void;
  showModal: boolean;
  contract: activeContractInterface;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  getContracts: () => void;
  screen?: string;
  amount?: string;
  isEarly?: boolean;
  earlyCardFees?: number;
  earlySettlementDetails?: {};
}

export interface InstallmentItemInfoInterface {
  loanStartDate: string;
  loanEndDate: string;
  remainingAmount: number;
  remainingPercentage: number;
  paymentIntegrationId: string;
  kioskIntegrationId: string;
  totalAmount: number;
  nextDueDate: string;
  lastTransactions: {
    amount: number;
    dueDate: string;
  }[];
  nextInstallmentAmount: number;
  loanType: string;
  paymobFlatFee: number;
  paymobCreditCardFeeRate: number;
  paymobKioskFeeRate: number;
  paymobCreditCardFees: number;
  paymobKioskFees: number;
  loanItem: string;
  totalInstallmentMonths: number;
  contractId?: string;
  latePaymentFees?: number;
}

export interface MapModalInterface {
  confirmLocation?: (coords, locationName) => void;
  closeModal?: () => void;
  modalVisible: boolean;
}

export interface InstantApprovalCardInterface {
  welcome?: boolean;
  mt?: number;
  renderLoansList?: React.FC;
  renderContractsCTA?: React.FC;
  noContracts?: boolean;
  withBackView?: boolean;
}

export interface Question {
  id: string;
  description: { en: string; ar: string };
  choices: {
    id: string;
    isCorrect: boolean;
    description: { en: string; ar: string };
  }[];
}

export interface UserProgress {
  answeredCount: number;
  currentStreak: number;
}

export interface SubmitResult {
  shouldUserRewarded: boolean;
  isUserChoiceCorrect: boolean;
  voucher: { merchantName: string; code: string; value: string };
}

export interface City {
  name: string;
  id: string;
}
export interface Area {
  name: string;
  id: string;
}

export interface RequestForm {
  branch: string;
  name: string;
  mobilePhone: string;
  email: string;
}

export interface formError {
  errorCondition: boolean;
  error: string;
  textStyle?: TextStyle;
}
export interface formInputData extends DefaultTextInputInterface, formError {
  viewStyle?: ViewStyle;
}

export interface formDropdownData extends DefaultDropDownInterface, formError {
  viewStyle: ViewStyle;
  defaultStyle?: boolean;
}

export interface calculatorData {
  duration: number;
  amount: number;
  installmentValue: number;
  downPayment: number;
  plan: {
    packageId: number;
    title: string;
    description: string;
    minTenor: number;
    maxTenor: number;
    downPayment: number;
    allowDownPayment: number;
  };
}

export interface FatortyDisclaimerInterface {
  title: string;
  buttonTitle?: string;
  onPress: () => void;
  svgIcon: any;
  svgColor?: string;
  backColor?: string;
  style?: ViewStyle;
}

export interface GetStartedButtonInterface {
  onPress: () => void;
  textStyle?: TextStyle;
  title?: string;
  ms?: number;
  mb?: number;
  svgFile?: any;
  loading?: boolean;
}

export interface BalanceInterface {
  amount: number;
  limit: number;
}

export interface AppliedCardInterface {
  setAlertVisible?: (alertVisible: boolean) => void;
  isVisible: boolean;
  fromScreen: string;
}

export interface LoanCalculatorProps {
  productId: string;
  product: {};
}

export interface NIDConfirmModelProps {
  isOpen: boolean;
  nationalId: string;
  ocr_NID: string;
  onCancel: () => void;
  onConfirm?: () => void;
}

export interface FloatingActionButtonInterface {
  bot?: number;
  pos?: 'left' | 'right';
}

export enum DigitalFatortyOptionTypes {
  BANK = 'BANK',
  WALLET = 'WALLET',
}
export interface BankForm {
  bankName: string;
  accountHolder: string;
  bankIban: string;
}

export enum WalletTypeOptions {
  TELECOM_WALLET = 'TELECOM_WALLET',
  BANK_WALLET = 'BANK_WALLET',
}

export interface WalletForm {
  nID: string;
  mobileNumber: string;
  walletType?: WalletTypeOptions;
  type?: DigitalFatortyOptionTypes;
}
