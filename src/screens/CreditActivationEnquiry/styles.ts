import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ViewStyle;
  disapprovedImage: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
    typography: { fontSize, fontFamily }
  } = theme;

  return {
    contentContainer: {
      padding: hp(20),
      flex: 1
    },
    disapprovedImage: {
      width: wp(300),
      height: hp(300),
      alignSelf: 'center'
    }
  };
};

export default StyleSheet.create(styles);
