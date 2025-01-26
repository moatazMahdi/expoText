import {Alert, I18nManager, Linking, Platform} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import {AppInstalledChecker} from 'react-native-check-app-install';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';
// import MoEReactInbox from 'react-native-moengage-inbox';
import {sign} from 'react-native-pure-jwt';
// import RootBeer from 'react-native-rootbeer';
// import crypto from 'crypto';
import numbro from 'numbro';
import Axios from 'axios';
import {
  BookingMerchants,
  contactPayIframeURL,
  HomeMerchants,
  linksKeys,
} from './Constants';

import {ApplicationAnalytics} from './firebaseUtils';
import {notificationInterface} from 'src/Types';
import {Settings} from 'settings';
import {Assets} from 'assets';

const {
  images: {
    screens: {creditech, home},
  },
} = Assets;

interface Banner {
  img: string | any;
  onPress: () => void;
  svg?: boolean;
}

const rnBiometrics = new ReactNativeBiometrics();

const pointsFormatter = (amount: number) => {
  amount = Number(amount.toFixed(2));
  const numParts = amount.toString().split('.');
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return numParts?.join('.');
};

export const formatMoney = (amount: number) => {
  let formatted =
    amount && !Number.isNaN(amount)
      ? numbro(amount).format({
          thousandSeparated: true,
        })
      : '0';
  return formatted;
};

export const tempTranslate = (en: string, ar: string) =>
  I18nManager.isRTL ? ar : en;

export const getProperText = (object: {ar: {}; en: {}}) => {
  if (I18nManager.isRTL) {
    return object.ar;
  }
  return object.en;
};

export const getCurrency = () => (I18nManager.isRTL ? 'ج.م' : 'EGP');

// format Points for numbers > thounsands and millions
export const formatPoints = (n: number): string => {
  if (n === undefined) {
    return '0';
  }
  if (n < 1e3) return `${pointsFormatter(n)}`;
  if (n >= 1e3 && n < 1e6) return `${pointsFormatter(n)}`;
  if (n >= 1e6 && n < 1e9) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e9 && n < 1e12) return `${+(n / 1e9).toFixed(1)}B`;
  if (n >= 1e12) return `${+(n / 1e12).toFixed(1)}T`;
  return n.toString();
};

export const getPoints = (amount: number) => {
  const points = formatPoints(amount);
  let label = '';
  if (amount >= 2) {
    label = I18nManager.isRTL ? 'نقطة' : 'Points';
    if (amount < 9 && !I18nManager.isRTL) {
      label = 'نقاط';
    }
  }
  return `${points} ${label}`;
};

export const combineMoneyCurrency = (amount: number, currency?: string) => {
  if (amount || amount === 0) {
    return I18nManager.isRTL
      ? `${formatMoney(amount)} ${currency ?? getCurrency()}`
      : `${currency ?? getCurrency()} ${formatMoney(amount)}`;
  } else return '';
};

export const onCallNumber = (number: string) => {
  Linking.openURL(`tel:${number}`);
};

export const returnCredit = data => {
  let balanceArray = data;
  let balance = {limit: null, amount: null};
  if (balanceArray && balanceArray.length > 0) {
    balance = {limit: balanceArray[0].limit, amount: balanceArray[0].amount};
  }

  return balance;
};

// convert date from day

/**
 *
 * @param date date "YYYY-MM-DD"
 * @returns string short month Year  ex. Aug 2022
 */
const datesEnArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const datesArrLong = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let dateArArr = [
  'يناير',
  'فبراير',
  'مارس',
  'ابريل',
  'مايو',
  'يونيو',
  'يوليو',
  'اغسطس',
  'سبتمبر',
  'اكتوبر',
  'نوفمبر',
  'ديسمبر',
];

// get date after x months from today
export const getDateAfterXMonths = (months: number) => {
  const date = new Date();
  const currentDate = new Date().toLocaleString(
    I18nManager.isRTL ? 'ar' : 'en',
    {
      month: 'short',
      year: 'numeric',
    },
  );

  const currentDateSlice = currentDate.split(' ');

  date.setMonth(date.getMonth() + months);

  const dateData = new Date(date).toLocaleString(
    I18nManager.isRTL ? 'ar' : 'en',
    {
      month: 'short',
      year: 'numeric',
    },
  );

  const slices = dateData.split(' ');

  return {
    fromDate: `${currentDateSlice[0]} ${currentDateSlice[1]}`,
    toDate: `${slices[0]} ${slices[1]}`,
  };
};

export const returnMonthYear = (date, day?: boolean, dot?: boolean) => {
  if (date.split('/').length > 1) {
    const dateArray = date.split('/');
    let monthNumber = dateArray[1];
    if (monthNumber.charAt(0) === '0') {
      monthNumber = monthNumber?.slice(1);
    }
    monthNumber -= 1;
    const MonthName = I18nManager.isRTL
      ? dateArArr[monthNumber]
      : datesEnArr[monthNumber];

    return `${MonthName}${dot ? '.' : ' '}${day ? dateArray[0] : dateArray[2]}`;
  } else return date;
};

export const returnDayMonthYear = date => {
  if (date.split('/').length > 1) {
    const dateArray = date.split('/');
    let monthNumber = dateArray[1];
    if (monthNumber.charAt(0) === '0') {
      monthNumber = monthNumber?.slice(1);
    }
    monthNumber -= 1;
    const MonthName = I18nManager.isRTL
      ? dateArArr[monthNumber]
      : datesEnArr[monthNumber];

    return `${dateArray[0]} ${MonthName} ${dateArray[2]}`;
  } else return date;
};

