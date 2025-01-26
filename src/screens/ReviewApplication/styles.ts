import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  buttonStyle: ViewStyle;
  planContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      paddingHorizontal: wp(20),
      paddingTop: hp(45)
    },
    buttonStyle: {
      marginVertical: hp(20)
    },
    planContainer: {
      backgroundColor: common.white,
      alignItems: 'flex-start',
      marginTop: hp(14),
      paddingHorizontal: wp(20),
      paddingVertical: hp(30)
    }
  };
};

export default StyleSheet.create(styles);
