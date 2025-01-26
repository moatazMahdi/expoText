import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  formContainer: ViewStyle;
  formContinueButton: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
  } = theme;

  return {
    formContainer: {
      marginTop: hp(40),
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginHorizontal: spacing(2.5),
      flex: 1,
    },
    formContinueButton: {
      flex: 1,
      justifyContent: 'flex-end',
      bottom: 0,
      marginVertical: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
