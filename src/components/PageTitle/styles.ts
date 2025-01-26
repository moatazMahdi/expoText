import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  titleContainer: ViewStyle;
  titleText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    titleContainer: {
      marginVertical: hp(25),
      marginHorizontal: hp(91),
    },
    titleText: {
      fontSize: hp(24),
      fontWeight: '700',
      color: common.darkBlue,
      alignSelf: 'center',
      textAlign: 'center',
    },
  };
};

export default StyleSheet.create(styles);
