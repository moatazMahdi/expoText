import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  continueLaterContainer: ViewStyle;
  continueLaterText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    continueLaterContainer: {
      // marginHorizontal: wp(10),
      padding: wp(20),
      paddingBottom: hp(17),
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    continueLaterText: {
      fontSize: hp(16),
      color: common.orange,
      fontWeight: '300',
    },
  };
};

export default StyleSheet.create(styles);
