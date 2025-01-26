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
  HistoryCard: ViewStyle;
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
      marginBottom: 0,
      backgroundColor: 'white',
      height: 100,
      borderWidth: 1.43,
      borderRadius: 12,
      borderColor: '#E6E6E6',
      justifyContent: 'center',
      alignItems: 'center',
      paddingEnd: 0,
    },
    HistoryCard: {
      width: '100%',
      flexDirection: 'row',
      marginTop: 16,
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
