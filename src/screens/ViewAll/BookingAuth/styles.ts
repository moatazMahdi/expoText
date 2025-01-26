import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  customCard: ViewStyle;
  calenderView: ViewStyle;
  cardCustomStyle: ViewStyle;
  rowStyle: ViewStyle;
  personaImage: ImageStyle;
  imageContainer: ViewStyle;
  textStyle: TextStyle;
}

const styles = (): IStyles => {
  return {
    customCard: {
      width: wp(328),
    },
    calenderView: {
      width: hp(16),
      height: hp(16),
    },
    cardCustomStyle: {
      width: wp(328),
    },
    rowStyle: {
      marginHorizontal: wp(24),
      marginTop: hp(24),
      flexDirection: 'row',
    },
    personaImage: { height: hp(30), width: wp(30), resizeMode: 'cover' },
    imageContainer: {
      width: wp(30),
      height: wp(30),
      borderRadius: wp(15),
      backgroundColor: '#e1dfe0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      alignSelf: 'center',
      marginHorizontal: wp(10),
      fontWeight: 'bold',
      fontSize: 15,
    },
  };
};

export default StyleSheet.create(styles);
