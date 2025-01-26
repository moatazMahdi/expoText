import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  planDetailsText: TextStyle;
  titleText: TextStyle;
  benefitsContainer: ViewStyle;
  circleStyle: ViewStyle;
  circleFill: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    cardContainer: {
      width: wp(247),
      padding: 20,
      backgroundColor: common.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.creamyWhite
    },
    titleText: {
      fontSize: hp(16),
      fontWeight: '500',
      color: common.darkBlue
    },
    planDetailsText: {
      fontSize: hp(14),
      lineHeight: hp(25),
      color: common.black,
      marginTop: hp(3)
      // lineHeight: hp(14 + 5)
    },
    benefitsContainer: {
      marginTop: hp(16)
    },
    circleStyle: {
      width: hp(20),
      height: hp(20),
      borderRadius: hp(12),
      borderWidth: 1,
      borderColor: common.darkBlue
    },
    circleFill: {
      backgroundColor: common.darkBlue
    }
  };
};

export default StyleSheet.create(styles);
