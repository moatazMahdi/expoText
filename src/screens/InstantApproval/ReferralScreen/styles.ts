import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  dropdownView: ViewStyle;
  mainContainer: ViewStyle;
  continueContainerButton: ViewStyle;
}

const styles = (): IStyles => {
  return {
    dropdownView: { width: '90%', flex: 1 },
    mainContainer: {
      flex: 1,
    },
    continueContainerButton: {
      alignSelf: 'flex-end',
      marginTop: hp(70),
      position: 'relative',
      marginBottom: 0,
    },
  };
};

export default StyleSheet.create(styles);
