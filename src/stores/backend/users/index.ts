import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { createModelSchema, object, primitive } from 'serializr';
import {
  ActivateUserResponse,
  ActivateVerifyPhoneResponse,
  UpgradeLimit,
} from 'shared';
import {
  Credits,
  User,
  Contract,
  ContractDetailsDto,
  FCMToken,
  UserData,
  ContactUsForm,
  UpdateUserInfo,
  RefContact,
} from 'shared/DTOs/users';

import {
  activeContractInterface,
  notificationInterface,
  DigitalFatortyOptionTypes,
  WalletTypeOptions,
} from 'src/Types';

import { ListBackendEntity } from 'utils';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  getUserCreditsById,
  getUserById,
  updateFCMToken,
  updateUserData,
  verifyUserNationalId,
  getUserContractsById,
  getContractDetailsById,
  sendContactUs,
  updateUserInfo,
  deleteUserNationalId,
  checkOtherClient,
  testMessage,
  ActivateVerifyPhone,
  ActivateUser,
  getUserActiveContracts,
  SendUserNotifications,
  GetUserNotifications,
  IncreaseLimit,
  GetUserNotificationsBadgeCount,
  MarkAllNotificationsRead,
  getRequestTracking,
  checkUserLanguage,
  earlyPayment,
  cashbackHistory,
  redeemCashbackVoucher,
  getCashbackMerchants,
  digitalFatortyTransfer,
} from './requests';

createModelSchema(RefContact, {
  name: primitive(),
  phone: primitive(),
});

createModelSchema(User, {
  id: primitive(),
  name: primitive(),
  email: primitive(),
  phone: primitive(),
  avatar: primitive(),
  nationalId: primitive(),
  secondPhone: primitive(),
  isEligible: primitive(),
  refContact: object(RefContact),
});

export class UserStore extends BaseBackendStore {
  private getUserCreditsById = async (options: {
    userId: string;
  }): Promise<Credits[]> => {
    const data = await this.connections.backend.httpGet(
      getUserCreditsById(options.userId),
    );
    return data;
  };

  private getUserContractsById = async (options: {
    userId: string;
  }): Promise<Contract[]> => {
    const data = await this.connections.backend.httpGet(
      getUserContractsById(options.userId),
      {
        remainingRetries: 1,
      },
    );
    return data;
  };

  private getUserActiveContracts = async (options: {
    nationalId: string;
  }): Promise<activeContractInterface[]> => {
    const data = await this.connections.backend.httpPost(
      getUserActiveContracts(),
      {
        nationalId: options.nationalId,
      },
      {
        remainingRetries: 1,
      },
    );
    return data;
  };

  private getUserNotifications = async () => {
    const data = await this.connections.backend.httpGet(GetUserNotifications);
    return data;
  };

  @persist @observable role: 'ADMIN' | 'USER' | 'GUEST' | 'NONE' = 'NONE';

  @persist @observable isRegistered: boolean = false;

  @observable currentContract: ContractDetailsDto;

  @observable currentContractId: number;

  @observable private _userCredits: Credits[] = [];

  @observable private _userContracts: Contract[] = [];

  @observable private _userActiveContracts: Contract[] = [];

  @observable private _userNotifications: Contract[] = [];

  @observable loginModalView: boolean = false;

  @observable sessionExpiredModalView: boolean = false;

  @persist @observable dynamicLinkUrl: string = '';

  @persist('object', User) @observable userData: User = {} as User;

  @observable userCredits = new ListBackendEntity(
    this,
    '_userCredits',
    this.getUserCreditsById,
  );

  @observable userContracts = new ListBackendEntity(
    this,
    '_userContracts',
    this.getUserContractsById,
  );

  @observable userActiveContracts = new ListBackendEntity(
    this,
    '_userActiveContracts',
    this.getUserActiveContracts,
  );

  @observable userNotifications = new ListBackendEntity(
    this,
    '_userNotifications',
    this.getUserNotifications,
  );

