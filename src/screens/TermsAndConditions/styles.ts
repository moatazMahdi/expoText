import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  container: ViewStyle;
  backContainer: ViewStyle;
  imageContainer: ViewStyle;
  scrollContainer: ViewStyle;
  titleContainer: ViewStyle;
  titleLabel: TextStyle;
  bodyContainer: ViewStyle;
  bodyLabel: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary, common, info },
    spacing: { spacing },
    typography: { fontSize, fontFamily }
  } = theme;

  return {
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: spacing(3),
      backgroundColor: common.white
    },
    backContainer: {
      height: spacing(3),
      marginTop: spacing(3),
      // marginRight: I18nManager.isRTL ? spacing(2) : 0,
      // marginLeft: I18nManager.isRTL ? 0 : spacing(2),
      justifyContent: 'center',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg'
        }
      ],
      backgroundColor: common.transparent
    },
    imageContainer: {
      height: spacing(10),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent
    },
    scrollContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent
    },
    titleContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent,
      marginTop: spacing(4),
      marginBottom: spacing(2)
    },
    titleLabel: {
      color: primary.value,
      fontSize: 24,
      fontFamily,
      fontWeight: '700',
      textAlign: 'center'
    },
    bodyContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2.5)
    },
    bodyLabel: {
      color: info.value,
      fontSize,
      fontFamily
      // textAlign: 'justify',
      // // lineHeight: 25,
    }
  };
};

export default StyleSheet.create(styles);
