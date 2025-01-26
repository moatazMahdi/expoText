import { StyleSheet, ViewStyle, TextStyle, I18nManager, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';
import { ImageStyle } from 'react-native-fast-image';

interface IStyles {
  userImage: ImageStyle;
  headerText: TextStyle;
  notificationBadge: ViewStyle;
  headerUserImageContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    headerUserImageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      // marginEnd: wp(5.53)
    },
    userImage: {
      width: hp(35),
      height: hp(35),
      borderRadius: 99
    },
    headerText: {
      color: common.lightSilver,
      marginStart: wp(15),
      fontSize: hp(16)
    },
    notificationBadge: {
      width: hp(10),
      height: hp(10),
      backgroundColor: '#EC4949',
      position: 'absolute',
      zIndex: 10,
      borderRadius: 99,
      bottom: hp(25)
    }
  };
};

export default StyleSheet.create(styles);
