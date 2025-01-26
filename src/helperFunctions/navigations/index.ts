import { Linking, Platform } from 'react-native';

const openMap = (lng: number, lat: number, title?: string): void => {
  const scheme = Platform.select({
    ios: 'https://maps.google.com/?q=@',
    android: 'geo:0,0?q='
  });
  const latLng = `${lat},${lng}`;
  const label = title ? title : 'Merchant props';
  const url = Platform.select({
    ios: `${scheme}${latLng}&zoom=14`,
    android: `${scheme}${latLng}(${label})`
  });
  Linking.openURL(`${url}`);
};

export { openMap };
