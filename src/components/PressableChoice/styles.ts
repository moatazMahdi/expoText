import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Dimensions,
} from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  categoryCard: ViewStyle;
  categoryText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    categoryCard: {
      borderRadius: 50,
      marginEnd: wp(12),
      backgroundColor: '#F0F4F8',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(110),
      paddingVertical:hp(8)
      // height: hp(40),
    },
    categoryText: {
      fontWeight: '600',
      marginHorizontal: wp(13),
      marginVertical: hp(8),
      fontSize: hp(12),
      alignSelf: 'center',
    },
  };
};

export default StyleSheet.create(styles);
