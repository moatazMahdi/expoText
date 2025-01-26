import { I18nManager } from 'react-native';
import { StylesInterface } from './types';
import { Theme } from '../../../theming';
import { TRIANGLE_WIDTH } from './index';

const styles = (theme: Theme): StylesInterface => {
  const {
    spacing: { spacing },
    palette: { surface, others }
  } = theme;
  return {
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'relative'
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      position: 'absolute',
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
      display: I18nManager.isRTL ? 'none' : 'flex'
    },
    triangleTop: {
      borderLeftWidth: spacing(1),
      borderRightWidth: spacing(1),
      borderBottomWidth: TRIANGLE_WIDTH,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: others.tooltipBackground
    },
    triangleBottom: {
      borderLeftWidth: spacing(1),
      borderRightWidth: spacing(1),
      borderTopWidth: TRIANGLE_WIDTH,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: others.tooltipBackground
    },
    triangleRight: {
      borderTopWidth: spacing(1),
      borderBottomWidth: spacing(1),
      borderLeftWidth: TRIANGLE_WIDTH,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: others.tooltipBackground
    },
    triangleLeft: {
      borderTopWidth: spacing(1),
      borderBottomWidth: spacing(1),
      borderRightWidth: TRIANGLE_WIDTH,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: others.tooltipBackground
    },
    textBody: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textStyle: {
      minHeight: spacing(4)
    },
    tip: {
      textAlign: 'left',
      color: surface.contrast,
      backgroundColor: others.tooltipBackground,
      padding: spacing(1),
      // // lineHeight: 18,
      paddingHorizontal: spacing(2)
    }
  };
};

export default styles;
