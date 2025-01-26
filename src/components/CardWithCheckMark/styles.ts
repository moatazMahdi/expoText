import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  checkStyle: ViewStyle;
  cardStyle: ViewStyle;
  cardImage: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    cardContainer: {
      width: '100%',
      minHeight: hp(54),
      marginTop: hp(10),
      backgroundColor: common.white,
      borderRadius: 12,
      // padding: 12,
      paddingHorizontal: 12,
      marginBottom: hp(0),
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    checkStyle: {
      // position: 'absolute',
      // end: wp(10),
      // top: hp(16),
    },
    cardStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardImage: {
      width: 48,
      height: 48,
      borderRadius: 48,
      backgroundColor: '#F0F4F8',
      justifyContent: 'center',
      alignItems: 'center',
      // padding: 12,
    },
  };
};

export default StyleSheet.create(styles);
