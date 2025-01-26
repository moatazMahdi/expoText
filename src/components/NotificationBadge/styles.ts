import { I18nManager, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  badge: ViewStyle;
  badgeFont: TextStyle;
  userImageStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    badge: {
      width: hp(18),
      height: hp(18),
      borderRadius: hp(20),
      backgroundColor: common.paleRed,
      marginEnd: wp(18),
      justifyContent: 'center',
      alignItems: 'center'
    },
    userImageStyle: {
      position: 'absolute',
      zIndex: 10,
      bottom: hp(18),
      left: I18nManager.isRTL ? hp(-5) : hp(21)
    },
    badgeFont: {
      fontSize: hp(9),
      color: common.backGroundColor
    }
  };
};

export default StyleSheet.create(styles);
