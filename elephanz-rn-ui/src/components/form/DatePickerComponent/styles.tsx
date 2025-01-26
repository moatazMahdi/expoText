import {
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface StylesInterface {
  container: ViewStyle;
  mainContainer: ViewStyle;
}

export const styles = StyleSheet.create<StylesInterface>({
  container: {
    marginRight: 40,
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 75,
  },
  mainContainer: {
    display: 'none',
  },
});
