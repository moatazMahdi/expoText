import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ViewStyle;
}

const styles = (): IStyles => {
  return {
    contentContainer: {
      padding: hp(20),
      paddingTop: hp(30),
    },
  };
};

export default StyleSheet.create(styles);
