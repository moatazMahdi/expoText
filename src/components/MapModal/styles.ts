import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Platform,
} from 'react-native';
import { wp, hp } from '../../utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  inputContainer: ViewStyle;
  searchInputStyle: TextStyle;
  mapContainer: ViewStyle;
  mapStyle: ViewStyle;
  markerImage: ImageStyle;
  modalContainer: ViewStyle;
  searchIcon: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    inputContainer: {
      width: '100%',
      paddingHorizontal: wp(10),
      marginTop: hp(10),
    },
    searchInputStyle: {
      width: wp(325),
      height: hp(50),
      backgroundColor: common.white,
      borderWidth: 1,
      borderColor: common.darkBlue,
      justifyContent: 'center',
      paddingHorizontal: wp(20),
      paddingEnd: wp(45),
      borderRadius: 20,
      fontSize: hp(14),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    searchIcon: {
      position: 'absolute',
      right: wp(18),
      top: hp(9),
    },
    mapContainer: {
      width: wp(325),
      height: hp(425),
      borderRadius: 20,
      overflow: 'hidden',
      borderColor: common.darkBlue,
      borderWidth: 1,
      marginTop: hp(20),
    },
    mapStyle: {
      width: wp(325),
      height: hp(425),
    },
    markerImage: {
      width: Platform.OS === 'android' ? wp(45) : wp(40),
      height: Platform.OS === 'android' ? hp(45) : hp(40),
      top: '43%',
      left: '48%',
      resizeMode: 'contain',
      position: 'absolute',
      alignSelf: 'center',
    },
    modalContainer: {
      width: '100%',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
