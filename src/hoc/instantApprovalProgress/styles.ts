import { Dimensions, Platform, I18nManager, StyleSheet } from 'react-native';

import { Theme } from 'elephanz-rn-ui';
import { StylesInterface } from './types';

const { height } = Dimensions.get('window');

const styles = (theme: Theme): StylesInterface => {
  const {
    palette: { primary, common },
    spacing: { spacing }
  } = theme;

  return {
    container: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: primary.value
    },
    headerContainer: {
      flexDirection: 'row',
      marginTop: Platform.OS === 'ios' ? spacing(7) : spacing(5),
      paddingHorizontal: spacing(3)
    },
    backArrow: {
      width: spacing(3),
      height: spacing(3),
      marginTop: spacing(1),
      transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }]
    },
    headerTitleContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingStart: spacing(3)
    },
    headerTitle: {
      fontSize: spacing(3.5),
      fontWeight: '600',
      color: common.white
    },
    progressContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: spacing(3)
    },
    steps: { textAlign: 'center', fontSize: spacing(2.5), color: common.white },
    bodyContainer: {
      minHeight: height - spacing(10),
      marginTop: spacing(4),
      paddingHorizontal: spacing(2),
      paddingVertical: spacing(4),
      backgroundColor: common.white,
      borderTopLeftRadius: spacing(4),
      borderTopRightRadius: spacing(4)
    }
  };
};

export default StyleSheet.create(styles);
