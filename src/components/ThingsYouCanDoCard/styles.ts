import { StyleSheet } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

const styles = (theme: Theme) => {
  const {
    palette: { common },
  } = theme;

  return {
    cardContainer: {
      width: wp(163),
      minHeight: hp(140),
      paddingHorizontal: wp(14),
      paddingVertical: hp(16),
      borderRadius: hp(12),
      alignItems: 'center',
    },
    shadowWrapper: {
      width: wp(163),
      shadowColor: 'rgba(50, 50, 71, 0.05)',
      shadowOffset: {
        width: 0,
        height: hp(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: common.white,
      borderRadius: hp(12),
    },
    nameText: {
      fontSize: hp(15),
      fontWeight: '700',
      color: common.black,
      marginTop: hp(18),
    },
    smallText: {
      fontSize: hp(12),
      color: common.blueGray,
      lineHeight: hp(16),
      textAlign: 'center',
      marginTop: hp(4),
    },
    nameTextStyle: {
      fontSize: hp(15),
      fontWeight: '700',
      marginTop: hp(12),
      lineHeight: hp(26),
      color: common.black,
    },
    iconStyle: {
      backgroundColor: common.lightGray,
      width: wp(40),
      height: wp(40),
      borderRadius: wp(20),
      justifyContent: 'center',
    },
  };
};

export default StyleSheet.create(styles);
