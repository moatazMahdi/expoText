import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  questionContainer: ViewStyle;
  containerStyle: ViewStyle;
  questionStyle: TextStyle;
  buttonStyle: ViewStyle;
  T16_500: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  return {
    questionContainer: {
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      marginHorizontal: wp(20),
    },
    containerStyle: {
      width: '100%',
      borderRadius: 15,
      paddingHorizontal: wp(28),
      paddingVertical: hp(20),
    },
    questionStyle: {
      textAlign: 'center',
      lineHeight: hp(35),
      fontWeight: '500',
      fontSize: 20,
      paddingHorizontal: wp(20),
      color: '#1B0330',
    },
    buttonStyle: { marginTop: 24, height: hp(56), borderRadius: 52 },
    T16_500: { fontWeight: '500', fontSize: 16 },
  };
};

export default StyleSheet.create(styles);
