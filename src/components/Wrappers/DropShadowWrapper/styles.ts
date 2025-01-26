import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  dropShadowContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    dropShadowContainer: {
      shadowColor: common.azureishWhite,
      shadowOffset: {
        width: 0,
        height: hp(8),
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 4,
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderRadius: 20,
    },
  };
};

export default StyleSheet.create(styles);
