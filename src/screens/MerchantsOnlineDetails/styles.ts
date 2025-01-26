import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  ImageStyle,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  RedeemCard: ViewStyle;
  RedeemMony: TextStyle;
  MerchantImageCard: ViewStyle;
  RedeemText: TextStyle;
  SelectedItem: ViewStyle;
  SelectedItemBackground: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const width = Dimensions.get('window').width;

  const {
    palette: { common },
  } = theme;

  return {
    RedeemCard: {
      width: wp(109),
      height: hp(48),
      backgroundColor: 'white',
      borderRadius: 64,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
    },
    RedeemMony: {
      color: 'black',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 24,
    },
    MerchantImageCard: {
      width: '100%',
      height: 160,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 16,
      borderWidth: 1.43,
      borderColor: '#E6E6E6',
      marginTop: hp(24),
    },
    RedeemText: {
      color: '#31363F',
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
      maxWidth: 301,
      marginTop: 24,
      textAlign: 'center',
    },
    SelectedItem: {
      borderRadius: 64,
      width: 18,
      height: 18,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    SelectedItemBackground: {
      backgroundColor: '#FD8326',
      width: wp(8),
      height: hp(8),
      borderRadius: wp(64),
    },
  };
};

export default StyleSheet.create(styles);
