import {
  StyleSheet,
  ImageStyle,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  headerImage: ImageStyle;
  detailsContainer: ViewStyle;
  descriptionText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');
  const {
    palette: { common },
  } = theme;

  return {
    headerImage: {
      width: width,
      height: hp(242),
      marginBottom: hp(20),
    },
    detailsContainer: {
      width: '100%',
      padding: wp(15),
      backgroundColor: common.white,
      marginHorizontal: wp(20),
      borderRadius: 20,
      alignSelf: 'center',
    },
    descriptionText: {
      color: common.slightDarkBlue,
      fontSize: hp(16),
      lineHeight: hp(25),
    },
  };
};

export default StyleSheet.create(styles);
