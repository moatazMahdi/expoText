import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  mainContainer: ViewStyle;
  selfieContainer: ViewStyle;
  selfieImage: ImageStyle;
  takeSelfieButtonContainer: ViewStyle;
  selfieButton: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
    },
    selfieContainer: {
      width: hp(270),
      height: hp(270),
      borderRadius: hp(135),
      alignSelf: 'center',
      marginTop: hp(0),
    },
    selfieImage: {
      width: hp(270),
      height: hp(270),
      borderRadius: hp(135),
      resizeMode: 'cover',
    },
    takeSelfieButtonContainer: {
      width: wp(75),
      height: wp(75),
      borderRadius: wp(45),
      backgroundColor: common.white,
      alignSelf: 'center',
      marginTop: hp(30),
      marginBottom: hp(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    selfieButton: {
      width: wp(75),
      height: wp(75),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