  @observable userNotificationsBadgesCount: number = 0;

  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
  }

  @action getUserNotificationsBadgesCount = async () => {
    try {
      const data = await this.connections.backend.httpGet(
        GetUserNotificationsBadgeCount,
      );
      this.userNotificationsBadgesCount = data?.count;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  @action controlLoginModalView = (value: any, continueAction?: () => void) => {
    if (this.userRole == 'GUEST') {
      this.loginModalView = value;
    } else {
      continueAction && continueAction();
    }
  };

  @action controlSessionExpiredModalView = (value: boolean) => {
    this.sessionExpiredModalView = value;
  };

  @action setDynamicLink = (value: string) => {
    this.dynamicLinkUrl = value;
  };

  @action async getUserById(userId: number) {
    const response = await this.connections.backend.httpGet(
      getUserById(userId),
    );
    this.userData = response;
  }

  @action async markAllNotificationsRead() {
    try {
      const data = await this.connections.backend.httpPatch(
        MarkAllNotificationsRead,
        {},
      );
      this.userNotificationsBadgesCount = data?.count;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async updateFCMToken(userId: number, fcmToken: FCMToken) {
    this.connections.backend.httpPut(updateFCMToken(userId), fcmToken);
  }

  @action async updateUserData(userId: number, userData: UserData) {
    this.connections.backend.httpPost(updateUserData(userId), userData);
  }

  @action activateVerifyPhoneNumber(
    phone: string,
    nationalId: string,
    gateway?: string,
  ) {
    return this._activateVerifyPhone(phone, nationalId, gateway);
  }

  @action activateUser(nationalId: string, dataEncoded: string, OTP: string) {
    return this._activateUser(nationalId, dataEncoded, OTP);
  }

  @action increaseLimit(
    mobile: string,
    payslip?: string,
    utilityBill?: string,
    hrLetter?: string,
    carLicenseFace?: string,
    carLicenseBack?: string,
    insurance?: string,
    club?: string,
  ) {
    return this._increaseLimit(
      mobile,
      payslip,
      utilityBill,
      hrLetter,
      carLicenseFace,
      carLicenseBack,
      insurance,
      club,
    );
  }

  @action sendUserNotifications(notifications: {}[]) {
    return this._sendUserNotifications(notifications);
  }

  private _activateVerifyPhone = async (
    phone: string,
    nationalId: string,
    gateway?: string,
  ) => {
    const data: ActivateVerifyPhoneResponse =
      await this.connections.backend.httpPost(ActivateVerifyPhone(), {
        mobileNumber: `+2${phone}`,
        nationalId: nationalId,
        gateway: gateway ?? '1',
      });
    return data.data;
  };

  private _sendUserNotifications = async (notifications: {}[]) => {
    const data: notificationInterface = await this.connections.backend.httpPost(
      SendUserNotifications(),
      [...notifications],
    );
    return data;
  };

  private _activateUser = async (
    nationalId: string,
    dataEncoded: string,
    OTP: string,
  ) => {
    const data: ActivateUserResponse = await this.connections.backend.httpPost(
      ActivateUser(),
      {
        nationalId: nationalId,
        dataEncoded: dataEncoded,
        OTP: OTP,
      },
    );
    return data;
  };

  private _increaseLimit = async (
    mobile: string,
    payslip?: string,
    utilityBill?: string,
    hrLetter?: string,
    carLicenseFace?: string,
    carLicenseBack?: string,
    insurance?: string,
    club?: string,
  ) => {
    const data: UpgradeLimit = await this.connections.backend.httpPost(
      IncreaseLimit(),
      {
        mobile: mobile,
        payslip: payslip,
        utilityBill: utilityBill,
        hrLetter: hrLetter,
        carLicenseFace: carLicenseFace,
        carLicenseBack: carLicenseBack,
        insurance: insurance,
        club: club,
      },
    );
    return data;
  };

  @action async submitNationalId(
    userId: number,
    nationalId: string,
    code: string,
  ) {
    try {
      await this.connections.backend.httpPut(verifyUserNationalId(userId), {
        nationalId,
        code,
      });
      this.userData.nationalId = nationalId;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async updateUser(userData: Partial<UpdateUserInfo>) {
    try {
      const oldData: UpdateUserInfo = {
        name: this.userData.name,
        email: this.userData.email,
        avatar: this.userData.avatar,
      };
      await this.connections.backend.httpPut(updateUserInfo(this.userData.id), {
        ...oldData,
        ...userData,
      });
      this.getUserById(this.userData.id);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action setCurrentContract(value: number) {
    this.currentContractId = value;
  }

  @action async getContractDetailsById() {
    try {
      const response = await this.connections.backend.httpGet(
        getContractDetailsById(this.currentContractId),
        {
          params: {
            numberOfTransactions: -1,
          },
        },
      );
      this.currentContract = response;
    } catch (error) {
      Promise.reject(error);
    }
  }

  @action setRole(role: 'ADMIN' | 'USER' | 'GUEST' | 'NONE') {
    this.role = role;
  }

  @action setRegistered(value: boolean) {
    this.isRegistered = value;
  }

  @action async sendContactUsForm(contactUsFrom: ContactUsForm): Promise<void> {
    try {
      await this.connections.backend.httpPost(sendContactUs(), contactUsFrom);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async deleteUserNationalId(userId: number): Promise<void> {
    try {
      await this.connections.backend.httpDelete(deleteUserNationalId(userId));
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async checkNationalIDOtherPayment(id: number, nationalId: string) {
    try {
      const data = await this.connections.backend.httpPost(
        checkOtherClient(id),
        { nationalId },
      );
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @action async testSendingMessageService(
    clientsNumbers: string[],
    body?: string,
  ) {
    try {
      const data = await this.connections.backend.httpPost(testMessage, {
        clientsNumbers,
        body,
      });
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @action async getRequestTracking(options: {
    nationalId: string;
    phone: string;
  }) {
    const data = await this.connections.backend.httpPost(
      getRequestTracking(),
      {
        nationalId: options.nationalId,
        phone: options.phone,
      },
      {
        remainingRetries: 0,
      },
    );
    return data;
  }

  @action async checkUserLanguage() {
    try {
      const data = await this.connections.backend.httpPost(
        checkUserLanguage,
        {},
      );
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private getCashbackMerchants = async () => {
    try {
      const data = await this.connections.backend.httpGet(getCashbackMerchants);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  @observable cashbackMerchants = new ListBackendEntity(
    this,
    '_cashbackMerchants',
    this.getCashbackMerchants,
  );

  private getCashbackHistory = async () => {
    try {
      const data = await this.connections.backend.httpPost(cashbackHistory, {
        nationalId: this.parent.users.userData.nationalId,
      });
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  @observable cashbackHistory = new ListBackendEntity(
    this,
    '_cashbackHistory',
    this.getCashbackHistory,
  );

  @action redeemCashbackVoucher = async (
    merchantId,
    merchantNameAR,
    merchantNameEN,
    amount,
    voucherType,
  ) => {
    try {
      const data = await this.connections.backend.httpPost(
        redeemCashbackVoucher,
        {
          merchantId,
          merchantName: { ar: merchantNameAR, en: merchantNameEN },
          amount,
          voucherType,
          nationalId: this.parent.users.userData.nationalId,
        },
        {
          remainingRetries: 0,
        },
      );
      // this.getCashbackHistory();
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  @observable requestTracking = new ListBackendEntity(
    this,
    '_requestsTrackingList',
    this.getRequestTracking,
  );

  @action async calculateEarlyPayment(contractId: string) {
    try {
      const data = await this.connections.backend.httpPost(
        earlyPayment,
        {
          contractId,
        },
        {
          remainingRetries: 1,
        },
      );
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @action async transferDigitalFatorty(options: {
    nationalId: string;
    mobile: string;
    name: string;
    email?: string;
    swiftCode?: string; //fixed in wallet
    accountNumber?: string; //bank -> account number, wallet: mobile number
    fatortyAmount: string; //from fatorty screen
    type: DigitalFatortyOptionTypes;
    invoiceNo: string;
    invoiceUrl: string;
    bankCode?: string; //required if the type is bank
    WalletType?: WalletTypeOptions; //required if the type is wallet
    invoiceOcrId: number;
  }) {
    try {
      await this.connections.backend.httpPost(
        digitalFatortyTransfer,
        {
          ...options,
          swiftCode: options.swiftCode ?? 'MDIGEGCXXXX',
        },
        { remainingRetries: 0 },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @computed
  get userRole() {
    if (
      !this.parent.auth ||
      !this.parent.auth.getAccessToken() ||
      !this.userData ||
      !this.userData.id
    ) {
      return 'GUEST';
    }
    if (!this.userData.nationalId) {
      return 'USER';
    }
    return 'CLIENT';
  }
}
