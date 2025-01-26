import { StyleSheet, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    container: {
      paddingEnd: wp(13),
      marginTop: hp(16),
      marginBottom: hp(20),
      backgroundColor: 'transparent',
    },
  };
};

export default StyleSheet.create(styles);
