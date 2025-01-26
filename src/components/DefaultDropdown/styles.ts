import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { wp } from '../../utils/Dimensions/dimen';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';

interface IStyles {
  container: ViewStyle;
  titleMainView: ViewStyle;
  titleStyle: TextStyle;
  dropDownWrapper: ViewStyle;
  openedDropDownWrapper: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  const { fonts } = Assets;

  return {
    container: {
      marginHorizontal: wp(20),
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    titleMainView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleStyle: {
      fontSize: hp(12),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
    },
    dropDownWrapper: {
      width: '100%',
      height: hp(48),
      alignSelf: 'center',
      borderRadius: hp(20),
      // borderWidth: 1,
      backgroundColor: common.backGroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    openedDropDownWrapper: {
      borderRadius: 0,
      borderTopLeftRadius: hp(20),
      borderTopRightRadius: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
