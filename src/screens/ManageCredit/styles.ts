import { StyleSheet } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

const styles = (theme: Theme) => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    contentContainer: {
      flexGrow: 1,
      backgroundColor: common.white,
      alignItems: 'center',
    },
    balanceContainer: {
      marginTop: hp(32),
      zIndex: 1,
    },
    rowStyle: {
      marginBottom: hp(20),
      paddingHorizontal: wp(20),
      justifyContent: 'space-between',
    },
  };
};

export default StyleSheet.create(styles);
