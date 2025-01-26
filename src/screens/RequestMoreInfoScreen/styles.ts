import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  formContainer: ViewStyle;
  form: ViewStyle;
  formContinueButton: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
    spacing: { spacing },
  } = theme;

  return {
    formContainer: {
      marginTop: hp(40),
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2.5),
      flex: 1,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
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
