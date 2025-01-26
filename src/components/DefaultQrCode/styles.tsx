import { StyleSheet, ViewStyle } from 'react-native';

import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      width: '100%',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
