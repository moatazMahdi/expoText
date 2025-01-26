import { action, observable } from 'mobx';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  phoneCheckURL,
  checkClientURL,
  calcCreditURL,
  saveErrorsURL,
  collectContactsAndLogs,
  checkReferralCode,
  checkHybridValidate,
  checkHybridStatus,
  checkHybridApply,
} from './requests';
import { InstantApprovalStatus, UpgradeLimit } from 'shared';

export class InstantApprovalStore extends BaseBackendStore {
  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }

  private _hybridApply = async (
    nationalId: string,
    payslip?: null,
    utilityBill?: null,
    hrLetter?: null,
    carLicenseFace?: string,
    carLicenseBack?: string,
    insurance?: string,
    club?: string,
  ) => {
    const data: UpgradeLimit = await this.connections.backend.httpPost(
      checkHybridApply,
      {
        nationalId: nationalId,
        payslip: payslip,
        utilityBill: utilityBill ? utilityBill : null,
        hrLetter: hrLetter,
        carLicenseFace: carLicenseFace,
        carLicenseBack: carLicenseBack,
        insurance: insurance,
        club: club,
      },
    );
    return data;
  };

  @action hybridApply(
    nationalId: string,
    payslip?: null,
    utilityBill?: null,
    hrLetter?: null,
    carLicenseFace?: string,
    carLicenseBack?: string,
    insurance?: string,
    club?: string,
  ) {
    return this._hybridApply(
      nationalId,
      payslip,
      utilityBill,
      hrLetter,
      carLicenseFace,
      carLicenseBack,
      insurance,
      club,
    );
  }
  @observable instantApprovalStatus: InstantApprovalStatus = null;

  @action async phoneCheck(nationalId: any) {
    const data = await this.connections.backend
      .httpPost(phoneCheckURL, { nationalId })
      .catch((err) => Promise.reject(err));
    return data;
  }

  @action async resetInstantApprovalStatus() {
    this.instantApprovalStatus = null;
  }

  @action async validateNationalIdExistence(
    nationalId: string,
    mobile: string,
  ) {
    const data = await this.connections.backend
      .httpPost(
        checkClientURL,
        { nationalId, mobile },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        return Promise.reject(err);
      });
    if (
      (data && data?.hasOwnProperty('mobile')) ||
      (data && data?.hasOwnProperty('signed')) ||
      (data && data?.hasOwnProperty('limit')) ||
      (data && data?.hasOwnProperty('nationalId:')) ||
      (data && data?.hasOwnProperty('IsWaiting')) ||
      (data && data?.hasOwnProperty('lowIscore')) ||
      (data && data?.hasOwnProperty('fakeNationalId')) ||
      (data && data?.hasOwnProperty('fakeLicense')) ||
      (data && data?.hasOwnProperty('rejectedFromOtherProducts'))
    ) {
      this.instantApprovalStatus = data;
    } else {
      this.instantApprovalStatus = null;
    }
    return data;
  }

  @action async validateHybrid(nationalId: string) {
    const data = await this.connections.backend
      .httpPost(
        checkHybridValidate,
        { nationalId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('validateHybrid error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async hybridStatus(nationalId: string) {
    const data = await this.connections.backend
      .httpPost(
        checkHybridStatus,
        { nationalId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('validateHybrid error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async calculateCredit(clientData: any) {
    const data = await this.connections.backend
      .httpPost(calcCreditURL, { clientData })
      .catch((err) => {
        return Promise.reject(err);
      });
    this.instantApprovalStatus = null;
    return data;
  }

  @action async saveErrors(error: any) {
    await this.connections.backend
      .httpPost(saveErrorsURL, error)
      .catch((err) => Promise.reject(err));
  }

  @action async collectContactsAndLogs(body: { contacts?: any; logs?: any }) {
    const data = await this.connections.backend
      .httpPost(collectContactsAndLogs, body, {
        remainingRetries: 1,
      })
      .catch((err) => Promise.reject(err));
  }

  @action async checkPromoCode(promoCode?: string) {
    let promoCodeResult: { status: boolean };
    try {
      promoCodeResult = await this.connections.backend.httpPost(
        checkReferralCode,
        { promoCode: promoCode },
        {
          remainingRetries: 0,
        },
      );
    } catch ({ response }) {
      promoCodeResult.status = false;
    }
    return promoCodeResult.status;
  }
}
