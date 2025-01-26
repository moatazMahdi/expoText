export const getProducts = '/products';
export const getProductById = (id: string) => `/products/${id}`;
export const getLoanMonths = (id: string) =>
  `/products/${id}/loan-calculator/months`;
export const getLoanPackages = (id: string) =>
  `/products/${id}/loan-calculator/packages`;
export const getLoanResult = () => `/products/general-loan-calculator`;
export const getProductOffersById = (id: string) => `/products/${id}/offers`;
export const getProductPlansById = (id: string) => `/products/${id}/plans`;
export const getProductVendorsById = (id: number) => `/products/${id}/vendors`;
export const getProductCategoriesById = (id: string) =>
  `/products/${id}/getMainCategories`;
export const getSubproductCategoriesById = (id: string) =>
  `/products/${id}/sub-products/categories`;
export const getSubproductsByCategoryId = (id: string) =>
  `/products/${id}/sub-products`;
export const getTrucksSubProducts = () => `/products/getTrucksProducts/en`;
export const getSubproductById = (productId: number, subProductId: number) =>
  `/products/${productId}/sub-products/${subProductId}`;
export const getProductSubcategoriesById = (id: string) =>
  `/products/categories/${id}/sub-categories`;
export const getProductAreasById = (id: string) =>
  `/products/cities/${id}/areas`;
export const getProductCitiesById = (id: string) => `/products/${id}/cities`;
export const getProductMerchantsById = (lang: string) =>
  `/products/merchants/search?lang=${lang}`;
export const searchEveryThing = (lang: string) => `/search?lang=${lang}`;
export const getOfferById = (id: number) => `/products/offers/${id}`;
export const sendRequestForm = (id: string) => `/products/${id}/info-request`;
// for Fatorty Installment Calculator
export const getFatortyInstallment = () => `/fatorty/calcInstallment`;
export const getFatortySubmit = () => `/fatorty/submit`;
export const getFatortyClientCheck = `/fatorty/offline/clientCheck`;
////Digital Fatorty
export const getDigitalFatortyInstallment = () =>
  `/fatorty/digital/calcInstallment`;
export const getDigitalFatortySubmit = () => `/fatorty/digital/submit`;

export const getValidateBalance = () => `/users/validate-balance`;
export const getFatortyOcrData = () => `/fatorty/ocr`;
export const getFatortyCheck = () => `fatorty/digital/check`;
//fatorty/digital/check
//generic calculator
export const genericCalculator = '/products/loan-calculator';
//offer calculator
export const offerCalculator = '/products/offer-calculator';
export const merchantsCategories = '/categories';
