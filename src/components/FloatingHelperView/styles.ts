import { StyleSheet, ViewStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  overImageContainer: ViewStyle;
  rowView: ViewStyle;
  shadowView: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    overImageContainer: {
      height: hp(62),
      backgroundColor: common.transparent,
      alignSelf: 'center',
      position: 'absolute',
      bottom: hp(20),
      zIndex: 10,
      borderRadius: 31
    },
    rowView: {
      justifyContent: 'center',
      backgroundColor: common.white,
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 31,
      width: wp(125),
      height: hp(62)
    },
    shadowView: {
      shadowColor: common.azureishWhite,
      shadowOffset: {
        width: 0,
        height: hp(8)
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 10
    }
  };
};

export default StyleSheet.create(styles);
