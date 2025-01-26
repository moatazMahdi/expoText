import { ViewStyle, TextStyle, Dimensions } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IStyles {
  container: ViewStyle;
  imageContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette,
    spacing: { spacing },
  } = theme;

  return {
    container: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingHorizontal: spacing(2),
    },
    imageContainer: {
      width: SCREEN_WIDTH * 0.4,
      minHeight: 150,
    },
  };
};

export default styles;
