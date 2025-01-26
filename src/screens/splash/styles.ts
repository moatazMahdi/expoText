import { StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { Theme } from 'elephanz-rn-ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IStyles {
  container: ViewStyle;
  backgroundContainer: ViewStyle;

  centerContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { background }
  } = theme;

  return {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    backgroundContainer: {
      ...(StyleSheet.absoluteFill as object),
      backgroundColor: background.value,
      justifyContent: 'center',
      alignItems: 'center'
    },
    centerContainer: {
      width: SCREEN_WIDTH * 0.6,
      minHeight: 200
    }
  };
};

export default StyleSheet.create(styles);
