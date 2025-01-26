import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import { createModelSchema, primitive } from 'serializr';
import {
  Voucher,
  DsquaresMerchant,
  UserWallet,
  RedeemOfferResponse,
  GetVoucherParams,
  VoucherStatus,
  MyTransaction,
  OfferStatus,
  MerchantOffer,
} from 'shared';
import { BackendEntity, ListBackendEntity, LoadingState } from 'utils';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  getVouchers,
  addVoucher,
  getMerchants,
  getUserTransactions,
  getUserVouchers,
  getUserWallet,
  createVoucherTransaction,
  getMerchantOffer,
  getMerchantById,
} from './requests';

createModelSchema(Voucher, {
  id: primitive(),
  Amount: primitive(),
  BurnDate: primitive(),
  ExpiryDate: primitive(),
  VoucherNumber: primitive(),
  Status: primitive(),
  OfferName: primitive(),
  BranchName: primitive(),
  Discount: primitive(),
  SubscriptionDate: primitive(),
  RemainingUsage: primitive(),
  LastModifiedAction: primitive(),
  OfferTitle: primitive(),
  OfferNumber: primitive(),
  OfferDescription: primitive(),
  MerchantImage: primitive(),
  MerchantCategory: primitive(),
  Actor: primitive(),
  OfferImage: primitive(),
});
createModelSchema(UserWallet, {
  Name: primitive(),
  WalletId: primitive(),
  Email: primitive(),
  ExpiryDate: primitive(),
  TotalPoints: primitive(),
  AvailablePoints: primitive(),
  LifeTimePoints: primitive(),
  TotalTransactions: primitive(),
  ReedemPoints: primitive(),
  RedeemValue: primitive(),
  SegmentPoints: primitive(),
  TierName: primitive(),
  TierPoints: primitive(),
  TotalValue: primitive(),
  PointsToExpire: primitive(),
  MobileNumber: primitive(),
  RedeemFactor: primitive(),
});
createModelSchema(MyTransaction, {
  amount: primitive(),
  date: primitive(),
});

createModelSchema(MerchantOffer, {
  id: primitive(),
  title: primitive(),
  description: primitive(),
  maxTenor: primitive(),
  minTenor: primitive(),
  expiryDate: primitive(),
});

