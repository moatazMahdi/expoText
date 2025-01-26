import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  imageStyle: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    imageStyle: {
      width: wp(52),
      height: hp(52),
      borderRadius: 8,
      alignSelf: 'center',
      borderWidth: 10,
      // borderColor: common.white
      borderColor: '#00000033',
    },
  };
};

export default StyleSheet.create(styles);
