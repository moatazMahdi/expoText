import { hp, wp } from 'src/utils/Dimensions/dimen';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';

interface IStyles {
  dropdownView: ViewStyle;
  mainContainer: ViewStyle;
  employmentStatusDescriptionContainer: ViewStyle;
  employmentStatusDescription: TextStyle;
  companySectorsContainer: ViewStyle;
  companyAddress: ViewStyle;
  companyAddressInput: TextStyle;
  continueContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');

  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    dropdownView: { width: '90%', flex: 1 },
    mainContainer: {
      flex: 1,
      marginVertical: hp(20),
    },
    employmentStatusDescriptionContainer: {
      alignSelf: 'center',
    },
    employmentStatusDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      marginBottom: hp(10),
    },
    companySectorsContainer: {
      width: width - wp(40),
      height: hp(60),
      paddingHorizontal: wp(10),
      alignSelf: 'center',
      marginTop: hp(10),
      borderRadius: hp(20),
      borderWidth: 1,
      borderColor: common.darkBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    companyAddress: {
      margin: 0,
      flexDirection: 'column',
    },
    companyAddressInput: {
      width: width - wp(65),
      minHeight: hp(40),
      paddingVertical: hp(10),
      maxHeight: hp(150),
    },
    continueContainer: {
      alignSelf: 'flex-end',
      marginTop: hp(80),
      position: 'relative',
    },
  };
};

export default StyleSheet.create(styles);