export const formatExpiryDate = (date: string) => {
  let newFormatDate = new Date(date).toLocaleString(
    I18nManager.isRTL ? 'ar' : 'en',
    {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    },
  );
  return newFormatDate;
};

export const formatExpiryDateOffer = (date: string) => {
  let newFormatDate = new Date(date).toLocaleString(
    I18nManager.isRTL ? 'ar' : 'en',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );
  return newFormatDate;
};

export const formatDayMonthDate = (date: string) => {
  let newFormatDate = new Date(date).toLocaleString(
    I18nManager.isRTL ? 'ar' : 'en',
    {
      day: 'numeric',
      month: 'numeric',
    },
  );
  return newFormatDate;
};

export const getMonthName = date => {
  if (date.split('/').length > 1) {
    const dateArray = date.split('/');
    let monthNumber = dateArray[1];
    if (monthNumber.charAt(0) === '0') {
      monthNumber = monthNumber?.slice(1);
    }
    monthNumber -= 1;
    const MonthName = I18nManager.isRTL
      ? dateArArr[monthNumber]
      : datesArrLong[monthNumber];

    return `${MonthName}`;
  } else return date;
};

// Saving Instant Approval Progress to AsyncStorage
export const saveInstantApprovalProgress = async (value: any) => {
  const valueWithDate = {...value, date: new Date()};
  try {
    await AsyncStorage.setItem(
      'Contact-InstantProgress',
      JSON.stringify(valueWithDate),
    );
  } catch (error) {
    // Error saving data
  }
};

// get date from week before than current date
const dateBeforeWeek = () => {
  const weekBefore = new Date();
  weekBefore.setDate(weekBefore.getDate() - 7);
  return weekBefore;
};

// Compare Date Now and Date in AsyncStorage and return true if date is older than now by 7 days or not
const isDateBeforeWeek = date => {
  const weekBefore = new Date(dateBeforeWeek());
  return date > weekBefore;
};

// Reading Instant Approval Progress from AsyncStorage
export const getInstantApprovalProgress = async () => {
  try {
    const value = await AsyncStorage.getItem('Contact-InstantProgress');
    if (value !== null) {
      const objParsed = JSON.parse(value);
      objParsed.date = new Date(objParsed.date);
      if (isDateBeforeWeek(objParsed?.date)) {
        return {name: objParsed.name, params: {...objParsed.params}};
      } else return null;
    }
  } catch (error) {
    // Error retrieving data
    return null;
  }
};

export const getTodayDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return yyyy + '/' + mm + '/' + dd;
};

const getDistance = (point1, point2) => {
  const xd = point1.longitude - point2.longitude;
  const yd = point1.latitude - point2.latitude;
  return Math.sqrt(xd * xd + yd * yd);
};

// get nearest location from array to the point
// @param {array} locations - array of locations
// @param {object} point - point
// @return {object} - nearest location
export const getNearestLocation = (locations, point) => {
  let nearest = null;
  let nearestDistance = Infinity;
  locations &&
    locations.length > 0 &&
    locations?.forEach(location => {
      const distance = getDistance(point, location);
      if (distance < nearestDistance) {
        nearest = location;
        nearestDistance = distance;
      }
    });
  return nearest;
};

export const getHistoryListFromAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('history');
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
    return [];
  }
};

export const removeHistoryListFromAsyncStorage = async () => {
  try {
    AsyncStorage.removeItem('history');
  } catch (error) {
    // Error retrieving data
    return [];
  }
};

export const saveHistoryListToAsyncStorage = async historyList => {
  if (historyList.length > 5) {
    historyList.shift();
  }
  try {
    await AsyncStorage.setItem('history', JSON.stringify(historyList));
  } catch (error) {
    // Error saving data
  }
};

export const handleReturnUserName = user => {
  let USERNAME = '';
  if (user?.name && user?.name !== undefined) {
    if (user.name?.includes(' ')) {
      USERNAME =
        user.name.split(' ').length >= 2
          ? user.name.split(' ')[0] +
            ' ' +
            user.name.split(' ')[user.name.split(' ').length - 1]
          : user.name;
    } else {
      USERNAME = user.name;
    }
  }
  return USERNAME;
};

/**
 * For testing dynamic links
 */
export async function buildLink() {
  // const testProgram = 'https://contact.eg/program=REFERRAL';
  // const testProduct = 'https://contact.eg/product=1';
  // const testMerchant = 'https://contact.eg/merchant=1';
  const testScreen = 'https://contact.eg/screen=manageMyInstallments';

  try {
    const link = await dynamicLinks().buildLink({
      link: testScreen,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://contacteg.page.link',
      android: {
        packageName: 'eg.contact',
      },
      ios: {
        bundleId: 'eg.contact',
      },
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
    });
    Clipboard.setString(link);
    console.log('Built link', link);
  } catch (e) {
    console.log('error', e);
  }
}

/**
 * function to mix contact offers (general offers) and merchant offers in one array
 * @param generalMerchantOffers
 * @param generalOffer
 * @param setOffers setting offers to state
 * @returns
 */
export const mixOffersData = (
  generalMerchantOffers,
  generalOffer,
  setOffers?,
) => {
  let newArray = [];
  generalMerchantOffers &&
    generalMerchantOffers?.map(item => {
      newArray.push({
        id: item.id,
        title: item?.Title,
        image: item?.Image,
        description: item.Description,
        merchantName: item?.merchantName,
        expireDate: item?.expiryDate
          ? item?.expiryDate.replace('-', '/').replace('-', '/')
          : '',
        merchantOffer: true,
        ...item,
      });
    });

  generalOffer &&
    generalOffer?.map(item => {
      newArray.push({
        id: item.id,
        title: item.Title,
        image: item.Image,
        description: item.Description,
        merchantName: item?.Merchant,
        expireDate: item?.ExpiryDate
          ? formatExpiryDateOffer(item?.ExpiryDate)
          : '',
        ...item,
      });
    });

  if (setOffers) {
    setOffers(newArray);
  } else {
    return newArray;
  }
};

