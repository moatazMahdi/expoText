import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ViewStyle;
  lottieContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    contentContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
    },
    lottieContainer: {
      width: wp(100),
      height: hp(100),
      position: 'absolute',
      alignSelf: 'center',
    },
  };
};

export default StyleSheet.create(styles);
