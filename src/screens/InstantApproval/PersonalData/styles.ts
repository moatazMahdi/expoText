import { StyleSheet, ViewStyle } from 'react-native';

interface IStyles {
  dropdownView: ViewStyle;
}

const styles = (): IStyles => {
  return {
    dropdownView: { width: '90%', flex: 1 },
  };
};

export default StyleSheet.create(styles);