export const offersDataSearch = generalMerchantOffers => {
  let newArray = [];
  generalMerchantOffers &&
    generalMerchantOffers?.map(item => {
      newArray.push({
        id: item.id,
        title: item?.title,
        image: item?.image,
        description: item.description,
        merchantName: item?.merchantName,
        expireDate: item?.expiryDate
          ? item?.expiryDate.replace('-', '/').replace('-', '/')
          : '',
        merchantOffer: true,
        ...item,
      });
    });

  return newArray;
};

export const mixSearchServices = (
  programsData,
  productsData,
  translate,
  setServices?,
) => {
  let newArray = [];

  programsData &&
    programsData?.map(item => {
      if (item?.id !== 'REFERRAL' && item?.id !== 'REWARDS') {
        newArray.push({
          id: item.id,
          title: item.title,
          cname: item.id,
          image: item.imageUrl,
          description: item.description,
          type: 'program',
          ...item,
        });
      }
    });
  productsData &&
    productsData?.map(item => {
      if (item?.name !== 'Finishing' && item?.name !== 'Shopping') {
        newArray.push({
          id: item.id,
          title: translate('GENERAL_PRODUCT_' + item.name.toUpperCase()),
          cname: item.name,
          image: item.backgroundImage,
          description: item.description,
          type: 'product',
          ...item,
        });
      }
    });
  if (setServices) {
    setServices(newArray);
  } else {
    return newArray;
  }
};

export const splitArray = (arr, chunkSize) => {
  let result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    let chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
};

