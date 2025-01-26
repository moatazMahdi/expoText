import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  flatListStyle: ViewStyle;
  container: ViewStyle;
  loadingContainer: ViewStyle;
  internetText: TextStyle;
  loadingMoreWrapper: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      flex: 1,
    },
    flatListStyle: {
      alignItems: 'center',
      paddingBottom: hp(20),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    internetText: {
      textAlign: 'center',
      color: common.grey,
      fontSize: hp(16),
      marginTop: hp(20),
    },
    loadingMoreWrapper: {
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
