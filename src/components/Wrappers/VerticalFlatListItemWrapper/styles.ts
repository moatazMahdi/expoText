import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    container: {
      marginBottom: hp(20),
      paddingTop: hp(5),
      backgroundColor: 'transparent',
    },
  };
};

export default StyleSheet.create(styles);
