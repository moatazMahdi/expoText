import {
  NewOnboardingScreen, // Was OnboardingScreen
  // SplashScreen,
  NewLoginScreen, //Was LoginScreen
  NewSignUp, // RegistrationScreen
  PaymobScreen,
  CaptureCards,
  Camera,
  SelfieCamera, // New Screen
  PersonalData, // Was PersonalData in 'screens/InstantApproval/clientInfo/personalData' but modified for revamp into 'creditech/InstantApproval/PersonalData'
  Verification,
  NewHomeScreen,
  LoyalPointsScreen,
  ManageCreditScreen,
  PurchaseHistoryScreen,
  TransactionHistory,
  InstallmentItemInfo,
  Welcome, // New Screen
  ScanNID, // New Screen
  Selfie, // New Screen
  ClientDependencies, // New Screen
  RefContactInfo, // New Screen
  RedeemPoints,
  PointsHistory,
  LatestOffers,
  OurServices,
  ShopFromMerchants,
  ServiceScreen,
  Branches,
  PlansSelection,
  PlansCompare,
  InstallmentCalculator,
  ReviewApplication,
  EmploymentStatus, // New Screen
  CompanyDetails, // New Screen
  JobInfo, // New Screen
  AdditionalDocs, // New Screen
  Congratulations, // New Screen
  Search, // New Screen
  ResidentialStatus, // New Screen
  AccelerationDocs, // New Screen
  ApprovalMessageScreen, // New Screen
  DigitalFatorty,
  DigitalFatortyDataEntry,
  DigitalFatortyApprovalMessage,
  Fatorty,
  FatortyDataEntry,
  FatortyApprovalMessage,
  Settings,
  TermsAndConditions,
  CustomerSupport,
  SendMessage,
  SendMessageDone,
  RequestMoreInfoScreen,
  UserData,
  MerchantDetails,
  OfferDetails,
  SubCategoryService,
  ReferralScreen,
  ContinueLaterScreen,
  CreatePassword,
  PointsRedeem,
  BiometricDevicesList,
  NoCreditApproval,
  PermissionsDisclaimer,
  CreditActivationEnquiry,
  NotificationsCenter,
  BillPayment,
  MerchantsSearch,
  CreditUpgrade,
  ManageMyInstallments,
  ManageMyBills,
  PayToOthers,
  ArticleDetails,
  SupplementaryRequestForm,
  QuickPay,
  Calculator,
  OfferCalculator,
  Tracking,
  ForceUpdateScreen,
  SuccessfulPayWithWallet,
  AccessDenied,
  Personas,
  AfconQuestions,
  AfconOnBoarding,
  TransactionsScreen,
  MerchantsOnlineDetails,
  CreditOptionalData,
  ScanCarLicense,
  DigitalFatortyBankTransfer,
  DigitalFatortyOptions,
  FatortyErrorMessage,
  BookingAuthentication,
  OrderSummary,
  BookingAuthenticationOfferCalculate,
  BookingAuth,
  BlueNovember,
  BlueNovemberViewAll,
  CheckUpdate,
  AppOnboarding
} from 'screens';

