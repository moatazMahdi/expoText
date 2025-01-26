import { I18nManager, Platform } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from '../../../theming';
import { DropdownStyles } from './types';
import { Assets } from 'assets';

export const defaultStyles = (theme: Theme): DropdownStyles => {
  const { fonts } = Assets;

  const family = I18nManager.isRTL ? fonts.arabic : fonts.regular;

  const {
    palette: { common },
  } = theme;

  return {
    chevron: {
      maxWidth: 16,
      maxHeight: 16,
      minWidth: 16,
      minHeight: 16,
      alignSelf: 'flex-end',
    },
    dropdown: {
      borderRadius: hp(20),
      height: '100%',
      width: '100.95%',
      backgroundColor: 'transparent',
      paddingHorizontal: wp(15),
    },
    itemText: {
      fontSize: hp(12),
      fontWeight: Platform.OS === 'ios' ? '400' : '500',
      fontFamily: family,
      color: common.dropDownText,
    },
    itemStyle: {
      borderBottomColor: common.dropDownSeparator,
      borderBottomWidth: 1,
      padding: wp(15),
    },
    container: {
      borderWidth: 0,
      shadowColor: 'rgba(50, 50, 71, 0.05)',
    },
    defaultText: { fontSize: hp(14), fontFamily: family, flex: 0 },
  };
};
