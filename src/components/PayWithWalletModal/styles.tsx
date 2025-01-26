import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  modalViewContainer: ViewStyle;
  modalStyle: ViewStyle;
  modalText: TextStyle;
  paymentMethodsContainer: ViewStyle;
  paymentMethodText: TextStyle;
  errorMessage: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '90%',
      backgroundColor: common.white,
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: wp(20),
    },
    modalText: {
      fontSize: hp(20),
      fontWeight: '700',
    },
    paymentMethodsContainer: {
      marginTop: hp(54),
      marginBottom: hp(20),
    },
    paymentMethodText: {
      fontSize: hp(16),
      marginStart: wp(16),
    },
    errorMessage: {
      textAlign: 'left',
      alignSelf: 'stretch',
      color: common.dazzlingRed,
      marginHorizontal: wp(20),
      marginBottom: wp(20),
    },
  };
};

export default StyleSheet.create(styles);
