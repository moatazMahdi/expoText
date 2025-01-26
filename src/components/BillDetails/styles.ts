import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Dimensions,
} from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  header: TextStyle;
  billContainer: ViewStyle;
  amountLabel: TextStyle;
  amount: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    },
    header: {
      fontSize: wp(20),
      fontWeight: 'bold',
      // marginBottom: 20,
    },
    billContainer: {
      justifyContent: 'center',
      height: hp(140),
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: hp(15),
      width: '100%',
    },
    amountLabel: {
      // marginTop: hp(10),
      fontSize: wp(14),
      color: '#020B19',
      // marginBottom: wp(2),
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: wp(24),
      // backgroundColor: 'red'
    },
    amount: {
      fontSize: wp(24),
      fontWeight: 'bold',
      color: '#081F6F',
      marginBottom: 4,
      // backgroundColor: 'green',
      lineHeight: wp(34),
    },
  };
};

export default StyleSheet.create(styles);
