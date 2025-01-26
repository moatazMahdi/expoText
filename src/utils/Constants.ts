import { Assets } from 'assets';

const {
  images: {
    screens: { creditech },
  },
} = Assets;

export const iosStoreURL =
  'https://apps.apple.com/eg/app/contact-rewards/id1544159088';
export const androidStoreURL =
  'https://play.google.com/store/apps/details?id=eg.contact';

export const PermissionResult = {
  unavailable: 'unavailable',
  denied: 'denied',
  granted: 'granted',
  limited: 'limited',
  blocked: 'blocked',
};

export const RTApprovedStatus = [
  'Request completed',
  'اكتمل الطلب',
  'Request Approved',
  'تمت الموافقة على الطلب',
];

export const RTRejectStatus = ['Request Rejected', 'لم يتم الموافقة على الطلب'];
export const GOOGLE_API_KEY = 'AIzaSyC2SFBLvUhI_ZgV7_RMl5CpyxZABRWdTVg';
export const contactPayIframeURL = 'https://contactpay-iframe.contact.eg';

export const ContactRedeemAt = {
  name: 'Contact',
  image:
    'https://contact-app-prod.s3.us-east-2.amazonaws.com/contact/contact-now.png',
  cashback: true,
};

export const HomeMerchants = [
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Orange.jpg',
    title:"Orange",
    id: 4144, //orange
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Vodafone%20Logo.png',
    title:"Vodafone",
    id: 4167, //vodafone
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Oro%20Egypt.png',
    title:"Lazurd",
    id: 1587, //lazurd
  },
  {
    imageUrl:
      'https://contact.eg/wp-content/uploads/2020/10/Switch-plus-3-300x47.png',
    title:"Switch Plus",
      id: 106, //SwitchPlus
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Ghataty-4-300x300.png',
      title:"Ghattaty",
    id: 37, //ghattaty
  },
  {
    imageUrl: 'https://contact.eg/wp-content/uploads/2020/10/Carrefour.png',
    title:"Carrefour",
    id: 87, //carrefour
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/12/damas-art-of-beauty_final-logo-0-1.jpg',
      title:"Damas",
    id: 339, //Damas
  },
  {
    imageUrl: 'https://contact-clients-dev.s3.amazonaws.com/Hyper%20One.png',
    title:"Hyper One",
    id: 3121, //hyper one
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Tangreen.jpg',
      title:"Tangreen",
    id: 4016, //Tangreen
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/HUB-Furniture-1-300x300.png',
      title:"HUB Furniture",
    id: 150, //HUB Furniture
  },
  {
    imageUrl: 'https://contact-client-logos.s3.amazonaws.com/Dream+2000.png',
    title:"Dream 2000",
    id: 1056, //dream 2000
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Art-House-2-300x108.jpg',
      title:"ART House",
    id: 100, //ART House
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Tradeline-300x169.jpg',
      title:"TradeLine",
    id: 16, //tradeline
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Mobilaty.png',
      title:"Mobilaty",
    id: 1374, //mobilaty
  },
  {
    imageUrl: 'http://contact.eg/wp-content/uploads/2020/10/2B-best-buy.png',
    title:"2B",
    id: 28, //2B
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Kabanni-2-1-300x95.png',
      title:"Kabani",
    id: 59, //kabani
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Dubai-phone-300x300.jpg',
      title:"Dubai Phone",
    id: 180, //dubai phone
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/12/Jawhara-300x122.png',
      title:"Jawhara",
    id: 340, //jawhara
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/MIAMI-CENTER-300x300.jpg',
      title:"Miami Center",
    id: 192, //miami center
  },
  {
    imageUrl: 'http://contact.eg/wp-content/uploads/2020/10/Select.png',
    title:"Select",
    id: 60, //select
  },
  {
    imageUrl:
      'http://contact.eg/wp-content/uploads/2020/10/Barakat-300x212.jpg',
      title:"Barakat",
    id: 72, //barakat
  },
  // {
  // imageUrl: 'https://contact-clients-dev.s3.amazonaws.com/Spinneys.jpeg',
  // id: 1154, //spinneys
  // },
];

