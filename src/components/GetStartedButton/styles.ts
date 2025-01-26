import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  modalContainer: ViewStyle;
  titleText: TextStyle;
  buttonStyle: ViewStyle;
  bodyText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    modalContainer: {
      width: wp(300),
      height: hp(200),
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: common.white,
      padding: wp(20)
    },
    titleText: {
      fontSize: hp(18),
      color: common.black,
      textAlign: 'center',
      fontWeight: '700'
    },
    buttonStyle: {
      width: wp(100)
    },
    bodyText: {
      fontSize: hp(16),
      color: common.black,
      marginTop: hp(30)
    }
  };
};

export default StyleSheet.create(styles);
