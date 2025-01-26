import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  containerStyle: ViewStyle;
  imageBackground: ImageStyle;
  fatortyBannerStyle: ImageStyle;
}

const styles = (): IStyles => {
  return {
    containerStyle: {
      alignSelf: 'center',
      marginBottom: hp(22),
      borderRadius: wp(16),
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      // elevation: 7,
    },
    imageBackground: {
      height: '100%',
      width: '100%',
      borderRadius: wp(16),
    },
    fatortyBannerStyle: {
      height: hp(84),
      width: wp(339),
      borderRadius: 0,
      marginRight: wp(16),
    },
  };
};

export default StyleSheet.create(styles);