export const BookingMerchants = [
  {
    imageUrl:
      "https://contact.eg/wp-content/uploads/2020/10/Tradeline-300x169.jpg",
    title_En:"Tradeline",
    title_Ar:"تريد لاين ستورز",
    id: 16,
  },
  {
    imageUrl:
"https://contact.eg/wp-content/uploads/2020/10/2B-best-buy.png",
    title_En:"2B best buy",
    title_Ar:"شركة بست باى لنظم المعلومات - (2B)",
    id: 28,
  },
  {
    imageUrl:
    'https://contact.eg/wp-content/uploads/2020/10/Ghataty-4-300x300.png',
  title_En:"Ghataty",
  title_Ar:" غطاطي للأستثمارات التجارية و الهندسية",
  id: 32,
  },
  {
    imageUrl:
      'https://contact.eg/wp-content/uploads/2020/10/Barakat-300x212.jpg',
    title_En:"Barakat",
    title_Ar:"البركات لتجارة البطاريات و الإطارات",
    id: 72
  },
  // {
  //   imageUrl:
  //     'https://contact.eg/wp-content/uploads/2020/10/Carrefour.png',
  //   title_En:"Carrefour",
  //   title_Ar:"شركة ماف لتجهيز وادارة الهايبر ماركتس - كارفور",
  //   id: 87,
  // },
  {
    imageUrl:
      'https://contact.eg/wp-content/uploads/2020/10/Al-Morshedy-for-trading-300x300.jpg',
    title_En:"Al-Morshedy for trading",
    title_Ar:"العالمية لتجارة الجملة والتجزئة للاجهزة الكهربائية و المنزلية المرشدى مول",
    id: 138,
  },
  {
    imageUrl:
      'https://contact.eg/wp-content/uploads/2020/10/HUB-Furniture-1-300x300.png',
    title_En:"HUB Furniture",
    title_Ar:"الشركة المصرية الحديثه للأثاث - HUB FURNITURE",
    id: 150,
  },
  {
    imageUrl:
    'https://contact.eg/wp-content/uploads/2020/10/Dubai-phone-300x300.jpg',
  title_En:"Dubai phone",
  title_Ar:"دبي تلي كوم لتجارة اجهزه المحمول و اكسسواراتها",
  id: 180,
  },
  {
    imageUrl:
      'https://contact.eg/wp-content/uploads/2020/10/EHAB-Center-300x300.jpg',
    title_En:"EHAB Center",
    title_Ar:"ايهاب سنتر لتجارة الاجهزة الكهربائية",
    id: 221,
  },
  {
    imageUrl:
    'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Nike%20Black%20Atc3_page-0001.jpg',
  title_En:"Nike",
  title_Ar:"الشركة المتحدة للتجارة و الاستشارات",
  id: 315,
  },
  {
    imageUrl:
    'https://contact.eg/wp-content/uploads/2020/11/el-mawardy-logo-2-300x65.png',
  title_En:"El Mawardi",
  title_Ar:"الماوردى",
  id:316 ,
  },
  // {
  //   imageUrl:
  //   'https://contact.eg/wp-content/uploads/2021/01/Contact-Logos-And-ArtLines-04-se-1-300x136.png',
  // title_En:"Contact Insurance",
  // title_Ar:"كونتكت للوساطة التأمينية",
  // id: 319,
  // },
  {
    imageUrl:
    'https://contact.eg/wp-content/uploads/2020/12/Jawhara-300x122.png',
  title_En:"Jawhara",
  title_Ar:"جوهرة للمجوهرات",
  id: 340,
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Adidas%20Kids%20E1_page-0001.jpg',
    title_En:"ADIDAS KIDS",
    title_Ar:"الديوانى للتجارة",
    id: 391,
  },
  // {
  //   imageUrl:
  //   '',
  // title_En:"Incredi Deals",
  // title_Ar:"إنكريدي ديلز للتجارة",
  // id: 619,
  // },
  {
    imageUrl:
    'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/INTER%20SPORT.jpg',
  title_En:"INTER SPORT",
  title_Ar:"إنتر سبورت مصر للتجارة و التوزيع",
  id: 754,
  },
  {
    imageUrl:
    'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/ANTA%20SPORT.jpg',
  title_En:"ANTA SPORT",
  title_Ar:"S R G شركه سبورتس ريتال جروب",
  id: 761,
  },
  {
    imageUrl:
    'https://contact.eg/wp-content/uploads/2021/03/ecco-1.png',
  title_En:"ECCO",
  title_Ar:"شركه ال ار جى التجاريه",
  id:763 ,
  },
  {
    imageUrl:
      'https://contact-client-logos.s3.amazonaws.com/Dream+2000.png',
    title_En:"Dream 2000",
    title_Ar:"شركة دريم تليكوم للاجهزة الالكترونية",
    id: 1056,
  },
  {
    imageUrl:
    'https://contact-clients-dev.s3.amazonaws.com/Ahmed%20El%20sallab.png',
  title_En:"Ahmed El sallab",
  title_Ar:"شركه السلاب للتجاره ورثه / احمد السلاب ( وليد احمد السلاب - مصطفى احمد السلاب و شركاه )",
  id: 1473,
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Vodafone%20Logo.png',
    title_En:"Vodafone",
    title_Ar:"Vodafone Egypt Telecommunications",
    id: 4167,
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Etisala%20Misr.png',
    title_En:"Etisalat Misr",
    title_Ar:"اتصالات مصر",
    id: 4168,
  },
  // {
  //   imageUrl:
  //     'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Mngm.png',
  //   title_En:"Mngm",
  //   title_Ar:"شركه جولد نت للتجاره GNT",
  //   id: 4292,
  // },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/Ferozah%20Jewelry.jpg',
    title_En:"Ferozah Jewelry",
    title_Ar:" فروزة للمجوهرات",
    id: 4331,
  },
  {
    imageUrl:
      'https://image-solution-no-scale.s3.us-east-2.amazonaws.com/upload/IKEA.png',
    title_En:"IKEA",
    title_Ar:"ايكيا",
    id: 4361,
  },
];

