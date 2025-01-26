import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  headerText: TextStyle;
  contentContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    cardContainer: {
      width: wp(335),
      marginTop: hp(20),
      backgroundColor: common.white,
      alignSelf: 'center',
      borderTopRightRadius: 20,
      borderRadius: 20,
      padding: 16,
      marginBottom: hp(26),
      borderWidth: 1,
      borderColor: common.creamyWhite,
      alignItems: 'flex-start',
    },
    headerText: {
      fontWeight: '700',
      fontSize: hp(16),
      marginBottom: hp(10),
      color: common.darkBlue,
    },
    contentContainer: {
      alignSelf: 'center',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
