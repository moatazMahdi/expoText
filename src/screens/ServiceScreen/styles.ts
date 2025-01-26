import { StyleSheet, ImageStyle, Dimensions, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  headerImage: ImageStyle;
  detailsCard: ViewStyle;
  cardContainer: ViewStyle;
  imageView: ImageStyle;
  cardImage: ImageStyle;
  titleCard: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');
  const {
    spacing: { spacing },
    palette: { common },
  } = theme;

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  const CARD_WIDTH = SCREEN_WIDTH / 3;

  return {
    headerImage: {
      width: width,
      height: hp(242),
      marginBottom: hp(23),
    },
    detailsCard: {
      width: '100%',
      backgroundColor: common.transparent,
      borderRadius: 20,
      padding: wp(15),
    },
    cardContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing(1),
      marginTop: spacing(3),
      height: 120,
      width: CARD_WIDTH - spacing(1),
    },
    imageView: {
      width: SCREEN_WIDTH * 0.33,
      // alignSelf: 'stretch',
      height: SCREEN_HEIGHT * 0.12,
      borderRadius: spacing(1.5),
      overflow: 'hidden',
      // backgroundColor: 'red',
    },
    cardImage: {
      flex: 1,
      // borderRadius: spacing(3),
      // overflow: 'hidden',
      resizeMode: 'contain',
    },
    titleCard: {
      marginTop: spacing(1),
      height: spacing(6),
      textAlign: 'center',
      width: CARD_WIDTH - spacing(1),
    },
  };
};

export default StyleSheet.create(styles);
