import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    container: {
      width: wp(40),
      height: hp(40),
      backgroundColor: common.darkOrange,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      marginStart: wp(11)
    }
  };
};

export default StyleSheet.create(styles);
