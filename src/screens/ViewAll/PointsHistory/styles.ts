import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  cardCustomStyle: ViewStyle;
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      flex: 1,
      backgroundColor: common.white,
    },
    customCard: {
      width: wp(328),
    },
    calenderView: {
      width: hp(16),
      height: hp(16),
    },
    cardCustomStyle: {
      width: wp(328),
    },
  };
};

export default StyleSheet.create(styles);
