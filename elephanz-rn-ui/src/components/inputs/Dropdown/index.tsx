import React from 'react';
import { I18nManager } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ExtendedSVG } from '../../dataDisplay';
import { hp } from 'src/utils/Dimensions/dimen';
import { useStyles } from '../../../theming';
import { DropdownProps } from './types';
import { defaultStyles } from './styles';

export const DropdownField = (props: DropdownProps) => {
  const {
    data,
    value,
    onChange,
    setIsOpened,
    openArrowIcon,
    closeArrowIcon,
    placeholder,
    isRequired,
    textColor,
    disabled,
    SelectedItemObject,
    buttonTextStyle,
    dropDownStyle,
  } = props;

  const { selectStyle } = useStyles(defaultStyles);

  const dataExist = data?.length > 0 || disabled;

  const renderIcon = (isOpened) => {
    if (!disabled) setIsOpened(isOpened);

    return (
      <ExtendedSVG
        svgFile={isOpened && !disabled ? openArrowIcon : closeArrowIcon}
        style={[selectStyle('chevron'), { opacity: disabled ? 0.6 : 1 }]}
      />
    );
  };

  return (
    <Dropdown
      data={
        dataExist
          ? data?.filter((item) => item?.label)
          : [{ label: '', value: placeholder }]
      }
      maxHeight={hp(280)}
      labelField="label"
      valueField="value"
      placeholder={`${placeholder}${isRequired ? '*' : ''}`}
      value={value}
      onChange={(selectedItem) => {
        SelectedItemObject
          ? onChange(selectedItem)
          : onChange(selectedItem?.value);
      }}
      style={[selectStyle('dropdown'), dropDownStyle]}
      placeholderStyle={[
        selectStyle('defaultText'),
        textColor && {
          color: textColor,
        },
        buttonTextStyle,
      ]}
      selectedTextStyle={[
        selectStyle('defaultText'),
        { color: textColor ?? 'black' },
        buttonTextStyle,
      ]}
      itemTextStyle={selectStyle('itemText')}
      renderLeftIcon={I18nManager.isRTL ? renderIcon : () => null}
      renderRightIcon={I18nManager.isRTL ? () => null : renderIcon}
      showsVerticalScrollIndicator={false}
      containerStyle={selectStyle('container')}
      itemStyle={selectStyle('itemStyle')}
    />
  );
};
