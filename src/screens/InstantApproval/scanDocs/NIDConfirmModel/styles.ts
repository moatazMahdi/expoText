import { Dimensions, ViewStyle, TextStyle, I18nManager, StyleSheet } from 'react-native';

import { Theme } from 'elephanz-rn-ui';

const { width, height } = Dimensions.get('window');
interface IStyles {
  animationContainer: ViewStyle;
  overlay: ViewStyle;
  contentCardContainer: ViewStyle;
  cardTitleContainer: ViewStyle;
  backButton: ViewStyle;
  titleLabel: TextStyle;
  cardBodyContainer: ViewStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  nationalIDBox: TextStyle;
  fieldInput: TextStyle;
  buttonsContainer: ViewStyle;
  rescanLabel: TextStyle;
  button: ViewStyle;
  buttonLabel: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary, common },
    spacing: { spacing }
  } = theme;

  return {
    animationContainer: {
      position: 'absolute',
      width
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      width,
      height: height * 2,
      backgroundColor: common.silver,
      opacity: 0.4
    },
    contentCardContainer: {
      position: 'absolute',
      bottom: 0,
      width,
      paddingHorizontal: spacing(2),
      paddingVertical: spacing(5),
      backgroundColor: common.white,
      borderTopLeftRadius: spacing(5),
      borderTopRightRadius: spacing(5),
      shadowColor: common.black,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    cardTitleContainer: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center'
    },
    backButton: {
      width: spacing(2),
      height: spacing(2),
      marginHorizontal: spacing(2),
      transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }]
    },
    titleLabel: {
      marginHorizontal: spacing(1),
      marginTop: spacing(1),
      fontSize: spacing(3),
      fontWeight: 'bold'
    },
    cardBodyContainer: {
      padding: spacing(2)
    },
    subtitle1: {
      marginVertical: spacing(2),
      fontSize: spacing(2.2),
      color: common.black
    },
    subtitle2: {
      marginVertical: spacing(1),
      fontSize: spacing(2),
      color: common.darkGrey
    },
    nationalIDBox: {
      alignSelf: 'center',
      marginBottom: spacing(1),
      padding: spacing(1),
      textAlign: 'center',
      fontSize: spacing(2),
      fontWeight: '700',
      letterSpacing: spacing(1),
      color: common.orange,
      borderWidth: 2,
      borderRadius: spacing(1),
      borderColor: primary.value
    },
    fieldInput: {
      marginHorizontal: spacing(0.5),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      fontSize: spacing(2),
      letterSpacing: spacing(0.4),
      color: primary.value,
      borderBottomWidth: 1,
      borderBottomColor: common.silver
    },
    buttonsContainer: { marginTop: spacing(2) },
    rescanLabel: {
      marginVertical: spacing(2),
      textAlign: 'center',
      fontSize: spacing(3),
      fontWeight: 'bold',
      color: common.secondaryBlue
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      height: spacing(7.5),
      marginTop: spacing(1),
      marginBottom: spacing(3),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2)
    },
    buttonLabel: {
      fontSize: spacing(2.5),
      fontWeight: 'bold',
      color: common.white
    }
  };
};

export default StyleSheet.create(styles);
