import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  imageShadow: ImageStyle;
  imageStyle: ImageStyle;
  titleContainer: ViewStyle;
  textInsteadOfImage: ViewStyle;
  textInsteadOfImageFit: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      width: wp(335),
      height: hp(204),
      flexDirection: 'row',
      borderRadius: 20,
      backgroundColor: common.white
    },
    imageShadow: {
      marginVertical: hp(30),
      marginEnd: wp(12)
    },
    imageStyle: {
      width: wp(335),
      height: hp(204),
      borderRadius: 20
    },
    titleContainer: {
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      bottom: hp(20),
      alignSelf: 'center',
      backgroundColor: common.white,
      padding: 10,
      borderRadius: 15,
      borderColor: common.lightBlue,
      marginHorizontal: wp(10)
    },
    textInsteadOfImage: {
      width: wp(335),
      height: hp(204),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInsteadOfImageFit: {
      width: wp(140),
      height: hp(140),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    }
  };
};

export default StyleSheet.create(styles);