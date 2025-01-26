import {
  Item,
  Label,
} from 'native-base';
import React,
{
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RadioButtonProps,
} from './types';
import {
  defaultStyles,
} from './styles';
import {
  useStyles,
} from '../../../theming';
import {
  TextFieldLabelStyles,
} from '../TextField';
import {
  getItemLabelProp,
} from './utils';
import {
  Typography,
} from '../../dataDisplay';

export const RadioButton = (props: RadioButtonProps) => {
  const {
    onChange,
    value,
    labelProps,
    labelStyle = TextFieldLabelStyles.STACKED,
    label,
    itemProps,
    isHorizontal,
    options,
  } = props;
  const {
    selectStyle,
  } = useStyles(defaultStyles);
  const [selectedValue, setSelectedValue] = useState(value);
  return (
    <Item
      {...getItemLabelProp(labelStyle)}
      style={selectStyle('itemStyle', [labelStyle])}
      {...itemProps}
    >
      <Label
        style={selectStyle('labelStyle', [labelStyle])}
        {...labelProps}
      >
        {label}
      </Label>
      <View />
      <View style={[
        selectStyle('container'),
        {
          flexDirection: isHorizontal ? 'row' : 'column',
        },
      ]}
      >
        {
            options?.map((option) => (
              <TouchableOpacity
                style={selectStyle('content')}
                activeOpacity={1}
                onPress={() => {
                  setSelectedValue(option);
                  onChange(option);
                }}
              >
                <View style={selectStyle('option')}>
                  <View style={selectStyle('outerBullet')}>
                    {selectedValue === option && <View style={selectStyle('innerBullet')} />}
                  </View>
                  <Typography
                    color="black"
                    customStyles={() => ({
                      text: selectStyle('text'),
                    })}
                  >
                    {option}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))
          }
      </View>
    </Item>
  );
};

export * from './types';
