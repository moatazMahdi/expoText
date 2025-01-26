import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  categoryCard: ViewStyle;
  categoryText: TextStyle;
  container: ViewStyle;
  tabsContainer: ViewStyle;
  tabSelected: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  return {
    container: {
      width: '100%',
      paddingHorizontal: wp(16)
    },
    tabsContainer: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 8,
      backgroundColor: common.tabsBackGround,
      justifyContent: 'space-evenly'
    },
    categoryCard: {
      paddingHorizontal: wp(12),
      paddingVertical: hp(8),
      borderRadius: 6,
      // borderWidth: 1,
      marginEnd: wp(8),
      justifyContent: 'center',
      alignItems: 'center',
      flex: 2
    },
    categoryText: { fontWeight: 'bold' },
    tabSelected: {
      shadowColor: 'rgba(16, 24, 40, 0.1)',
      shadowOffset: {
        width: 0,
        height: hp(6)
      },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 2,
      backgroundColor: common.white
    }
  };
};

export default StyleSheet.create(styles);
