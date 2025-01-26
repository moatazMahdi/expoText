import { StyleSheet, ImageStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ImageStyle;
}

const styles = (): IStyles => {
  return {
    contentContainer: {
      padding: hp(20),
      flex: 1,
      justifyContent: 'center',
    },
  };
};

export default StyleSheet.create(styles);