export const linksKeys = [
  'product',
  'program',
  'merchant',
  'exclusiveforyou',
  'offer',
  'loyaltypoints',
  'manageMyInstallments',
  'digitalFatorty',
  'quickPay',
  'manageCreditScreen',
  'billPayment',
  'offers',
  'services',
  'allMerchants',
  'search',
  'contactBranches',
  'contactUs',
  'increaseLimit',
  'payToOthers',
  'manageMyBills',
  'quickPayBillPayment',
];

export const key =
  '594c8dcd7744acd6827da875815c620af4a1c983908e6fdc2811c80ed5e6fdd1533c012ca29102620f2bddda67a98a7e63b8f27dd964f98ccaab2beec0ada476';

export const initialMapCords = {
  latitude: 30.0480392,
  longitude: 31.2363749,
  latitudeDelta: 0.0012,
  longitudeDelta: 0.0011,
};

export const personasData = [
  {
    id: '52',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/electronics.png',
    EnTitle: 'Electronics',
    ArTitle: 'أجهزة',
    title: 'Electronics',
  },
  {
    id: '53',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/furniture.png',
    EnTitle: 'Furniture',
    ArTitle: 'عفش',
    title: 'Furniture',
  },
  {
    id: '54',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/F_B.png',
    EnTitle: 'Supermarket',
    ArTitle: 'سوبر ماركت',
    title: 'Supermarket',
  },
  {
    id: '55',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/Travel.png',
    EnTitle: 'Travel',
    ArTitle: 'سفرية',
    title: 'Travel',
  },
  {
    id: '56',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/merchandise.png',
    EnTitle: 'Sportswear',
    ArTitle: 'ملابس رياضية',
    title: 'Sportswear',
  },
  {
    id: '57',
    image:
      'https://contact-mobile-app.s3.us-east-2.amazonaws.com/AFCON/OTT.png',
    EnTitle: 'Streaming',
    ArTitle: 'اتفرج علي البطولة',
    title: 'Streaming',
  },
];

export const personasGroup =
  'https://contact-mobile-app.s3.us-east-2.amazonaws.com/personas/personas_group.jpg';

export const homeBanner =
  'https://contact-mobile-app.s3.us-east-2.amazonaws.com/personas/home_banner.jpg';

export const Entertainment = {
  id: 2130,
  Image: creditech.Entertainment,
  Title: '0 Interest Rate',
  Description: '',
  merchantName: 'Entertainment',
  maxTenor: 12,
  minTenor: 6,
  expiryDate: '13 - 01 - 2024',
  calcId: null,
  tenors: null,
  navigateToBillPayment: true,
};

export const Gaming = {
  id: 2131,
  Image: creditech.Gaming,
  Title: '0 Interest Rate',
  Description: '',
  merchantName: 'Gaming',
  maxTenor: 12,
  minTenor: 6,
  expiryDate: '13 - 01 - 2024',
  calcId: null,
  tenors: null,
  navigateToBillPayment: true,
};
