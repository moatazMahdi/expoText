import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(42.5)
    }
  };
};

export default StyleSheet.create(styles);
