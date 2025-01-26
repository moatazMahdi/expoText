import { Dimensions, ViewStyle, TextStyle, ImageStyle, I18nManager, StyleSheet } from 'react-native';

import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

const { width, height } = Dimensions.get('window');
interface IStyles {
  cameraContainer: ViewStyle;
  backContainer: ViewStyle;
  arrow: ViewStyle;
  cameraHint: TextStyle;
  cameraBoxContainer: ViewStyle;
  cameraFrame: ImageStyle;
  button: ViewStyle;
  buttonLabel: TextStyle;
  confirmPhotoContainer: ViewStyle;
  confirmPhotoButton: ViewStyle;
  captureButtonInner: ViewStyle;
  innerHorizontal: ViewStyle;
  innerVertical: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary, common },
    spacing: { spacing }
  } = theme;

  const bh = hp(70);

  return {
    cameraContainer: { flex: 1, justifyContent: 'center' },
    backContainer: {
      position: 'absolute',
      top: spacing(6),
      height: spacing(3),
      marginHorizontal: spacing(2)
      // marginTop: spacing(6)
    },
    arrow: { transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }] },
    cameraHint: {
      // marginTop: height * 0.2,
      textAlign: 'center',
      fontSize: spacing(2.5),
      fontWeight: 'bold',
      color: primary.value
    },
    cameraBoxContainer: {
      alignSelf: 'center',
      width: width * 0.95,
      height: height * 0.3
      // marginTop: spacing(4)
      // borderWidth: spacing(0.5),
      // borderRadius: spacing(1.5),
      // borderColor: primary.value
    },
    cameraFrame: { width: width * 0.95, height: height * 0.3, resizeMode: 'stretch' },
    button: {
      position: 'absolute',
      bottom: spacing(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: bh,
      height: bh,
      borderTopLeftRadius: hp(90),
      borderTopRightRadius: hp(90),
      borderBottomLeftRadius: hp(90),
      borderBottomRightRadius: hp(90),
      backgroundColor: common.white
    },
    buttonLabel: { fontSize: spacing(2.5), color: common.white },
    confirmPhotoContainer: {
      position: 'absolute',
      bottom: spacing(1),
      flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
      justifyContent: 'space-around',
      alignItems: 'center',
      width,
      padding: spacing(2)
    },
    confirmPhotoButton: {
      width: spacing(8),
      height: spacing(8),
      padding: spacing(2),
      borderRadius: spacing(4)
    },
    captureButtonInner: {
      borderWidth: 2,
      borderColor: common.black,
      width: bh - 25,
      height: bh - 25,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    innerHorizontal: {
      width: bh - 25,
      height: hp(15),
      position: 'absolute',
      backgroundColor: common.white
    },
    innerVertical: {
      width: wp(15),
      height: bh - 25,
      position: 'absolute',
      backgroundColor: common.white
    }
  };
};

export default StyleSheet.create(styles);
