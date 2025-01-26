import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  modalViewContainer: ViewStyle;
  modalStyle: ViewStyle;
  cameraContainer: ViewStyle;
  cameraOption: TextStyle;
  attentionText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '100%',
      backgroundColor: common.white,
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: wp(20),
    },
    cameraContainer: {
      marginTop: hp(54),
      marginBottom: hp(20),
    },
    cameraOption: {
      fontSize: hp(16),
      marginStart: wp(16),
    },
    attentionText: {
      fontSize: hp(12),
      color: common.grey,
      fontWeight: '500',
      marginStart: wp(16),
      alignSelf: 'center',
      lineHeight: hp(17),
    },
  };
};

export default StyleSheet.create(styles);