export const sendNotificationsInChunks = async (
  toBeSent,
  chunkSize,
  stores,
) => {
  const chunks = splitArray(toBeSent, chunkSize);
  let failedNotifications = [];

  for (const chunk of chunks) {
    try {
      const notiStatus = await Promise.all(
        stores.backend.users.sendUserNotifications(chunk),
      );

      notiStatus.forEach((status, index) => {
        if (!status.status) {
          failedNotifications.push(chunk[index]);
        }
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      failedNotifications = failedNotifications.concat(chunk);
    }
  }

  return failedNotifications;
};

const sendAllNotifications = async (stores, toBeSent, chunkSize = 50) => {
  let failedNotifications = await sendNotificationsInChunks(
    toBeSent,
    chunkSize,
    stores,
  );

  if (failedNotifications.length > 0) {
    await sendNotificationsInChunks(failedNotifications, chunkSize, stores);
  } else {
    console.log('All notifications sent successfully!');
  }
};

export const SendMoEngageNotifications = async stores => {
  let inboxData: any = await MoEReactInbox.fetchAllMessages();
  if (inboxData?.messages && inboxData?.messages.length > 0) {
    let toBeSent: {}[] = [];
    inboxData?.messages?.map((item: notificationInterface) => {
      const notificationObject = {
        moenageId: item?.id,
        action: item?.action ?? [],
        textContent: item?.textContent ?? {},
        media: item?.media ?? {},
        payload: item?.payload ?? {},
        ...item,
      };
      toBeSent.push(notificationObject);
    });

    sendAllNotifications(stores, toBeSent).then(() => {
      inboxData?.messages?.map(item => {
        MoEReactInbox.deleteMessage(item);
      });

      stores.backend.users.getUserNotificationsBadgesCount();
    });
  }
};

/**
 *
 * @param stores
 * @param setToView
 * @returns 'rejected' | 'creditNowActivated'|'noCredit'|
 */

//OLD
// export const checkUserInstantApprovalStatus = async (stores, setToView) => {
//   const user = stores.backend.users.userData;
//   const userCredit = stores.backend.users.userCredits.data;
//   const instantApprovalStatus =
//     stores.backend.instantApproval.instantApprovalStatus;
//   setToView('loading');
//   if (user?.nationalId) {
//     let userInstantStatus = null;
//     try {
//       userInstantStatus = instantApprovalStatus
//         ? instantApprovalStatus
//         : await stores.backend.instantApproval.validateNationalIdExistence(
//           user.nationalId,
//           user.phone,
//         );
//     } catch (e) {
//       setToView(null);
//       return null;
//     }
//     if (userInstantStatus?.clientStatus) {
//       setToView(`promoCode ${userInstantStatus?.clientStatus}`);
//     } else if (userInstantStatus?.mobile || userInstantStatus?.nationalId) {
//       if (userInstantStatus?.limit === 0 && userInstantStatus?.rejectedFromOtherProducts === 'true') {
//         // this user is rejected
//         // rejection logic here
//         setToView('rejected');
//         return 'rejected';
//       } else {
//         // this user got limit
//         // is he activated ?
//         if (user?.isEligible || !userInstantStatus?.signed) {
//           setToView('creditNotActivated');
//           return 'creditNotActivated';
//         } else if (
//           (userCredit[0]?.limit || userInstantStatus?.signed) &&
//           !user?.isEligible
//         ) {
//           setToView('creditActivated');
//           return 'creditActivated';
//         } else {
//           if (userInstantStatus?.rejectedFromOtherProduct === 'false') {
//             setToView('rejected');
//             return 'rejected';
//           } else {
//             setToView('noCredit');
//             return 'noCredit';
//           }
//         }
//       }
//     } else {
//       if (userInstantStatus?.rejectedFromOtherProducts === 'true') {
//         setToView('rejected');
//         return 'rejected';
//       } else {
//         setToView('noCredit');
//         return 'noCredit';
//       }
//     }
//   } else {
//     // still there is a logic to implement
//     let userInstantStatus = null;
//     try {
//       userInstantStatus = instantApprovalStatus
//         ? instantApprovalStatus
//         : await stores.backend.instantApproval.validateNationalIdExistence(
//           '22222222222222',
//           user.phone,
//         );
//     } catch (e) {
//       setToView(null);
//       return null;
//     }
//     if (userInstantStatus?.mobile) {
//       if (userInstantStatus?.limit === 0 && userInstantStatus?.rejectedFromOtherProducts === 'true') {
//         // this user is rejected
//         // rejection logic here
//         setToView('rejected');
//         return 'rejected';
//       } else {
//         // this user got limit
//         // is he activated ?
//         if (user?.isEligible || !userInstantStatus?.signed) {
//           setToView('creditNotActivated');
//           return 'creditNotActivated';
//         }
//         // else if (userInstantStatus?.rejectedFromOtherProducts) {
//         //   setToView('rejected');
//         //   return 'rejected';
//         // }
//         else if (userInstantStatus?.signed && !user?.isEligible) {
//           setToView('creditActivated');
//           return 'creditActivated';
//         } else {
//           if (userInstantStatus?.rejectedFromOtherProducts === 'true') {
//             setToView('rejected');
//             return 'rejected';
//           } else {
//             setToView('noCredit');
//             return 'noCredit';
//           }
//         }
//       }
//     } else {
//       if (userInstantStatus?.rejectedFromOtherProducts === 'true') {
//         setToView('rejected');
//         return 'rejected';
//       } else {
//         setToView('noCredit');
//         return 'noCredit';
//       }
//     }
//   }
// };

//NEW
export const checkUserInstantApprovalStatus = async (stores, setToView) => {
  const user = stores.backend.users.userData;
  const userCredit = stores.backend.users.userCredits.data;
  const instantApprovalStatus =
    stores.backend.instantApproval.instantApprovalStatus;

  setToView('loading');

  const validateNationalIdExistence = async (nationalId, phone) => {
    try {
      return await stores.backend.instantApproval.validateNationalIdExistence(
        nationalId,
        phone,
      );
    } catch (e) {
      setToView(null);
      return null;
    }
  };

  const handleUserStatus = status => {
    if (status.clientStatus) {
      setToView(`promoCode ${status.clientStatus}`);
    } else if (status.mobile || status.nationalId) {
      if (status.limit === 0 && status.rejectedFromOtherProducts === 'true') {
        setToView('rejected');
        return 'rejected';
      } else if (status.limit === 0) {
        setToView('rejected');
        return 'rejected';
      } else if (!status.signed) {
        setToView('creditNotActivated');
        return 'creditNotActivated';
      } else if (userCredit[0]?.limit || status.signed) {
        setToView('creditActivated');
        return 'creditActivated';
      } else if (status.rejectedFromOtherProduct === 'false') {
        setToView('rejected');
        return 'rejected';
      } else {
        setToView('noCredit');
        return 'noCredit';
      }
    } else if (status.rejectedFromOtherProducts === 'true') {
      setToView('rejected');
      return 'rejected';
    } else {
      setToView('noCredit');
      return 'noCredit';
    }
  };

  if (user?.nationalId) {
    const userInstantStatus =
      instantApprovalStatus ||
      (await validateNationalIdExistence(user.nationalId, user.phone));
    return handleUserStatus(userInstantStatus);
  } else {
    const userInstantStatus =
      instantApprovalStatus ||
      (await validateNationalIdExistence('22222222222222', user.phone));
    return handleUserStatus(userInstantStatus);
  }
};

export const formatDueDateText = (date: string) => {
  // format dd/mm/yyyy to be mmth of each month
  const dateArray = date.split('/');
  const month = parseInt(dateArray[0]);
  return `${month}${I18nManager.isRTL ? 'من' : 'th'}`;
};

export const returnArabicMonthName = (month: number) => {
  if (month) {
    if (month > 10) {
      return 'شهر';
    } else {
      if (month === 1) {
        return 'شهر';
      } else if (month === 2) {
        return 'شهرين';
      } else {
        return 'شهور';
      }
    }
  }
};

/**
 *
 * @param props  programsData, productsData, translate, setProgramsProducts
 * @returns array with products and programs in a specific order
 */
export const mixServicesData = (
  programsData,
  productsData,
  translate,
  setProgramsProducts,
) => {
  let newArray = [];

  programsData &&
    programsData?.map(item => {
      // if (item?.id !== 'REFERRAL' && item?.id !== 'REWARDS') {
      if (
        item?.id.toLowerCase() !== 'referral' &&
        item?.id.toLowerCase() !== 'rewards'
      ) {
        newArray.push({
          id: item.id,
          title: item.title,
          cname: item.id,
          image: item.imageUrl,
          description: item.description,
          type: 'program',
          ...item,
        });
      }
    });
  productsData &&
    productsData?.map(item => {
      // if (item?.name !== 'Finishing' && item?.name !== 'Shopping') {
      if (
        item?.name.toLowerCase() !== 'finishing' &&
        item?.name.toLowerCase() !== 'shopping'
      ) {
        newArray.push({
          id: item.id,
          title: translate('GENERAL_PRODUCT_' + item.name.toUpperCase()),
          cname: item.name,
          image: item.backgroundImage,
          description: item.description,
          type: 'product',
          ...item,
        });
      }
    });
  let sortedArray = [];
  newArray?.map(item => {
    switch (item?.cname.toLowerCase()) {
      case 'auto':
        //  sortedArray?.splice(0, 0, item);
        sortedArray[0] = item;
        break;

      // case 'Shopping':
      // sortedArray[1] = item;
      //  sortedArray?.splice(1, 0, item);

      // break;

      case 'clubs':
        sortedArray[1] = item;
        // sortedArray?.splice(2, 0, item);
        break;

      case 'wedding':
        sortedArray[2] = item;
        // sortedArray?.splice(3, 0, item);
        break;

      case 'education':
        sortedArray[3] = item;
        // sortedArray?.splice(4, 0, item);
        break;

      case 'homes':
        sortedArray[4] = item;
        // sortedArray?.splice(5, 0, item);
        break;

      case 'trucks':
        sortedArray[5] = item;
        // sortedArray?.splice(6, 0, item);
        break;

      case 'mortgage':
        sortedArray[6] = item;
        // sortedArray?.splice(7, 0, item);
        break;

      case 'brokerage':
        sortedArray[7] = item;
        // sortedArray?.splice(8, 0, item);
        break;

      case 'leasing':
        sortedArray[8] = item;
        // sortedArray?.splice(8, 0, item);
        break;

      // case 'Factoring':
      //   sortedArray[9] = item;
      //   // sortedArray?.splice(8, 0, item);
      //   break;

      case 'green_finance':
        sortedArray[9] = item;
        // sortedArray?.splice(8, 0, item);
        break;

      default:
        break;
    }
  });
  setProgramsProducts(sortedArray);
  //concat two arrays
};

export const checkTrackingForIOS = async () => {
  let status = false;
  status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    .then(result => {
      if (result === 'granted') {
        return true;
      }
    })
    .catch(err => {
      console.log('err: ', err);
      return false;
    });
  return status;
};

export const acceptAppTrackPermissions = async () => {
  check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    .then(status => {
      status === 'denied'
        ? request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
            .then(async status => {
              console.log('request status: ', status);
            })
            .catch(err => {
              console.log('err: ', err);
            })
        : null;
    })
    .catch(err => {
      console.log('err: ', err);
    });
};

export const getRejectionData = (rejectionReason: string) => {
  let returnedValue = null;

  switch (rejectionReason) {
    case 'Out-of-sourcing areas':
    case 'Below minimum 3000 limit':
    case 'Model score is less than 50%':
    case 'Below minimum assumed income EGP 2.4K':
    case 'Negative profession / job sector':
    case 'IScore AI score less than 50%':
      returnedValue = 1;
      break;

    case 'Bad Credit History in Iscore (exceeding buckets threshold)':
    case 'Avaliable debt burden is less than EGP 500':
    case 'Current overdue amount is greater than EGP 400 in Iscore':
    case 'Negative listed or reported legal actions in Iscore':
    case 'Bad Credit History in Contact (exceeding buckets threshold)':
    case 'Blacklisted in Contact':
      returnedValue = 2;
      break;

    case 'Below minimum age / exceed maximum age':
      returnedValue = 3;
      break;

    case 'Current overdue amount is greater than EGP 400 in Contact':
      returnedValue = 4;
      break;

    default:
      returnedValue = 1;
      break;
  }
  return returnedValue;
};

export const hasLink = text => {
  const regex = /https?:\/\/[^\s]+/g;
  const match = text?.match(regex);
  return match ? match[0] : null;
};

export const hasHuaweiMobileServices = async () => {
  const hasHMS = await DeviceInfo.hasHms();
  console.log('Is your device running Huawei Mobile Services?', hasHMS);
  return hasHMS;
};

export const hasGoogleMobileServices = async () => {
  const hasGMS = await DeviceInfo.hasGms();
  console.log('Is your device running Google Mobile Services?', hasGMS);
  return hasGMS;
};

export const handleHmsLinking = msg => {
  const linkData = linksKeys.filter(item => msg?.hasOwnProperty(item))[0];
  return [linkData, msg[linkData]];
};

export const handleDynamicLink = async (
  options: {link?; hmsData?; customDynamicLink?: {key; value}},
  stores,
  translate,
  navigation,
) => {
  const navigateToScreenWithParams = async (screenName, params, item) => {
    item?.title &&
      ApplicationAnalytics(
        {
          eventKey: screenName,
          type: 'CTA',
          parameters: {name: item?.title},
        },
        stores,
      );
    navigation.navigate(screenName, params);
  };

  const {controlLoginModalView} = stores.backend.users;
  const userData = stores?.backend?.users?.userData;
  const accessToken = stores.backend.auth.getAccessToken();
  const refreshToken = stores.backend.auth.getRefreshToken();
  const quickPayUrl = `${contactPayIframeURL}/?lang=${
    I18nManager.isRTL ? 'ar' : 'en'
  }&phone=${userData?.phone}&nationalId=${userData?.nationalId}&name=${
    userData?.name
  }&token=${accessToken}&refreshToken=${refreshToken}&quickPay=true`;

  let key;

  if (options?.link) {
    let splitLink = options?.link.split('/');
    key = splitLink[splitLink.length - 1]?.split('=');
  } else if (options?.customDynamicLink) {
    key = [options?.customDynamicLink?.key, options?.customDynamicLink?.value];
  } else {
    key = handleHmsLinking(options?.hmsData);
  }

  switch (key[0]?.toLowerCase()) {
    case 'product':
      try {
        const product = await stores.backend.products.getProductByIdServer(
          key[1],
        );
        navigation.navigate('serviceScreen', {
          service: {
            id: product.id,
            title: translate('GENERAL_PRODUCT_' + product.name.toUpperCase()),
            cname: product.name,
            image: product.backgroundImage,
            description: product.description,
            type: 'product',
            ...product,
          },
        });
      } catch (e) {}
      break;

    case 'cashback':
      try {
        navigation.navigate('loyalPoints', {
          fromDynamicLink: true,
        });
      } catch (err) {}
      break;
    case 'program':
      try {
        const program = await stores.backend.programs.getProgramById(key[1]);
        navigation.navigate('serviceScreen', {
          service: {
            id: program.id,
            title: program.title,
            cname: program.id,
            image: program.imageUrl,
            description: program.description,
            type: 'program',
            ...program,
          },
        });
      } catch (e) {}
      break;
    case 'categorysearch':
      navigation.navigate('shopFromMerchants', {
        dynamicLink: true,
        merchantCategoryId: key[1],
      });
      break;
    case 'merchant':
      try {
        const merchant = await stores.backend.wallet.getMerchantByIdServer(
          key[1],
        );
        let newItem;
        if (!merchant?.hasOwnProperty('Image')) {
          newItem = {
            title: merchant.title,
            image: merchant.imageUrl,
            Description: merchant.description,
            ...merchant,
          };
        } else {
          newItem = {
            title: merchant.Title,
            image: merchant.Image,
            ...merchant,
          };
        }
        navigateToScreenWithParams(
          'merchantDetails',
          {merchant: newItem},
          newItem,
        );
      } catch (e) {}
      break;
    case 'exclusiveforyou':
      navigation.navigate('articleDetails', {key: key[1]});
      break;
    case 'offer':
      navigation.navigate('offerDetails', {
        key: +key[1],
        dynamicLink: true,
      });
      break;
    case 'screen':
      switch (key[1]) {
        case 'loyaltypoints':
          navigation.navigate('loyalPoints');
          break;
        case 'manageMyInstallments':
          navigation.navigate('manageMyInstallments');
          break;
        case 'digitalFatorty':
          navigation.navigate('digitalFatorty');
          break;
        case 'quickPay':
          navigation.navigate('quickPay');
          break;
        case 'manageCreditScreen':
          navigation.navigate('manageCredit');
          break;
        case 'billPayment':
          controlLoginModalView(true, () => navigation.navigate('billPayment'));
          break;
        case 'offers':
          navigation.navigate('latestOffers', {dynamicLink: true});
          break;
        case 'services':
          navigation.navigate('ourServices', {
            data: null,
            dynamicLink: true,
          });
          break;
        case 'allMerchants':
          navigation.navigate('shopFromMerchants');
          break;
        case 'search':
          navigation.navigate('search');
          break;
        case 'contactBranches':
          await stores.backend.general.branches.fetch();
          navigation.navigate('branches', {
            data: stores.backend.general.branches.data,
          });
          break;
        case 'contactUs':
          navigation.navigate('customerSupport');
          break;
        case 'increaseLimit':
          navigation.navigate('creditUpgrade', {title: 'Increase limit'});
          break;
        case 'payToOthers':
          navigation.navigate('payToOthers');
          break;
        case 'manageMyBills':
          navigation.navigate('manageMyBills');
          break;
        case 'quickPayBillPayment':
          navigation.navigate('billPayment', {link: quickPayUrl});
          break;
        case 'permissionsDisclaimer':
          navigation.navigate('permissionsDisclaimer');
          break;
        case 'home':
          navigation.navigate('home');
          break;
        case 'creditUpgrade':
          navigation.navigate('creditUpgrade', {title: 'Normal'});
          break;
        case 'blueNovember':
          navigation.navigate('blueNovember');
          break;
        case 'bookingAuthentication':
          navigation.navigate('bookingAuthentication');
          break;
      }
      break;

    default:
      break;
  }
  try {
    stores.backend.users.setDynamicLink('');
  } catch (e) {}
};
export const complexHash = (value, key) => {
  let hash = 0;
  // Perform a more complex hashing operation using each character in the value and key
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
  }
  for (let i = 0; i < key.length; i++) {
    const charCode = key.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
  }
  // Convert the hash to a 32-character hexadecimal string
  const hexHash = (hash >>> 0).toString(16);
  // Generate a random 15-character string consisting of letters
  const randomLettersLeft = [...Array(15)]
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  const randomLettersRight = [...Array(15)]
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  // Combine the random letters, '.', hash, and '$' to create the final signature
  const signature = `${randomLettersLeft}.${hexHash}.$${randomLettersRight}`;
  return signature;
};

export const getJWT = async (body?) => {
  const jwtToken = await sign(
    {
      exp: new Date().getTime() + 60 * 60 * 1000,
      // additional: body,
    },
    Settings.config.JWT_KEY,
    {
      alg: 'HS256',
    },
  );

  return jwtToken;
};

export const createCryptoSign = (value: any) => {
  const privateKey = `${Settings.config.PRIVATE_KEY}`;

  // 1- Create a sign object
  const h = "crypto.createSign('sha256');";
  let data: string;

  try {
    data = JSON.stringify(value);
  } catch (error) {
    data = '{}';
  }
  // 2-  Add data to sign
  // h.update(data);

  // 3- Sign the data and encode in desired format (e.g., hex)
  // const signature = h.sign(privateKey, 'hex');

  return 'signature';
};

export const checkRootAccess = async () => {
  try {
    // const isRooted = await RootBeer.isRooted();
    // const isRootedWithBusyBoxCheck = await RootBeer.isRootedWithBusyBoxCheck();
    // // Return true if the device is rooted or not
    // if (isRooted || isRootedWithBusyBoxCheck) {
    //   return true;
    // } else {

    // }
    return false;
  } catch (error) {
    console.error('Error while checking root access:', error);
    return false;
  }
};

export const checkVersion = async (CodePush, setGoInApp) => {
  const [metaData] = await Promise.all([CodePush.getUpdateMetadata()]);
  console.log('MetaData', metaData.appVersion, metaData.label.substring(1));
  const data = {
    platform: Platform.OS,
    versionNumber: `${metaData.appVersion}`,
    codePushVersion: `${metaData.label.substring(1)}`,
  };
  const JWTToken = await getJWT();
  CodePush.checkForUpdate()
    .then(async update => {
      if (!update) {
        const cryptoSign = createCryptoSign({
          platform: Platform.OS,
          versionNumber: `${metaData.appVersion}`,
          codePushVersion: `${metaData.label.substring(1)}`,
        });
        //"in latest update"
        try {
          const response = await Axios.post(
            `${Settings.config.BASE_URL}/auth/validate-version`,
            {
              platform: Platform.OS,
              versionNumber: `${metaData.appVersion}`,
              codePushVersion: `${metaData.label.substring(1)}`,
            },
            {
              headers: {
                //'x-signature': JWTToken,
                'x-signature': cryptoSign,
              },
            },
          );
          setGoInApp(true);
          console.log('response in try ', response);
        } catch ({response}) {
          console.log(
            'error from contact server in validate-version: ',
            response,
          );
          setGoInApp(false);
        }
      }
    })
    .catch(async () => {
      const cryptoSign = createCryptoSign({
        platform: Platform.OS,
        versionNumber: `${metaData.appVersion}`,
        codePushVersion: `${metaData.label.substring(1)}`,
      });
      try {
        console.log('in .catch try');
        const response = await Axios.post(
          `${Settings.config.BASE_URL}/auth/validate-version`,
          {
            platform: Platform.OS,
            versionNumber: `${metaData.appVersion}`,
            codePushVersion: `${metaData.label.substring(1)}`,
          },
          {
            headers: {
              // 'x-signature': JWTToken,
              'x-signature': cryptoSign,
            },
          },
        );
        setGoInApp(true);
        console.log('user pull the update', response);
      } catch ({response}) {
        console.log("Error: user didn't pull the update ", response);
        setGoInApp(false);
        if (response?.data?.message?.msg == 'version does not supported') {
          Alert.alert(
            '',
            tempTranslate(
              "Sorry, you don't have the latest version. Please update the app now and try again. Thank you!",
              ' عذرًا، يبدو أنك لم تقم بتحديث التطبيق إلى أحدث إصدار. نرجو منك تحديث التطبيق الآن والمحاولة مرة أخرى. شكرًا لك!',
            ),
          );
        }
      }
    });
};

/**
 *
 * @returns { available: 'if device support any type of biometric', type: 'type of supported biometric even 'touch' or 'face'' }
 */

export const checkBiometric = async () => {
  const {biometryType} = await rnBiometrics.isSensorAvailable();

  const empty = {available: false, type: null};

  if (Platform.OS === 'ios') {
    if (biometryType === BiometryTypes.FaceID)
      return {available: true, type: 'face'};
    else if (biometryType === BiometryTypes.TouchID)
      return {available: true, type: 'touch'};
    else return empty;
  } else if (Platform.OS === 'android') {
    if (biometryType === BiometryTypes.Biometrics) {
      return {available: true, type: 'touch'};
    } else return empty;
  } else return empty;
};

/**
 * clear biometric keys form device & remove registered biometric phone
 */

export const clearBiometric = () => {
  console.log('clearBiometric');
  AsyncStorage.removeItem('hasBiometric');
  rnBiometrics.deleteKeys();
  console.log('clearBiometric Done');
};

/**
 * @param translate it is used for get translation
 * @param screenName tne name of screen which called this fun to save as event for analytics
 * @param phoneNumber the number of phone that will be registered to biometric
 * @param stores to call BE apis to send biometric key
 * @param setIsLoading set state to stop loading after create finish
 * @param setUserStoredPhone set state to set registered phone
 * @param navigation navigate after create biometric successfully or login by biometric
 */

export const createBiometricKey = (
  translate,
  screenName,
  phoneNumber,
  stores,
  setIsLoading,
  navigation,
  setUserStoredPhone?,
) => {
  console.log('createBiometricKey', phoneNumber);
  rnBiometrics.createKeys().then(async resultObject => {
    // this is a private key not public
    const {publicKey} = resultObject;
    try {
      setIsLoading(true);
      await stores.backend.auth.SendBiometricPrivateKey(
        phoneNumber?.slice(2),
        publicKey,
      );
      console.log('createBiometricKey after store');
      AsyncStorage.setItem('hasBiometric', `+2${phoneNumber?.slice(2)}`);
      setUserStoredPhone
        ? setUserStoredPhone(`+2${phoneNumber?.slice(2)}`)
        : null;
      ApplicationAnalytics(
        {
          eventKey: screenName,
          type: 'STATUS',
          parameters: {statusName: 'Successful_Biometric_activation'},
        },
        stores,
      );
      console.log('createBiometricKey DONE');
      navigation && navigation.resetTo({name: 'home'});
    } catch (err) {
      console.log('createBiometricKey Error', err);
      clearBiometric();
      setUserStoredPhone ? setUserStoredPhone('') : null;
      ApplicationAnalytics(
        {
          eventKey: screenName,
          type: 'STATUS',
          parameters: {statusName: 'Failed_Biometric_activation'},
        },
        stores,
      );
      stores.backend.auth.setAccessToken('');
      Alert.alert('', translate('ERROR'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    } finally {
      setIsLoading(false);
    }
  });
};

export const getInstalledApps = () => {
  return AppInstalledChecker.checkAllPackages(AppInstalledChecker.getAppList());
};

export const truncateWithEllipses = (text, maxLength) => {
  if (text?.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
};
export const getTextColor = value => (value ? '#294BA0' : '#9B9B9B');

// Enhancements: for better version of this function
// TODO: DRY Principle (Don't Repeat Yourself): Avoid repeating the same logic for different banners. (using factory function [createBanner])
// TODO: Constants for IDs and Events: Use constants for IDs and event keys to avoid normal numbers and strings variables.
// TODO: Handle case if offer is not exists in the [offers]
// TODO: Handle case if banner Don't lead you to OfferDetails screen it's only lead to another screen
export const getAllBanners = (navigation, offers, stores, type): Banner[] => {
  const Jumia_Offer_29_8: Banner = {
    img: home.Jumia_Offer_29_8,
    onPress: () => {
      ApplicationAnalytics(
        {
          eventKey: 'Jumia_Banner_29/8_Pressed',
          type: 'CTA',
          parameters: {ScreenName: navigation?.navigate.name},
        },
        stores,
      );
      const jumiaOffer_29_8 = offers.find(({id}) => id === 425);
      navigation.navigate('offerDetails', {offer: jumiaOffer_29_8});
    },
  };
  const arabiaBanner: Banner = {
    img: creditech.arabiaBanner,
    onPress: () => {
      ApplicationAnalytics(
        {
          eventKey: 'arabiaBanner_Pressed',
          type: 'CTA',
          parameters: {ScreenName: 'Home'},
        },
        stores,
      );
      const arabiaMallBanner = offers.find(({id}) => id === 430);
      navigation.navigate('offerDetails', {offer: arabiaMallBanner});
    },
  };
  const VF_Offer: Banner = {
    img: home.vfOffer,
    onPress: () => {
      ApplicationAnalytics(
        {
          eventKey: 'VF_Offer_Banner_Pressed',
          type: 'CTA',
          parameters: {ScreenName: navigation?.navigate.name},
        },
        stores,
      );
      const VFOneOffer = offers.find(({id}) => id === 83);
      navigation.navigate('offerDetails', {offer: VFOneOffer});
    },
  };

  const cashBackOffer10Banner: Banner = {
    img: home.cashBackOffer10Banner,
    onPress: () => {
      ApplicationAnalytics(
        {
          eventKey: 'CashBack_Banner_Pressed',
          type: 'CTA',
          parameters: {ScreenName: 'Home'},
        },
        stores,
      );
      const JumiaOffer = offers.find(({id}) => id === 352);
      navigation.navigate('offerDetails', {offer: JumiaOffer});
    },
  };

  const digitalFatortyNewBanner: Banner = {
    img: I18nManager.isRTL
      ? creditech.digitalFatortyNewBannerAr
      : creditech.digitalFatortyNewBannerEn,
    onPress: () => {
      ApplicationAnalytics(
        {
          eventKey: 'Digital_Fatorty_Banner_Pressed',
          type: 'CTA',
          parameters: {ScreenName: 'Home'},
        },
        stores,
      );
      navigation.navigate('digitalFatorty');
    },
  };

  if (type === 'digitalFatorty') {
    return [digitalFatortyNewBanner];
  }
  return [arabiaBanner, Jumia_Offer_29_8, cashBackOffer10Banner, VF_Offer];
};

export const isAnyValueNull = obj => {
  return !Object.values(obj).some(value => value == null);
};

export const shuffleArray = () => {
  // const shuffled = [...HomeMerchants];
  const shuffled = [...BookingMerchants];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
};

// Example usage
// const myArray = Array.from({ length: 30 }, (_, i) => i + 1); // Create an array of 30 items [1, 2, ..., 30]
// const shuffledArray = shuffleArray(myArray);
// console.log(shuffledArray);

export const convertToHttps = url => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
}

export const checkDateValidity = data => {
  if (!data) {
    return false;
  }

  // Parse release_date (format "YYYY/MM")
  const releaseDateParts = data.release_date.split('/'); // Split "YYYY/MM"
  const releaseDate = new Date(
    parseInt(releaseDateParts[0], 10), // Year
    parseInt(releaseDateParts[1], 10) - 1, // Month (0-based in JS)
    1, // Default to the first day of the month
  );

  // Parse expiry_date (format "YYYY/MM/DD")
  const expiryDateParts = data.expiry_date.split('/'); // Split "YYYY/MM/DD"
  const expiryDate = new Date(
    parseInt(expiryDateParts[0], 10), // Year
    parseInt(expiryDateParts[1], 10) - 1, // Month (0-based in JS)
    parseInt(expiryDateParts[2], 10), // Day
  );

  // Get today's date
  const today = new Date();

  // Check if dates are valid
  if (isNaN(releaseDate.getTime()) || isNaN(expiryDate.getTime())) {
    console.log('Invalid release or expiry date.');
    return false;
  }

  // Calculate the 7-year difference
  const is7Years =
    expiryDate.getFullYear() - releaseDate.getFullYear() === 7 &&
    expiryDate.getMonth() === releaseDate.getMonth();

  // Check if today's date is before the expiry date
  const isBeforeExpiry = today < expiryDate;

  // Return true only if both conditions are met
  const result = is7Years && isBeforeExpiry;
  return result;
};


export const capitalizeFirstChar = str =>
  `${str.charAt(0).toUpperCase() + str.slice(1)}`;

export const handleLargeText = (str, maxLength = 11) =>
  `${str.length - 2 > maxLength ? str.slice(0, 11) + '..' : str}`;
