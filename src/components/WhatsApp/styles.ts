import { StyleSheet, ViewStyle } from 'react-native';
interface IStyles {
  container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    container: {
      alignSelf: 'center'
    }
  };
};

export default StyleSheet.create(styles);
