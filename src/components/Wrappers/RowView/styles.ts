import { StyleSheet, ViewStyle } from 'react-native';
interface IStyles {
  container: ViewStyle;
}

const styles = (): IStyles => {
  return {
    container: {
      width: '100%',
      flexDirection: 'row',
    },
  };
};

export default StyleSheet.create(styles);
