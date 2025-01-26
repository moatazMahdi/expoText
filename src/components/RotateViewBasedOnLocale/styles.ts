import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  rotate: ViewStyle;
  inverseRotate: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    rotate: {
      transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }],
      alignItems: 'center',
      justifyContent: 'center'
    },
    inverseRotate: {
      transform: [{ rotateY: I18nManager.isRTL ? '0deg' : '180deg' }],
      alignItems: 'center',
      justifyContent: 'center'
    }
  };
};

export default StyleSheet.create(styles);
