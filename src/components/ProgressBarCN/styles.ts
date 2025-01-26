import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  progressBarContainer: ViewStyle;
  progressBarOuter: ViewStyle;
  progressBarInner: ViewStyle;
  progressBarTextContainer: ViewStyle;
  progressBarText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    progressBarContainer: { width: '100%' },
    progressBarOuter: {
      height: hp(7),
      backgroundColor: common.transparent,
      borderWidth: 1,
      borderColor: common.darkOrange,
      borderRadius: 7.7,
      marginTop: hp(10)
    },
    progressBarInner: {
      backgroundColor: 'transparent',
      height: hp(7),
      position: 'absolute',
      borderRadius: 7.7,
      justifyContent: 'center',
      marginTop: hp(10)
    },
    progressBarTextContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: hp(10)
    },
    progressBarText: {
      fontSize: hp(10),
      fontWeight: '600',
      color: common.darkOrange
    }
  };
};

export default StyleSheet.create(styles);
