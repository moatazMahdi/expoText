import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  filterContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    filterContainer: {
      width: hp(30),
      height: hp(30),
      backgroundColor: common.white,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: wp(18)
    }
  };
};

export default StyleSheet.create(styles);
