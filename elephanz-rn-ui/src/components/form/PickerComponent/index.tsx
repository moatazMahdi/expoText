import {
  Picker,
} from 'native-base';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Platform,
  Text,
  View,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  FakeEvent,
} from '../types';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  PickerItem,
  PickerProps,
  PropStylesInterface,
} from './types';

export const PickerComponent: React.FC<PickerProps> = (props) => {
  // const focus = () => {
  //   if (pickerRef) {
  //     // todo
  //   }
  // };

  // const blur = () => {
  //   if (pickerRef) {
  //     // console.warn('blurred');
  //   }
  // };
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<Styles>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  const renderItems = (items: PickerItem[]) => {
    const {
      placeholder,
      textInactiveColor,
    } = props;
    const itemsToRender = [];
    if (Platform.OS === 'android') {
      itemsToRender.push(
        <Picker.Item
          label={placeholder}
          value={null}
          key={-1}
          color={textInactiveColor}
        />,
      );
    }
    items?.forEach((item) => {
      if (item && item.label && item.value) {
        itemsToRender.push(
          <Picker.Item
            label={item.label}
            value={item.value}
            key={itemsToRender.length - 1}
            color={textInactiveColor}
          />,
        );
      }
    });
    return itemsToRender;
  };

  const selectInputStyle = () => {
    const {
      pickerContainerActiveStyle,
      pickerWithLableStyle,
      hasLabel,
    } = props;
    if (hasLabel) {
      if (pickerWithLableStyle) {
        return pickerWithLableStyle;
      }
      return ([
        pickerWithLableStyle,
        styles.inputWithLableStyle,
      ]);
    }
    if (pickerContainerActiveStyle) {
      return pickerContainerActiveStyle;
    }
    return (styles.pickerContainerStyle);
  };

  const {
    textActiveColor,
    textInactiveColor,
    placeholder,
    value,
    onChange,
    onSubmitEditing,
    isPickerActive,
    handleChange,
    pickerItems,
    hasLabel,
    label,
  } = props;
  const textStyles: PropStylesInterface = {
    activePickerText: {
      fontWeight: '600',
      color: textActiveColor,
      width: '100%',
    },
    inactivePickerText: {
      fontWeight: '600',
      color: textInactiveColor,
      width: '100%',
    },
    activePickerPlaceholder: {
      color: textActiveColor || theme.palette.primary.contrast,
    },
    inactivePickerPlaceholder: {
      color: textInactiveColor || theme.palette.primary.disabledValue,
    },
  };
  return (
    <View
      style={selectInputStyle()}
    >
      {hasLabel && (
        <View style={styles.labelContainerStyle}>
          <Text>{label}</Text>
        </View>
      )}
      <View>
        <Picker
          placeholder={placeholder}
          mode="dropdown"
          selectedValue={value}
          onValueChange={(pickerValue: any) => {
            const fakeEvent: FakeEvent = {
              target: {
                value: pickerValue,
              },
            };
            handleChange(fakeEvent as any);
            if (onChange) {
              onChange(pickerValue);
            }
            if (pickerValue && onSubmitEditing) {
              onSubmitEditing();
            }
          }}
          placeholderStyle={
            [
              isPickerActive
                ? [textStyles.activePickerPlaceholder]
                : [textStyles.inactivePickerPlaceholder],
            ]
          }
          textStyle={
            [
              isPickerActive
                ? textStyles.activePickerText
                : textStyles.inactivePickerText,
            ]
          }
          enabled
        >
          {renderItems(pickerItems)}
        </Picker>
      </View>
    </View>
  );
};
