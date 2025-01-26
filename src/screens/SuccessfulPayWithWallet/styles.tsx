import { StyleSheet } from 'react-native';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {};
};
export default StyleSheet.create(styles);
