import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ViewStyle;
  linkView: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    contentContainer: {
      padding: hp(20),
      paddingTop: hp(30)
    },
    linkView: {
      padding: hp(10),
      borderWidth: 1,
      borderRadius: 20,
      borderColor: common.darkBlue,
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginStart: wp(20),
      marginTop: hp(20)
    }
  };
};

export default StyleSheet.create(styles);
