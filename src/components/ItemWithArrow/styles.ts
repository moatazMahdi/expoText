import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  cardContainer: ViewStyle;
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
      alignSelf: 'center'
    },
    cardContainer: {
      backgroundColor: common.white,
      paddingHorizontal: wp(20),
      paddingVertical: hp(16),
      borderRadius: 29,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };
};

export default StyleSheet.create(styles);
