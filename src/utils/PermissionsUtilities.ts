import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { PermissionsAndroid, Platform } from 'react-native';

const { IOS, ANDROID } = PERMISSIONS;

export const PERMISSION_TYPE = {
  camera: Platform.select({
    android: ANDROID.CAMERA,
    ios: IOS.CAMERA,
  }),

  gallery: Platform.select({
    android: ANDROID.READ_EXTERNAL_STORAGE,
    ios: IOS.PHOTO_LIBRARY,
  }),

  storage: Platform.select({
    android: ANDROID.WRITE_EXTERNAL_STORAGE,
  }),

  notification: Platform.select({
    android: ANDROID.POST_NOTIFICATIONS,
  }),

  location: Platform.select({
    android: ANDROID.ACCESS_FINE_LOCATION,
    ios: IOS.LOCATION_WHEN_IN_USE || IOS.LOCATION_ALWAYS,
  }),

  // contact: Platform.select({
  // android: ANDROID.READ_CONTACTS,
  // ios: IOS.CONTACTS,
  // }),
};

export const requestPermission = async (permissionType) => {
  if (!permissionType) return;
  try {
    let result: any = await request(permissionType);

    let permission = [RESULTS.GRANTED, RESULTS.LIMITED].includes(result);
    if (
      Platform.OS === 'android' &&
      Number(Platform?.constants?.Release) >= 10 &&
      !permission &&
      [PERMISSION_TYPE.gallery, PERMISSION_TYPE.storage].includes(
        permissionType,
      )
    ) {
      result = await PermissionsAndroid.request(permissionType);

      permission = [
        RESULTS.GRANTED,
        RESULTS.LIMITED,
        'never_ask_again',
      ].includes(result);
    }

    return permission;
  } catch (error) {
    return false;
  }
};
