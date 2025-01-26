import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  headerText: TextStyle;
  image: ImageStyle;
  pressable: ViewStyle;
  cardImage: ImageStyle;
  titleText: TextStyle;
}

const styles = (): IStyles => {
  return {
    headerText: {
      fontWeight: '700',
      fontSize: 16,
      marginTop: hp(35),
      marginBottom: hp(20),
      paddingHorizontal: 20,
    },
    image: {
      width: '90%',
      height: hp(180),
      borderRadius: 16,
      alignSelf: 'center',
      marginTop: 20,
      resizeMode: 'stretch',
    },
    pressable: {
      width: wp(200),
      height: hp(270),
      backgroundColor: 'rgba(149, 123, 255, 0.1)',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingHorizontal: 10,
    },
    cardImage: { height: hp(185), width: wp(120), resizeMode: 'contain' },
    titleText: {
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
  };
};

export default StyleSheet.create(styles);
