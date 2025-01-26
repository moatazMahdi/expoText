import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  viewAllContainer: ViewStyle;
  headerUserImageContainer: ViewStyle;
  ViewAllText: TextStyle;
  titleText: TextStyle;
  viewAllSvg: ViewStyle;
  headerContainer: ViewStyle;
  flatListStyle: ViewStyle;
  childrenContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      width: '100%',
      zIndex: 1,
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      paddingLeft: wp(20),
      paddingRight: wp(20),
    },
    viewAllContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerUserImageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginEnd: wp(5.53),
    },
    ViewAllText: {
      marginStart: wp(15),
      fontSize: hp(14),
      fontWeight: '500',
      color: common.blueGray,
    },
    titleText: {
      fontWeight: '700',
      fontSize: hp(16),
      flex: 1,
      color: common.black,
    },
    viewAllSvg: {
      width: wp(16),
      height: hp(12),
      marginStart: wp(10),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
    },
    flatListStyle: {
      paddingStart: wp(10),
      paddingEnd: wp(10),
    },
    childrenContainer: {
      marginTop: hp(14),
    },
  };
};

export default StyleSheet.create(styles);
