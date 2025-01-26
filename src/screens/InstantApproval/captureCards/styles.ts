import { Dimensions, TextStyle, ViewStyle, ImageStyle, StyleSheet } from 'react-native';

import { Theme } from 'elephanz-rn-ui';

const { width, height } = Dimensions.get('window');
interface IStyles {
  bodyTxt: TextStyle;
  sideContainer: ViewStyle;
  cardTitle: TextStyle;
  cardContainer: ViewStyle;
  photo: ImageStyle;
  captureTxt: TextStyle;
  confirmButtonContainer: ViewStyle;
  button: ViewStyle;
  buttonLabel: TextStyle;
}
const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary, common },
    spacing: { spacing }
  } = theme;

  return {
    bodyTxt: {
      marginHorizontal: spacing(2),
      marginBottom: spacing(3),
      // textAlign: 'center',
      fontSize: spacing(2.2),
      color: common.darkGrey
    },
    sideContainer: {
      marginVertical: spacing(2)
    },
    cardTitle: {
      marginVertical: spacing(2),
      textAlign: 'center',
      fontSize: spacing(2.2),
      fontWeight: 'bold',
      color: common.black
    },
    cardContainer: {
      alignSelf: 'center',
      width: width * 0.95,
      height: height * 0.3
    },
    photo: { flex: 1, resizeMode: 'cover', borderRadius: spacing(2) },
    captureTxt: {
      marginVertical: spacing(2),
      textAlign: 'center',
      fontSize: spacing(2.5),
      fontWeight: 'bold',
      color: primary.value
    },
    confirmButtonContainer: { flex: 1, justifyContent: 'flex-end' },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      height: spacing(7.5),
      marginTop: spacing(7),
      marginBottom: spacing(3),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2)
    },
    buttonLabel: { fontSize: spacing(2.5), color: common.white }
  };
};

export default StyleSheet.create(styles);
