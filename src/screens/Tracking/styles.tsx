import {Dimensions, StyleSheet} from 'react-native';
import {Theme} from 'elephanz-rn-ui';
import {hp, wp} from 'src/utils/Dimensions/dimen';

const styles = (theme: Theme) => {
  const {height} = Dimensions.get('screen');

  const {
    palette: {common},
  } = theme;

  return {
    typesView: {marginHorizontal: wp(10), marginTop: hp(30)},
    noRequestsView: {
      height: height / 1.65,
      marginHorizontal: wp(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    noRequestImage: {width: wp(184), height: hp(184), resizeMode: 'contain'}, //{ width: 168, height: 149 }
    itemShadowView: {
      paddingVertical: hp(9),
      paddingHorizontal: wp(8),
      backgroundColor: 'white',
      marginBottom: hp(16),
      marginHorizontal: wp(16),
      flexDirection: 'row',
    },
    imageStyle: {
      width: wp(93),
      height: hp(86),
      // marginRight: 42,
      borderRadius: 8,
    },
    cardsView: {
      marginBottom: hp(10),
      marginTop: hp(30),
    },
    typeText: {fontSize: hp(16)},
    itemText: {
      marginTop: hp(15),
    },
    itemContainer: {
      borderRadius: 20,
      backgroundColor: common.white,
      justifyContent: 'center',
      paddingVertical: hp(7),
      paddingHorizontal: wp(12),
    },
    cardContent: {
      width: '70%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
