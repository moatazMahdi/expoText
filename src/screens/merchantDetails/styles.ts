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
  detailsCard: ViewStyle;
  emptyTextContainer: ViewStyle;
  headerNoImage: ViewStyle;
  headerImageContainer: ViewStyle;
  merchantTitle: TextStyle;
  merchantMap: ViewStyle;
  merchantImageMap: ImageStyle;
  merchantMapTitle: TextStyle;
  merchantOfferContainer: ViewStyle;
  merchantOfferDescription: TextStyle;
  merchantOfferTitle: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { width } = Dimensions.get('window');
  const {
    palette: { common },
  } = theme;

  return {
    headerImageContainer: {
      marginVertical: hp(24),
      width: '100%',
      backgroundColor: common.white,
      alignItems: 'center',
      flexDirection: 'row',
      padding: hp(16),
      borderWidth: 1,
      borderColor: common.cardGray,
      borderRadius: hp(12),
    },
    headerImage: {
      width: wp(50),
      height: hp(50),
      // marginBottom: hp(20),
      borderWidth: 1,
      borderRadius: hp(8),
      borderColor: common.cardGray,
      backgroundColor: 'white',
      alignSelf: 'center',
    },
    merchantTitle: {
      marginStart: hp(8),
      fontSize: 20,
      fontWeight: '700',
      color: common.black,
      maxWidth:"90%"
    },
    headerNoImage: {
      width: width,
      height: hp(211),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: common.white,
      marginBottom: hp(20),
    },
    detailsCard: {
      width: '100%',
      backgroundColor: common.white,
      borderRadius: 20,
      padding: wp(15),
    },
    emptyTextContainer: {
      padding: hp(50),
      width: '90%',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.darkBlue,
      marginVertical: hp(20),
    },
    merchantMap: {
      width: wp(150),
    },
    merchantImageMap: {
      width: '100%',
      height: hp(170),
      borderWidth: 2,
      borderColor: common.cardGray,
      borderRadius: hp(16),
    },
    merchantMapTitle: {
      marginTop: hp(8),
      fontSize: 16,
      fontWeight: '700',
      color: common.black,
    },
    merchantOfferContainer: {
      maxWidth: wp(320),
      padding: hp(16),
      borderWidth: 1,
      borderRadius: hp(8),
      borderColor: common.cardGray,
      backgroundColor:common.white
    },
    merchantOfferDescription: {
      fontSize: 12,
      fontWeight: '400',
      marginTop: 9,
      color: common.blueGray,
      lineHeight:16
    },
    merchantOfferTitle: { fontSize: 16, fontWeight: '700', color: common.black },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '100%',
      padding: 20,
      borderRadius: 10,
      backgroundColor:"#F8FAFC"
      // alignItems: 'center',
    },
    closeButton: {
      marginTop: 20,
      color: 'blue',
    },
  };
};

export default StyleSheet.create(styles);
