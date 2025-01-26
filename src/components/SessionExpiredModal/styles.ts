import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  modalContainer: ViewStyle;
  titleText: TextStyle;
  buttonStyle: ViewStyle;
  bodyText: TextStyle;
  buttonText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    modalContainer: {
      width: wp(300),
      height: hp(180),
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
      width: wp(180)
    },
    bodyText: {
      fontSize: hp(16),
      color: common.black,
      marginTop: hp(20)
    },
    buttonText: {
      fontSize: hp(15)
    }
  };
};

export default StyleSheet.create(styles);
