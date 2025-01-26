import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import { I18nManager } from 'react-native';
import { createModelSchema, primitive } from 'serializr';
import {
  Product,
  Offer,
  Plan,
  RequestForm,
  Category,
  Merchant,
  City,
  Area,
  LoanPackage,
  LoanResult,
  SubproductCategory,
  Subproduct,
  SubProductDetails,
  Vendor,
  FatortyResult,
  FatortySubmit,
} from 'shared';
import { searchInterface } from 'src/Types';
import { ListBackendEntity, LoadingState } from 'utils';
import { BackendStores } from '..';
import { BaseBackendStore } from '../types';
import {
  getProductOffersById,
  getProducts,
  getProductPlansById,
  sendRequestForm,
  getProductCategoriesById,
  getProductMerchantsById,
  getProductCitiesById,
  getProductAreasById,
  getLoanMonths,
  getLoanPackages,
  getLoanResult,
  getSubproductCategoriesById,
  getSubproductsByCategoryId,
  getTrucksSubProducts,
  getSubproductById,
  getProductVendorsById,
  getFatortyInstallment,
  getDigitalFatortyInstallment,
  getFatortySubmit,
  getDigitalFatortySubmit,
  getProductById,
  searchEveryThing,
  getValidateBalance,
  getOfferById,
  genericCalculator,
  offerCalculator,
  merchantsCategories,
  getFatortyOcrData,
  getFatortyCheck,
  getFatortyClientCheck
} from './requests';

export type ProductType =
  | 'Auto'
  | 'Trucks'
  | 'Mortgage'
  | 'Finishing'
  | 'Shopping'
  | 'Brokerage'
  | 'Leasing'
  | 'Education';

interface ProductMerchantOptions {
  productId: string;

  categoryId: string;

  areaId: string;

  cityId: string;

  subCategoryId: string;

  query: string;

  pageNumber: number;

  pageSize: number;

  code?: string
}

interface LoanResultOptions {
  tenors: string;

  packageId: number;

  amount: number;

  downPayment: number;
}

interface FatortyResultOptions {
  isDigital: boolean;

  id: number;

  tenor: string;

  clientId: string;

  loanAmount: string;

  fatortyAdminFees: string;

  adminFees: string;
}

interface FatortySubmitOptions {
  isDigital: boolean;
  tenor: string;

  clientId: string;

  price: string;

  invoiceDate: string;

  invoiceMerchant: string;

  adminFees: string;

  invoiceUrl: string;

  fatortyAdminFees: string;
}

interface ValidateBalanceOption {
  loanAmount: number;
  nationalId: string;
}

createModelSchema(Product, {
  productId: primitive(),
  name: primitive(),
  description: primitive(),
  backgroundImage: primitive(),
  brandingColor: primitive(),
  facebookLink: primitive(),
  twitterLink: primitive(),
  instagramLink: primitive(),
  youtubeLink: primitive(),
  linkedInLink: primitive(),
});

export class ProductsStore extends BaseBackendStore {
  private getProducts = async (): Promise<Product[]> => {
    const data = await this.connections.backend.httpGet(getProducts);
    return data;
  };

  private getProductOffersById = async (options: {
    productId: string;
  }): Promise<Offer[]> => {
    const data = await this.connections.backend.httpGet(
      getProductOffersById(options.productId),
    );
    return data;
  };

  private getProductPlansById = async (options: {
    productId: string;
  }): Promise<Plan[]> => {
    const data = await this.connections.backend.httpGet(
      getProductPlansById(options.productId),
    );
    return data;
  };

  private getProductCategoriesById = async (options: {
    productId: string;
  }): Promise<Category[]> => {
    const data = await this.connections.backend.httpGet(
      getProductCategoriesById(options.productId),
    );
    return data;
  };

  private getMerchantsCategoriesById = async (options?: {
    category_id?: number;
  }): Promise<Category[]> => {
    const data = await this.connections.backend.httpGet(merchantsCategories, {
      params: { category_id: options?.category_id },
    });
    let newCategories = [];
    data?.forEach((element: { id: any; name: any; subCategories: [] }) => {
      newCategories.push({
        value: element?.id,
        label: I18nManager?.isRTL ? element.name?.ar : element.name?.en,
        subCategories: element?.subCategories,
      });
    });
    return newCategories;
  };

  private getSubproductCategoriesById = async (options: {
    productId: string;
  }): Promise<SubproductCategory[]> => {
    const data = await this.connections.backend.httpGet(
      getSubproductCategoriesById(options.productId),
    );
    return data;
  };

