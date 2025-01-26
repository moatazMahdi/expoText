import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  titleText: TextStyle;
  resetContainer: ViewStyle;
  buttonStyle: ViewStyle;
  filterContainer: ViewStyle;
  quickActionContainer: ViewStyle;
  quickActionText: TextStyle;
  noHistoryText: TextStyle;
  itemStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      flex: 1,
      backgroundColor: common.white
    },
    titleText: {
      fontSize: hp(16),
      // marginBottom: hp(8),
      marginStart: wp(20)
    },
    resetContainer: {
      marginVertical: hp(0)
    },
    buttonStyle: {
      width: wp(100)
    },
    filterContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginStart: 35
    },
    quickActionContainer: {
      // borderRadius: hp(20),
      // borderWidth: 1,
      // borderColor: common.darkBlue,
      paddingHorizontal: wp(10),
      paddingBottom: hp(5),
      // alignItems: 'center',
      // justifyContent: 'center',
      marginHorizontal: wp(25),
      alignSelf: 'flex-start'
      // backgroundColor: 'red',
    },
    quickActionText: {
      fontSize: hp(16),
      color: common.darkBlue
    },
    noHistoryText: {
      alignSelf: 'center',
      textAlign: 'center',
      color: common.grey,
      fontSize: hp(16),
    },
    itemStyle: {
      backgroundColor: common.white,
      marginEnd: hp(20),
      paddingVertical: hp(5)
    }
  };
};

export default StyleSheet.create(styles);
