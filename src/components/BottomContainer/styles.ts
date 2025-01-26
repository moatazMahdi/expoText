import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      paddingTop: hp(22),
      paddingBottom: hp(39),
      paddingHorizontal: wp(16),
      backgroundColor: common.white,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      zIndex: 0,
    },
  };
};

export default StyleSheet.create(styles);
