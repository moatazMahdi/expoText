import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  Platform,
} from 'react-native';
import {hp} from 'src/utils/Dimensions/dimen';
import {Theme} from 'elephanz-rn-ui';
import {wp} from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  headerText: TextStyle;
  arrowTitleContainer: ViewStyle;
  NavUserImage: ViewStyle;
  innerContainer: ViewStyle;
  contentContainer: ViewStyle;
  headerBackGroundTangelo: ViewStyle;
  headerBackgroundYellow: ViewStyle;
  headerBackgroundOrange: ViewStyle;
  SearchIconContainer: ViewStyle;
}

const width = Dimensions.get('window').width;

const styles = (theme: Theme): IStyles => {
  const {
    palette: {common},
    statusBarHeight,
  } = theme;

  return {
    container: {
      width: width,
      backgroundColor: 'transparent',
      borderRadius: 20,
      zIndex: 100,
    },
    innerContainer: {
      borderRadius: 10,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 10,
      width: width,
      height: hp(168),
      backgroundColor: common.darkBlue,
      borderBottomEndRadius: 20,
      borderBottomStartRadius: 20,
      paddingTop: hp(statusBarHeight),
      overflow: 'hidden',
    },
    contentContainer: {
      flexDirection: 'row',
      marginTop: hp(30),
    },

    headerBackGroundTangelo: Platform.select({
      ios: {
        position: 'absolute',
        left: wp(0),
        bottom: hp(20),
      },
      android: {
        position: 'absolute',
        left: wp(0),
        bottom: hp(10),
      },
    }),

    headerBackgroundYellow: {
      position: 'absolute',
      right: wp(0),
      bottom: hp(0),
    },
    headerBackgroundOrange: {
      position: 'absolute',
      right: 0,
      bottom: hp(0),
    },

    arrowTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerText: {
      color: common.white,
      fontSize: hp(20),
      fontWeight: '700',
      paddingStart: wp(10),
      marginEnd: wp(20),
    },
    NavUserImage: {
      marginEnd: wp(14),
      flexDirection: 'row',
      alignItems: 'center',
    },
    SearchIconContainer: {
      width: hp(30),
      height: hp(30),
      backgroundColor: common.white,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: wp(18),
    },
  };
};

export default StyleSheet.create(styles);
