import { StyleSheet, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  cardCustomStyle: ViewStyle;
}

const styles = (): IStyles => {
  return {
    customCard: {
      width: wp(328)
    },
    calenderView: {
      width: hp(16),
      height: hp(16)
    },
    cardCustomStyle: {
      width: wp(328)
    }
  };
};

export default StyleSheet.create(styles);
