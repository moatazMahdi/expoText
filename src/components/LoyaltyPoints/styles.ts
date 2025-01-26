import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Dimensions,
} from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  Container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    Container: {
      width: '100%',
      height: 80,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: '#E6E6E6',
      backgroundColor: 'white',
      justifyContent: 'space-between',
      padding: 16,
      flexDirection: 'row',


    },
  };
};

export default StyleSheet.create(styles);
