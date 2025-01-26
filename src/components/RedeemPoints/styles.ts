import { StyleSheet, TextStyle, ImageStyle, Dimensions } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  imageStyle: ImageStyle;
  titleStyle: TextStyle;
}

const styles = (): IStyles => {
  const { width } = Dimensions.get('window');
  return {
    imageStyle: {
      width: width + hp(100),
      height: hp(120),
      alignSelf: 'center',
      marginBottom: hp(20),
      borderRadius: 20,
    },
    titleStyle: {
      fontSize: hp(24),
      letterSpacing: 1,
      fontWeight: '700',
      marginBottom: wp(20),
      textAlign: 'center',
      alignSelf: 'center',
      marginHorizontal: wp(40),
      marginTop: hp(20),
    },
  };
};

export default StyleSheet.create(styles);
