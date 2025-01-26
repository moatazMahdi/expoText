import { StyleSheet, ViewStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  continueContainerFilled: ViewStyle;
  continueContainerOutlined: ViewStyle;
  backIcon: ViewStyle;
  baseStyle: ViewStyle;
  absoluteStyle: ViewStyle;
  back?: ViewStyle;
  backIconDis?: ViewStyle;
  buttonsContainer?: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { common },
  } = theme;

  return {
    baseStyle: {
      width: wp(60),
      height: wp(60),
      borderRadius: wp(30),
      alignItems: 'center',
      justifyContent: 'center',
      // bottom: hp(55),
      // right: hp(20)
    },
    back: {
      borderWidth: 1,
      borderColor: '#FF8E0A',
    },
    absoluteStyle: {
      // position: 'absolute'
    },
    continueContainerOutlined: {
      backgroundColor: '#FF8E0A',
    },
    continueContainerFilled: {
      borderWidth: 1,
      borderColor: '#FF8E0A',
    },
    backIcon: {
      height: spacing(3),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
      backgroundColor: common.transparent,
    },
    backIconDis: {
      height: spacing(3),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '0deg' : '180deg',
        },
      ],
      backgroundColor: common.transparent,
    },
    buttonsContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
      paddingHorizontal: wp(16),
      paddingBottom: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
