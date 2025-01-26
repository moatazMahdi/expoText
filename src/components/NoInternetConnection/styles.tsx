import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  ViewContainer: ViewStyle;
  textStyle: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;
  return {
    ViewContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      color: common.lightgrey,
    },
  };
};
export default StyleSheet.create(styles);