export const ROUTES = {
  // splash: SplashScreen,
  AppOnboarding:AppOnboarding,
  onboarding: NewOnboardingScreen, // was OnboardingScreen
  login: NewLoginScreen,
  signUp: NewSignUp, // was registration: RegistrationScreen
  verification: Verification, // New Screen
  home: NewHomeScreen,
  loyalPoints: LoyalPointsScreen,
  manageCredit: ManageCreditScreen,
  purchaseHistory: PurchaseHistoryScreen,
  transactionHistory: TransactionHistory,
  installmentItemInfo: InstallmentItemInfo,
  redeemPoints: RedeemPoints,
  welcome: Welcome, // New Screen
  scanNID: ScanNID, // New Screen
  selfie: Selfie, // New Screen
  clientDependencies: ClientDependencies, // New Screen
  refContactInfo: RefContactInfo, // New Screen
  pointsHistory: PointsHistory,
  latestOffers: LatestOffers,
  ourServices: OurServices,
  shopFromMerchants: ShopFromMerchants,
  serviceScreen: ServiceScreen,
  branches: Branches,
  plansCompare: PlansCompare,
  plansSelection: PlansSelection,
  installmentCalculator: InstallmentCalculator,
  reviewApplication: ReviewApplication,
  employmentStatus: EmploymentStatus, // New Screen
  companyDetails: CompanyDetails, // New Screen
  jobInfo: JobInfo, // New Screen
  additionalDocs: AdditionalDocs, // New Screen
  congratulations: Congratulations, // New Screen
  selfieCamera: SelfieCamera, // New Screen
  search: Search,
  residentialStatus: ResidentialStatus, // New Screen
  accelerationDocs: AccelerationDocs, // New Screen
  approvalMessageScreen: ApprovalMessageScreen,
  digitalFatorty: DigitalFatorty,
  fatorty: Fatorty,
  fatortyDataEntry: FatortyDataEntry,
  fatortyApprovalMessage: FatortyApprovalMessage,
  digitalFatortyDataEntry: DigitalFatortyDataEntry,
  digitalFatortyApprovalMessage: DigitalFatortyApprovalMessage,
  settings: Settings,
  termsAndConditions: TermsAndConditions,
  customerSupport: CustomerSupport,
  sendMessage: SendMessage,
  sendMessageDone: SendMessageDone,
  requestMoreInfoScreen: RequestMoreInfoScreen,
  userData: UserData,
  merchantDetails: MerchantDetails,
  offerDetails: OfferDetails,
  subCategoryService: SubCategoryService,
  referralScreen: ReferralScreen, // New Screen
  continueLaterScreen: ContinueLaterScreen, // New Screen
  createPassword: CreatePassword, // New Screen
  pointsRedeem: PointsRedeem,
  biometricDevicesList: BiometricDevicesList,
  noCreditApproval: NoCreditApproval, // New Screen
  permissionsDisclaimer: PermissionsDisclaimer, // New Screen
  quickPay: QuickPay,
  creditActivationEnquiry: CreditActivationEnquiry, // New Screen
  notificationsCenter: NotificationsCenter,
  billPayment: BillPayment,
  merchantsSearch: MerchantsSearch,
  creditUpgrade: CreditUpgrade,
  manageMyInstallments: ManageMyInstallments,
  manageMyBills: ManageMyBills,
  payToOthers: PayToOthers,
  articleDetails: ArticleDetails,
  supplementaryRequestForm: SupplementaryRequestForm,
  paymobScreen: PaymobScreen,
  captureCards: CaptureCards,
  camera: Camera,
  personalData: PersonalData,
  calculator: Calculator,
  offerCalculator: OfferCalculator,
  tracking: Tracking,
  forceUpdate: ForceUpdateScreen,
  successfulPayWithWallet: SuccessfulPayWithWallet,
  accessDenied: AccessDenied,
  personas: Personas,
  afconQuestions: AfconQuestions,
  afconOnboarding: AfconOnBoarding,
  transactionsScreen: TransactionsScreen,
  merchantsOnlineDetails: MerchantsOnlineDetails,
  creditOptionalData: CreditOptionalData,
  ScanCarLicense: ScanCarLicense,
  digitalFatortyOptions: DigitalFatortyOptions,
  digitalFatortyBankTransfer: DigitalFatortyBankTransfer,
  fatortyErrorMessage: FatortyErrorMessage,
  bookingAuthentication:BookingAuthentication,
  orderSummary:OrderSummary,
  bookingAuthenticationOfferCalculate:BookingAuthenticationOfferCalculate,
  bookingAuth:BookingAuth,
  blueNovember: BlueNovember,
  blueNovemberViewAll:BlueNovemberViewAll,
  checkUpdate:CheckUpdate
};
