import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  questionContainer: ViewStyle;
  containerStyle: ViewStyle;
  choicesContainer: ViewStyle;
  rowCenterView: ViewStyle;
  radioButton: ViewStyle;
  smallCircle: ViewStyle;
  choiceStyle: TextStyle;
  correctOrWrong: ViewStyle;
  answerText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

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
    choicesContainer: {
      backgroundColor: common.white,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
    },
    rowCenterView: { alignItems: 'center', flexDirection: 'row' },
    radioButton: {
      width: hp(24),
      height: hp(24),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallCircle: { height: hp(14), width: hp(14), borderRadius: 7 },
    choiceStyle: {
      fontSize: 16,
      fontWeight: '400',
      marginStart: wp(16),
      color: '#1B0330',
    },
    correctOrWrong: {
      flexDirection: 'row',
      paddingHorizontal: wp(10),
      paddingVertical: hp(10),
      alignItems: 'center',
      borderRadius: 20,
    },
    answerText: {
      color: common.white,
      fontWeight: '500',
      marginStart: wp(6),
    },
  };
};

export default StyleSheet.create(styles);
