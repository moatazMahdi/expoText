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
  container: ViewStyle;
  title: TextStyle;
  listItem: ViewStyle;
  bullet: ViewStyle;
  itemText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    modalStyle: { justifyContent: 'flex-end', margin: 0 },
    modalViewContainer: {
      width: '100%',
      backgroundColor: '#FAFAFA',
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: wp(20),
    },
    cameraContainer: {
      marginTop: hp(24),
      marginBottom: hp(20),
    },
    cameraOption: {
      fontSize: hp(16),
      marginStart: wp(16),
      color: '#020B19',
    },
    attentionText: {
      fontSize: hp(12),
      color: common.grey,
      fontWeight: '500',
      marginStart: wp(16),
      alignSelf: 'center',
      lineHeight: hp(17),
    },
    container: {
      backgroundColor: '#F0F4F8',
      marginHorizontal: wp(16),
      padding: wp(16),
      borderRadius: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#0B0D17',
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'center',
    },
    bullet: {
      width: wp(6),
      height: hp(6),
      borderWidth: 3,
      borderRadius: 20,
      marginRight: 8,
      marginTop: 4,
    },
    itemText: {
      fontSize: 11,
      fontWeight: '400',
      color: '#31363F',
      lineHeight: 16,
    },
  };
};

export default StyleSheet.create(styles);
