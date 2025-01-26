import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import {
  Order,
  PaymentMethod,
  PayMethod,
  PaymentOptions,
  PaymobIframeUrlParams,
  PaymobKioskRefNumberParams,
  TransactionDto,
} from 'shared/DTOs/payment';
import { LoadingState } from 'utils';
import { BaseBackendStore } from '../types';
import { BackendStores } from '..';
import {
  createOrder,
  createTransaction,
  getPaymobIFrameURL,
  getPaymobKioskRefNumber,
  payment,
  paymentStatus,
  requestDoorPayment,
  requestToPay,
} from './requests';
import { Settings } from 'settings';

export class PaymentStore extends BaseBackendStore {
  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }

  @persist @observable paymentOptions: PaymentOptions;

  @observable transaction: TransactionDto;

  @observable order: Order;

  @observable transactionDetails: Order;

  @observable paymobIframeUrl: string | null;

  @observable paymobKioskRefNumber: number | null;

  @observable paymobRequestStatus: LoadingState = LoadingState.IDLE;

  @observable paymentMethods: PaymentMethod[] = [];

  @action setPaymentOptions(paymentOptions: PaymentOptions) {
    this.paymentOptions = paymentOptions;
  }

  @action setPaymentMethods(paymentMethods: PaymentMethod[]) {
    this.paymentMethods = paymentMethods;
  }

  @action async createOrder(nationalId?: string) {
    const response = await this.connections.backend.httpPost(createOrder, {
      userId: this.paymentOptions.userId,
      orderType: this.paymentOptions.orderType,
      orderParameters: this.paymentOptions.orderParameters,
      nationalId,
    });

    this.order = response;
  }

  @action async _requestDoorPayment() {
    const response = await this.connections.backend.httpGet(
      requestDoorPayment,
      {},
    );
    return response;
  }

  @action async createTransaction(voucherNumber?: string) {
    const response = await this.connections.backend.httpPost(
      createTransaction,
      {
        userId: this.paymentOptions.userId,
        orderId: this.order.id,
        amount: this.paymentOptions.amount,
        feesRate: this.paymentOptions.feesRate,
        feesFlat: this.paymentOptions.feesFlat,
        feesCollected: this.paymentOptions.feesCollected,
        voucherNumber,
        paymentMethod: this.paymentOptions.payMethod,
        contactPayFees: this.paymentOptions.cPayFeesValue,
        contactPayVat: this.paymentOptions.cPayVatValue,
        contactPayIntegrationId: this.paymentOptions.cPayIntegrationId,
      },
      {
        remainingRetries: 0,
      },
    );

    this.transaction = response;
  }

  @action async createPayments(paymentDetails: PaymentOptions) {
    const response = await this.connections.backend.httpPost(
      payment,
      paymentDetails,
    );
    return response;
  }

  @action async requestToPay(phone?: string) {
    const response = await this.connections.backend.httpPost(requestToPay, {
      phone: phone,
      // phone: '103868282',
      transactionId: this.transaction?.id,
    });
    return response;
  }

  @action async getPaymobIframeUrl(
    paymobIframeUrlParams: PaymobIframeUrlParams,
  ) {
    try {
      this.paymobRequestStatus = LoadingState.LOADING;
      const response = await this.connections.backend.httpGet(
        getPaymobIFrameURL,
        {
          params: {
            name: paymobIframeUrlParams.name,
            phone: paymobIframeUrlParams.phone,
            email: paymobIframeUrlParams.email,
            integrationId:
              Settings.config.ENV === 'development'
                ? '4310305'
                : this.paymentOptions.integrationId,
            transactionId: this.transaction.id,
            installmentType: this.paymentOptions.installmentType,
          },
        },
      );

      this.paymobIframeUrl = response.iframeURL;
      this.paymobRequestStatus = LoadingState.SUCCEEDED;
    } catch (error) {
      this.paymobRequestStatus = LoadingState.FAILED;
    }
  }

  @action async getKioskRefNumber(
    paymobKioskPaymentParams: PaymobKioskRefNumberParams,
  ) {
    try {
      this.paymobRequestStatus = LoadingState.LOADING;
      const response = await this.connections.backend.httpGet(
        getPaymobKioskRefNumber,
        {
          params: {
            name: paymobKioskPaymentParams.name,
            phone: paymobKioskPaymentParams.phone,
            email: paymobKioskPaymentParams.email,
            integrationId: this.paymentOptions.integrationId,
            transactionId: this.transaction.id,
            aggregator: paymobKioskPaymentParams.aggregator,
          },
        },
      );

      this.paymobKioskRefNumber = response.refNumber;
      this.paymobRequestStatus = LoadingState.SUCCEEDED;
    } catch (error) {
      this.paymobRequestStatus = LoadingState.FAILED;
    }
  }

  @action clearStore() {
    this.paymobRequestStatus = LoadingState.IDLE;
    this.paymobIframeUrl = null;
    this.paymobKioskRefNumber = null;
  }

  @action async getPaymentStatus(orderId: string) {
    const response = await this.connections.backend.httpPost(paymentStatus, {
      orderId,
    });
    return response;
  }
}
