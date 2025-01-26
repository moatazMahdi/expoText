import {StyleSheet, ViewStyle} from 'react-native';
import {Theme} from 'elephanz-rn-ui';
import {wp} from '../../utils/Dimensions/dimen';

interface IStyles {
  buttonStyle: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: {common},
  } = theme;

  return {
    buttonStyle: {
      width: wp(50),
      height: wp(50),
      borderRadius: 50,
      backgroundColor: common.darkOrange,
      shadowColor: common.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      position: 'absolute',
      justifyContent: 'center',
      zIndex: 1000,
      flexDirection: 'row',
      flex: 1,
    },
  };
};

export default StyleSheet.create(styles);