  // eslint-disable-next-line max-len
  private getSubproductsByCategoryId = async (options: {
    productId: string;
    categoryName?: string;
  }): Promise<Subproduct[]> => {
    const data: Subproduct[] = await this.connections.backend.httpGet(
      getSubproductsByCategoryId(options.productId),
    );
    if (options.categoryName) {
      const filteredData = data?.filter(
        (subProduct: Subproduct) =>
          subProduct.categoryName === options.categoryName,
      );
      return filteredData;
    }
    return data;
  };

  // eslint-disable-next-line max-len
  private getTrucksSubProducts = async (): Promise<Subproduct[]> => {
    const products = await this.connections.backend.httpGet(
      getTrucksSubProducts(),
    );
    const data: Subproduct[] = products.products;
    return data;
  };

  private getProductCitiesById = async (options: {
    productId: string;
  }): Promise<City[]> => {
    const data = await this.connections.backend.httpGet(
      getProductCitiesById(options.productId),
    );

    let newCities = [];
    data?.forEach((element: { id: any; name: any }) => {
      newCities.push({
        value: element?.id,
        label: element.name,
      });
    });

    return newCities;
  };

  private getProductAreasById = async (options: {
    cityId: string;
  }): Promise<Area[]> => {
    const data = await this.connections.backend.httpGet(
      getProductAreasById(options.cityId),
    );

    let newAreas = [];
    data?.forEach((element: { id: any; name: any }) => {
      newAreas.push({
        value: element?.id,
        label: element.name,
      });
    });

    return newAreas;
  };

  private getLoanMonths = async (): Promise<number[]> => {
    const data = await this.connections.backend.httpGet(
      getLoanMonths(this.currentProduct),
    );
    return data;
  };

  private getLoanPackages = async (options: {
    productId: string;
  }): Promise<LoanPackage[]> => {
    const data = await this.connections.backend.httpGet(
      getLoanPackages(options.productId),
    );
    return data;
  };

  public getProductMerchantsById = async (
    options: ProductMerchantOptions,
  ): Promise<Merchant[]> => {
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const data = await this.connections.backend.httpPost(
      getProductMerchantsById(lang),
      {
        productId: options?.productId,
        categoryId: options?.categoryId,
        areaId: options?.areaId,
        cityId: options?.cityId,
        subCategoryId: options?.subCategoryId,
        query: options?.query,
        phone: this.parent.users.userData?.phone,
      },
    );
    return data;
  };

  public search = async (options: {
    query: string;
  }): Promise<searchInterface[]> => {
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const data = await this.connections.backend.httpPost(
      searchEveryThing(lang),
      {
        query: options?.query,
        phone: this.parent.users.userData?.phone,
      },
    );
    return data;
  };

  private getProductVendorsById = async (options: {
    productId: number;
  }): Promise<Vendor[]> => {
    const data = await this.connections.backend.httpGet(
      getProductVendorsById(options.productId),
    );
    return data;
  };

  private getLoanResult = async (
    options: LoanResultOptions,
  ): Promise<LoanResult[]> => {
    const data = await this.connections.backend.httpPost(getLoanResult(), {
      amount: options.amount,
      downPayment: options.downPayment,
      tenors: options.tenors,
      packageId: options.packageId,
    });
    return data;
  };

  // getFatortyResult
  private getFatortyResult = async (
    options: FatortyResultOptions,
  ): Promise<FatortyResult[]> => {
    const data = await this.connections.backend.httpPost(
      getFatortyInstallment(),
      {
        clientId: options.clientId,
        tenor: options.tenor,
        loanAmount: options.loanAmount?.toString(),
      },
      {
        remainingRetries: 1,
      },
    );
    return data;
  };

  //Digital
  private getDigitalFatortyResult = async (
    options: FatortyResultOptions,
  ): Promise<FatortyResult[]> => {
    const data = await this.connections.backend.httpPost(
      getDigitalFatortyInstallment(),
      {
        clientId: options.clientId,
        tenor: options.tenor,
        loanAmount: options.loanAmount?.toString(),
      },
      {
        remainingRetries: 1,
      },
    );
    return data;
  };
  //getFatortyCheck

