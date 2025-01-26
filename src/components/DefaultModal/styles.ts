import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  modalStyle: ViewStyle;
  modalViewContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '100%',
      // height: hp(512),
      backgroundColor: common.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: hp(20)
    }
  };
};

export default StyleSheet.create(styles);
