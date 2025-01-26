import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  productInfoContainer: ViewStyle;
  productNamePriceText: TextStyle;
  additionInfoView: ViewStyle;
  additionInfoText: TextStyle;
  transactionHistoryContainer: ViewStyle;
  upcomingInstallmentContainer: ViewStyle;
  upComingInstallmentText: TextStyle;
  upComingInstallmentPriceText: TextStyle;
  modalViewContainer: ViewStyle;
  footerContainer: ViewStyle;
  buttonStyle: ViewStyle;
  buttonText: TextStyle;
  penaltyText: TextStyle;
  modalStyle: ViewStyle;
  modalText: TextStyle;
  paymentMethodsContainer: ViewStyle;
  paymentMethodText: TextStyle;
  installmentContentContainer: ViewStyle;
  rowContainer: ViewStyle;
  nameContainer: TextStyle;
  dataText: TextStyle;
  separatorStyle: ViewStyle;
  contractDetailsContainer: ViewStyle;
  lateFeesText: TextStyle;
  payAllInstallmentsBtn: ViewStyle;
  payAllInstallmentsText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    productInfoContainer: {
      marginTop: hp(20),
      marginHorizontal: wp(20),
      paddingVertical: hp(20),
      paddingHorizontal: wp(20),
      backgroundColor: 'transparent',
    },
    productNamePriceText: {
      fontSize: hp(24),
      fontWeight: '700',
    },
    additionInfoView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(12),
      marginBottom: hp(20),
    },
    additionInfoText: {
      fontSize: hp(16),
    },
    transactionHistoryContainer: {
      marginTop: hp(20),
    },
    upcomingInstallmentContainer: {
      paddingHorizontal: wp(20),
    },
    upComingInstallmentText: {
      fontSize: hp(16),
    },
    upComingInstallmentPriceText: {
      fontSize: hp(24),
      fontWeight: '700',
      marginVertical: hp(10),
    },
    footerContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
    },
    buttonStyle: {
      width: wp(335),
      height: hp(38.65),
      borderRadius: 20,
      marginBottom: hp(20),
      backgroundColor: common.yellowOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      alignSelf: 'center',
      color: common.white,
    },
    penaltyText: {
      fontSize: hp(16),
      alignSelf: 'center',
      marginVertical: hp(14),
    },
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '90%',
      backgroundColor: common.white,
      marginHorizontal: 20,
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
    installmentContentContainer: {
      padding: wp(16),
      borderRadius: hp(12),
      shadowOffset: {
        width: 0,
        height: hp(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      backgroundColor: common.white,
      marginVertical: hp(16),
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: hp(10),
      padding: 4,
      alignItems: 'center',
    },
    nameContainer: {
      color: common.blueGray,
      fontSize: 14,
      fontWeight: '500',
      flex: 2,
    },
    dataText: {
      color: '#31363F',
      fontSize: 14,
      fontWeight: '700',
      flex: 2,
      textAlign: 'right',
    },
    separatorStyle: {
      backgroundColor: common.backGroundColor,
      height: 2,
    },
    contractDetailsContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
      padding: hp(16),
    },
    lateFeesText: {
      color: '#E54444',
      marginBottom: hp(16),
      fontSize: 14,
    },
    payAllInstallmentsBtn: {
      backgroundColor: common.backGroundColor,
      paddingHorizontal: wp(16),
      paddingVertical: hp(12),
      borderRadius: 20,
      marginTop: hp(16),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    payAllInstallmentsText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#31363F',
    },
  };
};

export default StyleSheet.create(styles);
