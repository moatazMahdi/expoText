import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  fieldContainerRadius: ViewStyle;
  fieldContainer: ViewStyle;
  openedFieldContainer: ViewStyle;
  inputContainer: ViewStyle;
  inputView: TextStyle;
  fieldInputText: TextStyle;
  errorMessage: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { common },
    typography: { fontFamily, fontSize },
  } = theme;

  return {
    fieldContainerRadius: {
      borderRadius: hp(16),
    },
    fieldContainer: {
      height: hp(57),
      backgroundColor: common.white,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: common.darkBlue,
      marginVertical: spacing(1),
    },
    openedFieldContainer: {
      borderRadius: 0,
      borderTopLeftRadius: hp(16),
      borderTopRightRadius: hp(16),
    },
    inputView: {
      width: '100%',
      height: hp(57),
      marginHorizontal: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    inputContainer: {
      height: '100%',
      width: '100%',
      borderWidth: 0,
      marginTop: 0,
      backgroundColor: 'transparent',
    },
    fieldInputText: {
      fontSize,
      fontFamily,
      fontWeight: '500',
      color: common.black,
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: 'red',
      marginStart: wp(10),
    },
  };
};

export default StyleSheet.create(styles);
