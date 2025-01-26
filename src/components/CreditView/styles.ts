import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions, Platform } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  cardContainer: ViewStyle;
  textContainer: ViewStyle;
  creditText: TextStyle;
  textShadow: ViewStyle;
  expireText: TextStyle;
  hintText: TextStyle;
  getMorePointsButton: ViewStyle;
  morePointsText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  const width = 247.6;
  return {
    container: {
      shadowColor: '#6B7CFE',
      shadowOffset: {
        width: 0,
        height: hp(9)
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      marginBottom: hp(33)
    },
    cardContainer: {
      width: '100%',
      alignItems: 'center'
    },
    textContainer: {
      height: hp(161),
      paddingLeft: wp(25),
      paddingRight: wp(25),
      paddingTop: hp(20),
      paddingBottom: hp(25)
    },
    creditText: {
      fontSize: hp(46),
      fontWeight: '400',
      color: common.white
      // lineHeight: Platform.OS == 'android' ? hp(46 + 20) : 0
    },
    textShadow: {
      shadowColor: 'rgba(53, 41, 10, 0.34)',

      shadowOffset: {
        width: wp(4),
        height: hp(9)
      },
      shadowOpacity: 1,
      shadowRadius: 10
    },
    expireText: {
      fontSize: hp(12),
      fontWeight: '700',
      color: common.white
    },
    hintText: {
      fontSize: hp(12),
      fontWeight: '400',
      color: common.white,
      marginTop: hp(30)
    },
    getMorePointsButton: {
      width: wp(319),
      height: hp(39),
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: hp(13)
    },
    morePointsText: {
      fontSize: hp(20),
      color: '#ffffff'
    }
  };
};

export default StyleSheet.create(styles);
