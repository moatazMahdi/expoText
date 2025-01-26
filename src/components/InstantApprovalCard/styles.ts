import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  sideImage: ImageStyle;
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      width: wp(343),
      backgroundColor: common.white,
      flexDirection: 'column',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(216, 218, 239, 1)',
      paddingHorizontal: wp(15),
      paddingBottom: hp(15),
      paddingTop: hp(15),
      alignSelf: 'center',
      marginBottom: hp(15),
    },
    sideImage: {
      width: wp(24),
      height: hp(24),
    },
  };
};

export default StyleSheet.create(styles);
