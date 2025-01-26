import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  inputTitleText: TextStyle;
  nationalIdContainer: ViewStyle;
  errorMessage: TextStyle;
  buttonStyle: ViewStyle;
  buttonTitle: TextStyle;
  inputStyle: ViewStyle | TextStyle;
}

const styles = (): IStyles => {
  return {
    inputTitleText: {
      fontSize: hp(16),
      marginTop: hp(64),
      marginHorizontal: wp(20),
    },
    nationalIdContainer: {
      width: '100%',
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: 'red',
      marginHorizontal: wp(20),
    },
    buttonStyle: {
      height: hp(50),
    },
    buttonTitle: {
      fontSize: hp(16),
      fontWeight: '700',
    },
    inputStyle: { height: hp(50), fontWeight: '500', fontSize: hp(16) },
  };
};

export default StyleSheet.create(styles);