export class WalletStore extends BaseBackendStore {
  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
  }
  getVouchersData() {
    return this.vouchers.data.slice();
  }
  private getVouchers = async (
    options: GetVoucherParams,
  ): Promise<Voucher[]> => {
    const params = {
      ...options,
    };
    const data = await this.connections.backend.httpGet(getVouchers, {
      params,
    });
    return data;
  };

  private getGeneralOffers = async (): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(getVouchers, {
      params: {
        type: OfferStatus.GENERAL,
      },
    });
    return data;
  };

  @observable loadingVoucher = LoadingState.IDLE;

  @observable selectedVoucherDetails: Voucher;

  @action getVoucherById = async (voucherId: string, voucherType: string) => {
    try {
      this.loadingVoucher = LoadingState.LOADING;
      let targetVoucher;
      if (voucherType === OfferStatus.GENERAL) {
        await this.generalVouchers.fetch();
        targetVoucher = this.generalVouchers.data.find(
          (voucher) => voucher.id.toString() === voucherId.toString(),
        );
      } else {
        await this.vouchers.updateOptions({
          type: voucherType,
        });
        targetVoucher = this.vouchers.data.find(
          (voucher) => voucher.id.toString() === voucherId.toString(),
        );
      }
      if (!targetVoucher) {
        this.loadingVoucher = LoadingState.FAILED;
        return Promise.reject();
      }
      this.selectedVoucherDetails = targetVoucher;
      this.loadingVoucher = LoadingState.SUCCEEDED;
      return Promise.resolve();
    } catch (error) {
      this.loadingVoucher = LoadingState.FAILED;
      return Promise.reject(error);
    }
  };

  private getMerchantOffer = async (options: {
    productId: string;
    merchantId: string;
    offerDate: string;
  }): Promise<MerchantOffer[]> => {
    const data = await this.connections.backend.httpPost(getMerchantOffer(), {
      productId: options.productId,
      merchantId: options.merchantId,
      offerDate: options.offerDate,
    });
    return data;
  };

  private getGeneralMerchantOffers = async (options: {
    productId: string;
    merchantId: string;
    offerDate: string;
    offerType: number
  }): Promise<MerchantOffer[]> => {
    const data = await this.connections.backend.httpPost(getMerchantOffer(), {
      productId: options.productId,
      merchantId: options.merchantId,
      offerDate: options.offerDate,
      offerType: options.offerType,
    });
    return data;
  };

  private getGeneralBlueNovOffers = async (options: {
    productId: string;
    merchantId: string;
    offerDate: string;
    offerType: number
  }): Promise<MerchantOffer[]> => {
    const data = await this.connections.backend.httpPost(getMerchantOffer(), {
      productId: options.productId,
      merchantId: options.merchantId,
      offerDate: options.offerDate,
      offerType: options.offerType,
    });
    return data;
  };

  
  private getNewYearOffers = async (options: {
    productId: string;
    merchantId: string;
    categoryId?: string;
  }): Promise<MerchantOffer[]> => {
    const data = await this.connections.backend.httpPost(getMerchantOffer(), {
      productId: options.productId,
      merchantId: options.merchantId,
      categoryId: options.categoryId,
    });
    return data;
  };

  private getCashbackMerchants = async (): Promise<DsquaresMerchant[]> => {
    const params = {
      offersType: OfferStatus.CASHBACK,
    };
    const data = await this.connections.backend.httpGet(getMerchants, {
      params,
    });
    return data;
  };

  private getDiscountMerchants = async (): Promise<DsquaresMerchant[]> => {
    const params = {
      offersType: OfferStatus.DISCOUNT,
    };
    const data = await this.connections.backend.httpGet(getMerchants, {
      params,
    });
    return data;
  };

  private getUserVouchersBurned = async (options: {
    userId: number;
    status: VoucherStatus;
  }): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(
      getUserVouchers(options.userId),
      {
        params: {
          status: VoucherStatus.Burned,
        },
      },
    );
    return data;
  };

  private getUserVouchersExpired = async (options: {
    userId: number;
    status: VoucherStatus;
  }): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(
      getUserVouchers(options.userId),
      {
        params: {
          status: VoucherStatus.Expired,
        },
      },
    );
    return data;
  };

  private getUserVouchersCanceled = async (options: {
    userId: number;
    status: VoucherStatus;
  }): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(
      getUserVouchers(options.userId),
      {
        params: {
          status: VoucherStatus.Canceled,
        },
      },
    );
    return data;
  };

  private getUserVouchersSubscribed = async (options: {
    userId: number;
    status: VoucherStatus;
  }): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(
      getUserVouchers(options.userId),
      {
        params: {
          status: VoucherStatus.Subscribed,
        },
      },
    );
    return data;
  };

  private getUserVouchers = async (options: {
    userId: number;
    status: VoucherStatus;
  }): Promise<Voucher[]> => {
    const data = await this.connections.backend.httpGet(
      getUserVouchers(options.userId),
    );
    return data;
  };

  @action setSelectedVoucher(value: Voucher) {
    this.selectedVoucher = value;
  }

  @observable voucherRequestStatus: LoadingState = LoadingState.IDLE;

  @observable redeemVoucher: RedeemOfferResponse;

  @action async addVoucher(userId: number, voucherId: number): Promise<void> {
    try {
      this.voucherRequestStatus = LoadingState.LOADING;
      const response = await this.connections.backend.httpPost(
        addVoucher(userId),
        {
          voucherId,
        },
      );
      this.redeemVoucher = response;
      this.voucherRequestStatus = LoadingState.SUCCEEDED;
    } catch (error) {
      this.voucherRequestStatus = LoadingState.FAILED;
      throw error;
    }
  }

  @action setSelectedMerchant(value: DsquaresMerchant) {
    this.selectedMerchant = value;
  }

  private getUserWallet = async (userId: string): Promise<UserWallet> => {
    const data = await this.connections.backend.httpGet(getUserWallet(userId), {
      remainingRetries: 1,
    });
    return data;
  };

  private getUserTransactions = async (options: {
    userId: number;
  }): Promise<MyTransaction[]> => {
    const data = await this.connections.backend.httpGet(
      getUserTransactions(options.userId),
    );
    const reformatedData = data?.map((item: MyTransaction) => {
      const reformatedDate = new Date(item.date);
      const reformatedItem = item;
      reformatedItem.date = reformatedDate
        .toLocaleDateString()
        ?.concat(' ')
        ?.concat(reformatedDate.toLocaleTimeString());
      return reformatedItem;
    });

    return reformatedData.sort(
      (a: { date: string }, b: { date: string }) => a.date < b.date,
    );
  };

  @action async createVoucherTransaction(options: {
    userId: number;
    transactionId: number;
    voucherId: string;
  }) {
    await this.connections.backend.httpPost(createVoucherTransaction, options);
  }

  @persist('list', Voucher) @observable private _vouchers: Voucher[] = [];

  @persist('list', Voucher) @observable private _generalVouchers: Voucher[] =
    [];

  @observable private _cashbackMerchants: DsquaresMerchant[] = [];

  @observable private _discounterchants: DsquaresMerchant[] = [];

  @persist('object', UserWallet)
  @observable
  private _userWallet: UserWallet = {} as UserWallet;

  @observable private _userVouchers: Voucher[] = [];

  @observable private _userVouchersBurned: Voucher[] = [];

  @observable private _userVouchersSubscribed: Voucher[] = [];

  @observable private _userVouchersExpired: Voucher[] = [];

  @observable private _userVouchersCanceled: Voucher[] = [];

  @observable private _userTransactions: MyTransaction[] = [];

  @persist('object', Voucher) @observable selectedVoucher: Voucher =
    {} as Voucher;

  @observable selectedMerchant: DsquaresMerchant = {} as DsquaresMerchant;

  @observable vouchers = new ListBackendEntity(
    this,
    '_vouchers',
    this.getVouchers,
  );

  @observable generalVouchers = new ListBackendEntity(
    this,
    '_generalVouchers',
    this.getGeneralOffers,
  );

  @observable CashbackMerchants = new ListBackendEntity(
    this,
    '_CashbackMerchants',
    this.getCashbackMerchants,
  );

  @observable DiscountMerchants = new ListBackendEntity(
    this,
    '_DiscountMerchants',
    this.getDiscountMerchants,
  );

  @observable userVouchers = new ListBackendEntity(
    this,
    '_userVouchers',
    this.getUserVouchers,
  );

  @observable generalMerchantOffers = new ListBackendEntity(
    this,
    '_generalMerchantOffers',
    this.getGeneralMerchantOffers,
  );

  @observable generalBlueNovOffers = new ListBackendEntity(
    this,
    '_getGeneralBlueNovOffers',
    this.getGeneralBlueNovOffers,
  );


  @observable merchantOffers = new ListBackendEntity(
    this,
    '_merchantOffers',
    this.getMerchantOffer,
  );

  @observable newYearOffers = new ListBackendEntity(
    this,
    '_newYearOffers',
    this.getNewYearOffers,
  );

  @observable userVouchersSubscribed = new ListBackendEntity(
    this,
    '_userVouchersSubscribed',
    this.getUserVouchersSubscribed,
  );

  @observable userVouchersBurned = new ListBackendEntity(
    this,
    '_userVouchersBurned',
    this.getUserVouchersBurned,
  );

  @observable userVouchersExpired = new ListBackendEntity(
    this,
    '_userVouchersExpired',
    this.getUserVouchersExpired,
  );

  @observable userVouchersCanceled = new ListBackendEntity(
    this,
    '_userVouchersCanceled',
    this.getUserVouchersCanceled,
  );

  @observable userTransactions = new ListBackendEntity(
    this,
    '_userTransactions',
    this.getUserTransactions,
  );

  @observable userWallet = new BackendEntity(
    this,
    '_userWallet',
    this.getUserWallet,
  );

  @action getMerchantById = async (merchantName: string, type: string) => {
    try {
      let merchants = [];
      if (type === OfferStatus.CASHBACK) {
        await this.CashbackMerchants.fetch();
        merchants = this.CashbackMerchants.data;
      } else {
        await this.DiscountMerchants.fetch();
        merchants = this.DiscountMerchants.data;
      }
      const targetMerchant = merchants.find(
        (merchant) => merchant.name.toString() === merchantName.toString(),
      );
      if (targetMerchant) {
        this.selectedMerchant = targetMerchant;
        return Promise.resolve();
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action async getMerchantByIdServer(id: string) {
    const data = await this.connections.backend.httpGet(getMerchantById(id));
    return data;
  }
}
