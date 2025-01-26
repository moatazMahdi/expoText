import {
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Theme,
} from 'elephanz-rn-ui';

interface IStyles {
  container: ViewStyle;
  progress: ViewStyle;
  updatingText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: {
      primary,
    },
    spacing: {
      spacing,
    },
  } = theme;
  return {
    container: {
      marginVertical: spacing(2),
      alignSelf: 'center',
    },
    progress: {
      height: 5,
      borderRadius: 3,
    },
    updatingText: {
      alignSelf: 'center',
      color: primary.value,
    },
  };
};

export default StyleSheet.create(styles);
