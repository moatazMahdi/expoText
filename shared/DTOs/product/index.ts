import { BaseDTO } from '../types';

export class Product extends BaseDTO {
  productId: string;

  name: string;

  description: string;

  longDescription: string;

  backgroundImage: string;

  brandingColor: string;

  facebookLink?: string;

  twitterLink?: string;

  instagramLink?: string;

  youtubeLink?: string;

  linkedInLink?: string;
}

export class Offer extends BaseDTO {
  id: number;

  offerId: string;

  imageURL: string;

  title?: string;

  description?: string;
}

export class Plan extends BaseDTO {
  planId: number;

  title: string;

  description: string;
}

export class Category extends BaseDTO {
  categoryId?: number;
  title?: string;
  value?: string;
  label?: string;
  subCategories?: [];
}

export class City extends BaseDTO {
  id: string;

  name: string;
}

export class Subcategory extends BaseDTO {
  id: string;

  name: string;
}

export class Area extends BaseDTO {
  id: string;

  name: string;
}

export class MerchantBranch extends BaseDTO {
  address: string;

  phoneNumber: string;

  longitude: number;

  latitude: number;
}

export class Merchant extends BaseDTO {
  merchants: {
    imageUrl: string;

    title: string;

    branches: MerchantBranch[];

    id: number;
  }[];
  totalPages: number;
  title: string;
  id: any;
}

export class LoanPackage extends BaseDTO {
  description: string;

  title: string;

  packageId: number;

  minTenor: number;

  maxTenor: number;

  downPayment: number;

  allowDownPayment: number;
}

export class LoanResult extends BaseDTO {
  amount: number;
}

export class FatortyResult extends BaseDTO {
  installmentValue: string;

  adminFeesValue: string;

  fatortyAdminFees: string;
}

export class FatortySubmit extends BaseDTO {
  invoiceNo: string;
}

export class RequestForm extends BaseDTO {
  name: string;
  mobilePhone: string;
  email: string;

  //TRADE_IN
  governance: string;
  area: string;
  brand: string; //brand should not be empty
  model: string;
  modelYear: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;

  //REFERRAL
  refName: string;
  refIdNo: string;
  refPhoneNumber: string;
  refProduct: string;

  //'AUTO, 'TRUCKES
  carCondition: string;

  //BROKERAGE
  insuranceType: string;
}

export class SubproductCategory extends BaseDTO {
  name: string;
}

export class Subproduct extends BaseDTO {
  id: number;

  name: string;

  image: string;

  categoryName: string;

  description?: string;
}

export class SubProductDetails extends BaseDTO {
  id: number;

  description: string;
}

export class Vendor extends BaseDTO {
  imageURL: string;

  id: number;
}
