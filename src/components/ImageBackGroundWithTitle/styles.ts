import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  imageShadow: ImageStyle;
  imageStyle: ImageStyle;
  titleContainer: ViewStyle;
  titleText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      width: wp(310),
      height: hp(204),
      flexDirection: 'row',
      borderRadius: 20
    },
    imageShadow: {
      marginVertical: hp(30),
      marginEnd: wp(12)
    },
    imageStyle: {
      width: wp(310),
      height: hp(204),
      borderRadius: 20
    },
    titleContainer: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'flex-end'
    },
    titleText: {
      marginStart: wp(16),
      marginBottom: hp(12.5),
      color: common.white,
      fontWeight: 'bold',
      fontSize: hp(20),
      textAlign: 'center'
    }
  };
};

export default StyleSheet.create(styles);
