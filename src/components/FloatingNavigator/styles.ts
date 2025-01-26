import { StyleSheet, ViewStyle, TextStyle, I18nManager, Dimensions, Platform } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  blurView: ViewStyle;
  centerView: ViewStyle;
  navOpened: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  const width = wp(52),
    height = hp(48);
  return {
    container: {
      flexDirection: 'row',
      width: width,
      height: height,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: hp(100),
      alignSelf: 'center',
      borderRadius: 100,
      overflow: Platform.OS != 'ios' ? 'hidden' : 'visible',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6
    },
    blurView: {
      width: width,
      position: 'absolute',
      height: height,
      borderRadius: hp(22)
    },
    navOpened: {
      width: wp(265)
    },
    centerView: {
      backgroundColor: '#fff',
      position: 'absolute',
      width: wp(22),
      height: hp(22),
      bottom: hp(5),
      borderRadius: 100,
      alignSelf: 'center',
      zIndex: -1
    }
  };
};

export default StyleSheet.create(styles);