  @action getFatortyCheck = async () => {
    try {
      const response: any = await this.connections.backend.httpPost(
        getFatortyCheck(),
        {
          nationalId: this.parent.users.userData?.nationalId,
        },
        // { remainingRetries: 2 },
      );
      this.isUserEligible = response;
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  @action validateBalance = async (options: ValidateBalanceOption) => {
    try {
      const response: any = await this.connections.backend.httpPost(
        getValidateBalance(),
        {
          loanAmount: options.loanAmount,
          nationalId: options.nationalId,
        },
        { remainingRetries: 0 },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  private getFatortySubmit = async (
    options: FatortySubmitOptions,
  ): Promise<FatortySubmit[]> => {
    const data = await this.connections.backend.httpPost(getFatortySubmit(), {
      clientId: options.clientId,
      tenor: options.tenor,
      price: options.price,
      invoiceDate: options.invoiceDate,
      invoiceMerchant: options.invoiceMerchant,
      invoiceUrl: options.invoiceUrl,
      fatortyAdminFees: options.fatortyAdminFees,
      adminFees: options.adminFees,
    });
    return data;
  };

  //Digital

  private getDigitalFatortySubmit = async (
    options: FatortySubmitOptions,
  ): Promise<FatortySubmit[]> => {
    const data = await this.connections.backend.httpPost(
      getDigitalFatortySubmit(),
      {
        clientId: options.clientId,
        tenor: options.tenor,
        price: options.price,
        invoiceDate: options.invoiceDate,
        invoiceMerchant: options.invoiceMerchant,
        invoiceUrl: options.invoiceUrl,
        fatortyAdminFees: options.fatortyAdminFees,
        adminFees: options.adminFees,
      },
    );
    return data;
  };

  @action getOfferById = async (id: number) => {
    const data = await this.connections.backend.httpGet(getOfferById(id));
    return data;
  };

  @action getProductMerchants = async (
    options: ProductMerchantOptions,
  ): Promise<Merchant[]> => {
    this.productMerchantsLoadingState = LoadingState.LOADING;

    try {
      const lang = I18nManager.isRTL ? 'ar' : 'en';
      const data = await this.connections.backend.httpPost(
        getProductMerchantsById(lang),
        {
          productId: options?.productId,
          categoryId: options?.categoryId,
          areaId: options?.areaId,
          cityId: options?.cityId,
          subCategoryId: options?.subCategoryId,
          query: options?.query,
          phone: this.parent.users.userData?.phone,
          pageNumber: options?.pageNumber,
          pageSize: options?.pageSize,
          code : options?.code
        },
      );
      this.productMerchantsLoadingState = LoadingState.SUCCEEDED;

      return data;
    } catch (e) {
      this.productMerchantsLoadingState = LoadingState.FAILED;
    }
  };

  @persist @observable isUserEligible: {} = {};

  @observable selectedSubproductCategoryName: string = '';

  @observable selectedMerchantCategoryId: string = '';

  @persist @observable selectedPlanId: string = '';

  @persist @observable currentProduct: ProductType = 'Auto';

  @persist @observable currentMerchantId: string = '';

  @persist('list', Product) @observable private _products: Product[] = [];

  @observable private _productOffers: Offer[] = [];

  @persist('object', Offer) @observable selectedOffer: Offer = {} as Offer;

  @observable selectedSubproduct: Subproduct = {} as Subproduct;

  @observable private _productMerchants: Merchant[] = [];

  @observable products = new ListBackendEntity(
    this,
    '_products',
    this.getProducts,
  );

  @observable productOffers = new ListBackendEntity(
    this,
    '_productOffers',
    this.getProductOffersById,
  );

  @observable productPlans = new ListBackendEntity(
    this,
    '_productPlans',
    this.getProductPlansById,
  );

  @observable productVendors = new ListBackendEntity(
    this,
    '_productVendors',
    this.getProductVendorsById,
  );

  @observable productCategories = new ListBackendEntity(
    this,
    '_productCategories',
    this.getProductCategoriesById,
  );

  @observable merchantsCategories = new ListBackendEntity(
    this,
    '_merchantsCategories',
    this.getMerchantsCategoriesById,
  );

  @observable subproductCategories = new ListBackendEntity(
    this,
    '_subproductCategories',
    this.getSubproductCategoriesById,
  );

  @observable subproducts = new ListBackendEntity(
    this,
    '_subproducts',
    this.getSubproductsByCategoryId,
  );

  @observable trucksSubproducts = new ListBackendEntity(
    this,
    '_trucksSubproducts',
    this.getTrucksSubProducts,
  );

  @observable productCities = new ListBackendEntity(
    this,
    '_productCities',
    this.getProductCitiesById,
  );

  @observable productAreas = new ListBackendEntity(
    this,
    '_productAreas',
    this.getProductAreasById,
  );

  @observable productMerchants = new ListBackendEntity(
    this,
    '_productMerchants',
    this.getProductMerchantsById,
  );

  @observable Search = new ListBackendEntity(this, '_search', this.search);

  @observable loanMonths = new ListBackendEntity(
    this,
    '_loanMonths',
    this.getLoanMonths,
  );

  @observable loanPackages = new ListBackendEntity(
    this,
    '_loanPackages',
    this.getLoanPackages,
  );

  @observable loanResult = new ListBackendEntity(
    this,
    '_loanResult',
    this.getLoanResult,
  );

  @observable fatortyResult = new ListBackendEntity(
    this,
    '_fatortyResult',
    this.getFatortyResult,
  );

  @observable digitalFatortyResult = new ListBackendEntity(
    this,
    '_digitalFatortyResult',
    this.getDigitalFatortyResult,
  );

  @observable fatortySubmit = new ListBackendEntity(
    this,
    '_fatortySubmit',
    this.getFatortySubmit,
  );

  @observable digitalFatortySubmit = new ListBackendEntity(
    this,
    '_digitalFatortySubmit',
    this.getDigitalFatortySubmit,
  );
  @observable productMerchantsLoadingState: LoadingState = LoadingState.IDLE;

  constructor(public parent: BackendStores) {
    super();
    this.makeObservable();
    this.registerObservableDrivers();
  }

  getProductById(productId: ProductType) {
    return this._products.find((i) => i.name === productId);
  }

  getMerchantByTitle(merchantTitle: string) {
    return this._productMerchants.find((i) => i.title === merchantTitle);
  }

  getMerchantById(merchantId: string) {
    return this._productMerchants.find((i) => i.id.toString() === merchantId);
  }

  @action setCurrentMerchantCategory(value: string) {
    this.selectedMerchantCategoryId = value;
  }

  @action setCurrentSubproductCategory(value: string) {
    this.selectedSubproductCategoryName = value;
  }

  @action setProduct(value: ProductType) {
    this.currentProduct = value;
  }

  @action setMerchant(merchantTitle: string) {
    this.currentMerchantId = merchantTitle;
  }

  @action setSelectedOffer(value: Offer) {
    this.selectedOffer = value;
  }

  @action async setSelectedSubproduct(productId: number, value: Subproduct) {
    // eslint-disable-next-line max-len
    const subProduct: SubProductDetails =
      await this.connections.backend.httpGet(
        getSubproductById(productId, value.id),
      );
    this.selectedSubproduct = {
      ...value,
      description: subProduct.description,
    };
  }

  @action setSelectedPlan(value: string) {
    this.selectedPlanId = value;
  }

  @action clearStore() {
    this.productMerchants._setData([], true);
  }

  @action async sendRequestInfoForm(
    requestInfoForm: RequestForm,
    subProduct?: string,
  ): Promise<void> {
    const requestBody = {
      requestInfoForm,
      subProduct,
    };

    await this.connections.backend.httpPost(
      sendRequestForm(this.currentProduct),
      { ...requestBody, formSource: 2 },
    );
  }

  @action async getProductByIdServer(id: string) {
    const data = await this.connections.backend.httpGet(getProductById(id));
    return data;
  }

  @action async getGenericCalculatorResult(options: {
    amount: number;
    tenors: number;
  }) {
    try {
      const response = await this.connections.backend.httpPost(
        genericCalculator,
        {
          ...options,
        },
        {
          remainingRetries: 0,
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async offerCalculatorResult(options: {
    amount: number;
    tenors: number;
    offerId: number;
  }) {
    try {
      const response = await this.connections.backend.httpPost(
        offerCalculator,
        {
          ...options,
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async getFatortyOcrData(options: { invoiceUrl: string }) {
    try {
      const response = await this.connections.backend.httpPost(
        getFatortyOcrData(),
        {
          ...options,
          nationalId: this.parent.users.userData?.nationalId,
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @action async getMerchantsCategories(options: { category_id?: number }) {
    const data = await this.connections.backend.httpGet(merchantsCategories, {
      params: {
        category_id: options.category_id,
      },
    });
    return data;
  }

  // getFatortyClientCheck
  @action async getFatortyClientCheck(nationalId: string) {
    const data = await this.connections.backend.httpPost(getFatortyClientCheck,  { nationalId },);
    return data;
  }

}
