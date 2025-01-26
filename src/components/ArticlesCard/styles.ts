import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions, Platform } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  imageStyle: ImageStyle;
  titleStyle: TextStyle;
  descStyle: TextStyle;
  descStyleEn: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  const width = 222.6;
  return {
    cardContainer: {
      width: wp(width),
      overflow: 'hidden',
      borderRadius: 20,
      backgroundColor: common.white
    },
    imageStyle: {
      width: wp(width),
      height: hp(116),
      borderRadius: 20
    },
    titleStyle: {
      fontSize: hp(16),
      fontWeight: '500',
      color: common.darkBlue,
      marginTop: hp(16),
      marginHorizontal: wp(17)
    },
    descStyle: {
      fontSize: hp(12),
      fontWeight: '400',
      marginTop: hp(6),
      marginHorizontal: wp(17),
      color: common.darkBlue
    },
    descStyleEn: {
      fontSize: hp(12),
      fontWeight: '400',
      marginTop: hp(6),
      marginHorizontal: wp(17),
      color: common.darkBlue,
      lineHeight: hp(18)
    }
  };
};

export default StyleSheet.create(styles);
