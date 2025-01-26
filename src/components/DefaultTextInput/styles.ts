import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { wp } from '../../utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';

interface IStyles {
  titleMainView: ViewStyle;
  container: ViewStyle;
  titleStyle: TextStyle;
  textInputStyle: ViewStyle | TextStyle;
  textOnly: ViewStyle | TextStyle;
  textOnlyChanged: ViewStyle | TextStyle;
  editableInput: ViewStyle | TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  const { fonts } = Assets;

  return {
    titleMainView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      marginHorizontal: wp(20),
      marginBottom: hp(-5),
    },
    titleStyle: {
      fontSize: hp(12),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '700',
    },
    textInputStyle: {
      fontSize: hp(14),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.slightDarkBlue,
      fontWeight: '400',
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      paddingVertical: hp(1),
      flex: 1,
    },
    editableInput: {
      height: hp(48),
      borderWidth: 1,
      borderColor: common.darkBlue,
      borderRadius: hp(20),
      paddingHorizontal: wp(10),
      marginBottom: hp(7),
      marginTop: hp(3),
      paddingVertical: hp(5),
      backgroundColor: common.backGroundColor,
    },
    textOnly: {},
    textOnlyChanged: {
      color: common.darkOrange,
    },
  };
};

export default StyleSheet.create(styles);
