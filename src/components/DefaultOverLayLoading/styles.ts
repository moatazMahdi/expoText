import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  withMessageContainer: ViewStyle;
  lottieView: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.1)',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    loadingContainer: {
      width: wp(100),
      height: hp(100),
      backgroundColor: common.white,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    withMessageContainer: {
      width: wp(200),
      height: hp(150),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    lottieView: {
      width: wp(100),
      height: hp(100)
    }
  };
};

export default StyleSheet.create(styles);
