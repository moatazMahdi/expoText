import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      height: hp(1),
      width: '100%',
      backgroundColor: common.gainsboro
    }
  };
};

export default StyleSheet.create(styles);
