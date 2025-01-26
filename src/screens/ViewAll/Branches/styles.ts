import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  cardCustomStyle: ViewStyle;
  sectionTitleText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    customCard: {
      width: wp(328)
    },
    calenderView: {
      width: hp(16),
      height: hp(16)
    },
    cardCustomStyle: {
      width: wp(328)
    },
    sectionTitleText: {
      fontSize: hp(16),
      color: common.black,
      fontFamily: Fonts.regular,
      marginHorizontal: wp(16)
    }
  };
};

export default StyleSheet.create(styles);
