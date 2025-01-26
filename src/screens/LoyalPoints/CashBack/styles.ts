import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  MerchantsCard: ViewStyle;
  HistoryCard: ViewStyle;
  HistoryCardContainer: ViewStyle;
  CardContainer: ViewStyle;
  CardTextStyle: TextStyle;
  EgpPriceStyle: TextStyle;
  PriceStyle: TextStyle;
  ExpireText: TextStyle;
  image: ImageStyle;
  cashBackImage: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  return {
    MerchantsCard: {
      width: wp(100),
      height: wp(100),
      borderWidth: 2,
      borderRadius: 12,
      borderColor: '#E6E6E6',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.common.white,
    },
    HistoryCard: {
      width: '100%',
      flexDirection: 'row',
      marginTop: 16,
    },
    HistoryCardContainer: {
      width: '100%',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    CardContainer: {
      width: wp(343),
      height: hp(114),
      backgroundColor: '#081F6F',
      marginHorizontal: 16,
      marginVertical: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      overflow: 'hidden',
    },
    CardTextStyle: {
      color: 'white',
      fontSize: hp(12),
      fontWeight: '700',
    },
    EgpPriceStyle: {
      color: 'white',
      fontSize: hp(12),
      fontWeight: '700',
      marginTop: 9,
    },
    PriceStyle: { color: 'white', fontSize: hp(24), fontWeight: '700' },
    ExpireText: {
      color: 'white',
      fontSize: hp(12),
      fontWeight: '400',
      marginTop: 8,
    },
    image: {
      width: wp(75),
      height: hp(75),
    },
    cashBackImage: {
      width: wp(66),
      height: hp(66),
      right: wp(16),
      top: hp(25),
      position: 'absolute',
    }
  };
};

export default StyleSheet.create(styles);
