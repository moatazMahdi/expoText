import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  container: ViewStyle;
  textStyle: TextStyle;
  containerWithBackground: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(29)
    },
    containerWithBackground: {
      backgroundColor: '#F6D5D3',
      paddingHorizontal: wp(16),
      paddingVertical: hp(15),
      marginHorizontal: wp(20),
      borderRadius: 5
    },
    textStyle: {
      flex: 1,
      flexWrap: 'wrap',
      fontSize: hp(11),
      fontWeight: '500',
      marginStart: wp(16),
      alignSelf: 'center',
      lineHeight: hp(17)
    }
  };
};

export default StyleSheet.create(styles);
