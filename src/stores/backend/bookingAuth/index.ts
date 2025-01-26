import { action } from 'mobx';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  bookingHistory,
  bookingSearch,
  bookingSubmit,
  calcInstallment,
  merchantBranches,
  merchantTenors,
  recentlyViewCreate,
  recentlyViewList,
  bookingUpdate
} from './requests';

export class bookingAuthStore extends BaseBackendStore {
  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }

  @action async merchantBranchesData(merchantId: string) {
    const data = await this.connections.backend
      .httpPost(
        merchantBranches,
        { merchantId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantBranchesData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async merchantTenorsData(merchantId: string, branchId: string) {
    const data = await this.connections.backend
      .httpPost(
        merchantTenors,
        { merchantId, branchId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantTenorsData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async merchantCalcInstallment(
    merchantId: string,
    branchId: string,
    nationalId: string,
    loanAmount: string,
    offerId: string,
    tenorId: string,
  ) {
    const data = await this.connections.backend
      .httpPost(
        calcInstallment,
        { merchantId, branchId, nationalId, loanAmount, offerId, tenorId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantCalcInstallment error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async bookingSubmit(
    merchantId: string,
    branchId: string,
    nationalId: string,
    loanAmount: string,
    offerId: string,
    tenorId: string,
    installmentAmount: string,
    serviceTotalFees: string,
    productName: string,
    status: string,
  ) {
    const data = await this.connections.backend
      .httpPost(
        bookingSubmit,
        {
          merchantId,
          branchId,
          nationalId,
          loanAmount,
          installmentAmount,
          serviceTotalFees,
          productName,
          status,
          offerId,
          tenorId,
        },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('bookingSubmit error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async bookingSearch(searchQuery: string) {
    const data = await this.connections.backend
      .httpPost(
        bookingSearch,
        { searchQuery },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantBranchesData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async recentlyViewCreate(
    type: string,
    imageUrl: string,
    name: string,
    code: string,
    expiryDate:string,
    details: object,
  ) {
    const data = await this.connections.backend
      .httpPost(
        recentlyViewCreate,
        { type, imageUrl, name, code, expiryDate, details },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantBranchesData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async recentlyViewList() {
    const data = await this.connections.backend
      .httpGet(recentlyViewList,{})
      .catch((err) => {
        console.error('merchantBranchesData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async bookingHistory(nationalId: string) {
    const data = await this.connections.backend
      .httpPost(
        bookingHistory,
        { nationalId },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('merchantBranchesData error:', err);
        return Promise.reject(err);
      });
    return data;
  }

  @action async bookingUpdate(
    merchantId: string,
    branchId: string,
    nationalId: string,
    loanAmount: string,
    offerId: string,
    tenorId: string,
    installmentAmount: string,
    serviceTotalFees: string,
    productName: string,
    status: string,
    bookingId:string
  ) {
    const data = await this.connections.backend
      .httpPost(
        bookingUpdate,
        {
          merchantId,
          branchId,
          nationalId,
          loanAmount,
          offerId,
          tenorId,
          installmentAmount,
          serviceTotalFees,
          productName,
          status,
          bookingId
        },
        {
          remainingRetries: 1,
        },
      )
      .catch((err) => {
        console.error('bookingSubmit error:', err);
        return Promise.reject(err);
      });
    return data;
  }



}
