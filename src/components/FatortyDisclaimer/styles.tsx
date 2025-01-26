import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  container: ViewStyle;
  textStyle: TextStyle;
  creditMessageContainer: ViewStyle;
  creditMessageText: TextStyle | ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(29)
    },
    textStyle: {
      flex: 1,
      flexWrap: 'wrap',
      fontSize: hp(11),
      color: common.placeHolderText,
      fontWeight: '500',
      marginStart: wp(16),
      alignSelf: 'center',
      lineHeight: hp(17)
    },
    creditMessageContainer: {
      width: '100%',
      backgroundColor: common.backGroundColor,
      borderRadius: 15,
      padding: wp(15),
      marginTop: hp(20)
    },
    creditMessageText: {
      flex: 1,
      flexWrap: 'wrap',
      marginStart: wp(10),
      fontSize: hp(12)
    }
  };
};

export default StyleSheet.create(styles);
