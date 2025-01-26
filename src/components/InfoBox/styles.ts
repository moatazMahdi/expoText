import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  wrapper: ViewStyle;
  leftBar: ViewStyle;
  icon: ViewStyle;
  text: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  return {
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: hp(8),
      marginHorizontal: wp(8),
      marginBottom: hp(4),
      width: '97%',
    },
    leftBar: {
      borderTopLeftRadius: hp(8),
      borderBottomLeftRadius: hp(8),
      width: wp(5),
      height: '100%',
    },
    container: {
      borderTopEndRadius: hp(8),
      borderBottomEndRadius: hp(8),
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(10),
      paddingHorizontal: wp(10),
      flex: 1,
    },
    icon: {
      marginRight: wp(8),
    },
    text: {
      marginRight: wp(8),
      flexShrink: 1,
    },
  };
};

export default StyleSheet.create(styles);
