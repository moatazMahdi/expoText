import { StyleSheet, ImageStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  disapprovedImage: ImageStyle;
  container: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
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
      marginBottom: hp(15)
    },
    disapprovedImage: {
      width: wp(122),
      height: hp(122),
      alignSelf: 'center'
    }
  };
};

export default StyleSheet.create(styles);
