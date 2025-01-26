import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  titleText: TextStyle;
  descriptionText: TextStyle;
  dateText: TextStyle;
  linkText: TextStyle;
  seeMoreText: TextStyle;
  image: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  const { width } = Dimensions.get('window');

  const cardHeight = wp(330);
  return {
    cardContainer: {
      width: width,
      minHeight: hp(122),
      backgroundColor: common.white,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: common.brightGray,
      paddingVertical: hp(16),
      paddingHorizontal: wp(24)
    },
    titleText: {
      fontSize: hp(16),
      fontWeight: '500',
      color: common.darkBlue
    },
    descriptionText: {
      fontSize: hp(12),
      fontWeight: '400',
      lineHeight: hp(22),
      color: common.black,
      flexWrap: 'wrap'
      //width: wp(255)
    },
    dateText: {
      fontSize: hp(12),
      fontWeight: '400',
      lineHeight: hp(22),
      color: common.black
    },
    image: {
      width: wp(40),
      height: hp(40),
      borderRadius: 100,
      marginEnd: wp(10)
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline'
    },
    seeMoreText: {
      fontWeight: '800',
      color: common.darkGrey
    }
  };
};

export default StyleSheet.create(styles);
