import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
interface IStyles {
  mainContainer: ViewStyle;
  contentContainer: ViewStyle;
  ViewStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.transparent,
    },
    contentContainer: {
      flexGrow: 1,
      backgroundColor: common.transparent,
    },
    ViewStyle: {
      flex: 1,
    },
  };
};

export default StyleSheet.create(styles);
