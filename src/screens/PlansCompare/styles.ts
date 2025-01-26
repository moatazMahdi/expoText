import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  BottomButtonView: ViewStyle;
  planTitleText: TextStyle;
  sepStyle: ViewStyle;
  sectionTitle: TextStyle;
  sectionDetails: TextStyle;
  cardStyle: ViewStyle;
  gridItems: ViewStyle;
  gridItemsText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    BottomButtonView: {
      width: '100%',
      position: 'absolute',
      bottom: hp(15),
      justifyContent: 'center'
    },

    planTitleText: {
      fontSize: hp(20),
      fontWeight: '700',
      color: common.darkBlue,
      marginBottom: hp(25),
      paddingTop: hp(20),
      flex: 1,
      alignSelf: 'center',
      textAlign: 'center'
    },
    sepStyle: {
      width: wp(335),
      height: hp(1),
      backgroundColor: common.darkBlue,
      alignSelf: 'center'
    },
    sectionTitle: {
      fontSize: hp(16),
      color: common.darkBlue,
      marginVertical: hp(8),
      marginHorizontal: wp(10),
      alignSelf: 'center',
      textAlign: 'center'
    },
    sectionDetails: {
      fontSize: hp(20),
      color: common.darkBlue,
      marginVertical: hp(13),
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: '700'
    },
    cardStyle: {
      width: '100%',
      backgroundColor: common.white,
      borderRadius: 20,
      justifyContent: 'center',
      paddingTop: hp(10)
    },
    gridItems: {
      paddingStart: wp(20),

      width: '50%',
      minHeight: hp(100),
      borderRadius: 8,
      alignSelf: 'center'
    },
    gridItemsText: {
      height: hp(50),
      fontSize: 16,
      color: common.black,
      marginBottom: hp(10)
    }
  };
};

export default StyleSheet.create(styles);
