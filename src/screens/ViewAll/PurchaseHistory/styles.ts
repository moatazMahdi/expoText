import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  calenderView: ViewStyle;
  modalStyle: ViewStyle;
  modalViewContainer: ViewStyle;
  filterItem: ViewStyle;
  filterItemSelected: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    calenderView: {
      width: hp(16),
      height: hp(16)
    },
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '90%',
      backgroundColor: common.white,
      marginHorizontal: 20,
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(31)
    },
    filterItem: {
      backgroundColor: common.brightGray,
      paddingVertical: hp(11),
      paddingHorizontal: wp(10),
      borderRadius: 16,
      marginBottom: hp(11),
      width: '100%',
      alignItems: 'center'
    },
    filterItemSelected: {
      backgroundColor: common.darkOrange
    }
  };
};

export default StyleSheet.create(styles);
