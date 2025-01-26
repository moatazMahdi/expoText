import { StyleSheet, ImageStyle, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  headerImage: ImageStyle;
  detailsCard: ViewStyle;
  descText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');
  const {
    palette: { common }
  } = theme;

  return {
    headerImage: {
      width: width,
      height: hp(211),
      marginBottom: hp(20)
    },
    detailsCard: {
      width: '100%',
      backgroundColor: common.white,
      borderRadius: 20,
      padding: wp(15)
    },
    descText: {
      alignSelf: 'center',
      paddingHorizontal: wp(20),
      color: common.black,
      fontSize: hp(16)
    }
  };
};

export default StyleSheet.create(styles);
