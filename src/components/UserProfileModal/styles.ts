import { StyleSheet, ViewStyle, TextStyle, I18nManager, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';
import { ImageStyle } from 'react-native-fast-image';

interface IStyles {
  container: ViewStyle;
  safeAreContainer: ViewStyle;
  headerUserImageContainer: ViewStyle;
  headerUserNameContainer: ViewStyle;
  userNameText: TextStyle;
  scrollViewStyle: ViewStyle;
  rowStyle: ViewStyle;
  IconNameContainer: ViewStyle;
  sectionText: TextStyle;
  logoutText: TextStyle;
  BottomSectionItems: ViewStyle;

  headerContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    safeAreContainer: {
      flex: 1
    },
    container: {
      flex: 1,
      backgroundColor: common.white,
      borderRadius: 20,
      paddingHorizontal: wp(20)
    },
    headerContainer: {
      width: '100%',
      paddingTop: hp(51),
      paddingHorizontal: wp(30)
    },

    headerUserImageContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerUserNameContainer: {
      marginTop: hp(8),
      marginBottom: hp(41)
    },
    userNameText: {
      fontSize: hp(36),
      color: common.black
    },
    scrollViewStyle: {
      backgroundColor: 'red'
    },
    rowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: wp(30),
      marginTop: hp(20)
    },
    IconNameContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    sectionText: {
      fontSize: hp(17),
      fontWeight: '700',
      marginStart: wp(27)
    },
    logoutText: {
      color: common.black,
      fontWeight: '400',
      fontSize: hp(15),
      padding: 12
    },
    BottomSectionItems: {
      flex: 1
    }
  };
};

export default StyleSheet.create(styles);
