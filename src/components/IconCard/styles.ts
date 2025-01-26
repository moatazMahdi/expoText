import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  cameraOption: TextStyle;
  pressable: ViewStyle;
  row: ViewStyle;
}

const styles = (): IStyles => {
  return {
    cameraOption: {
      fontSize: hp(16),
      marginStart: wp(16),
      color: '#020B19',
    },
    pressable: {
      height: hp(54),
      backgroundColor: '#FFF',
      padding: hp(16),
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      // marginHorizontal: 16,
      marginVertical: 4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  };
};

export default StyleSheet.create(styles);
