import {
  Input,
  Item,
  Label,
  View,
} from 'native-base';
import React,
{
  useEffect,
  useState,
} from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {
  TextFieldLabelStyles,
  TextFieldProps,
} from './types';
import {
  defaultStyles,
} from './styles';
import {
  useStyles,
  useTheme,
} from '../../../theming';
import {
  getItemLabelProp,
} from './utils';
import {
  ExtendedSVG,
  Typography,
} from '../../dataDisplay';
import error from '../../../assets/images/error.svg';
import passwordEye from '../../../assets/images/passwordEye.svg';

export const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    onChange,
    value,
    disabled,
    isFocused = false,
    onBlur,
    onFocus,
    label,
    itemProps = {},
    labelProps = {},
    styles,
    isPassword,
    unit,
    rightTitle,
    rightHint,
    haseErrors = false,
    hint,
    keyboardType = 'default',
    labelStyle = TextFieldLabelStyles.STACKED,
  } = props;
  const {
    theme: {
      palette: {
        others,
        error: errorColor,
      },
      spacing: {
        spacing,
      },
    },
  } = useTheme();
  const {
    selectStyle,
  } = useStyles(defaultStyles, styles);
  const [
    hidePassword,
    setHidePassword,
  ] = useState(true);
  const [inputRef, setInputRef] = useState<Input | undefined>();
  useEffect(() => {
    if (!inputRef) {
      return;
    }
    if (isFocused) {
      // (inputRef as any)._root.focus();
    } else {
      // (inputRef as any)._root.blur();
    }
  }, [
    isFocused,
  ]);
  return (
    <View>
      <Item
        {...getItemLabelProp(labelStyle)}
        style={selectStyle('itemStyle', [labelStyle])}
        {...itemProps}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
        >
          <Label
            style={[
              selectStyle('labelStyle', [labelStyle]),
              {
                color: haseErrors ? errorColor.value : others.title,
              },
            ]}
            {...labelProps}
          >
            {label}
          </Label>
          {rightTitle && (
          <Label
            style={selectStyle('rightTitle')}
          >
            {rightTitle}
          </Label>
          )}
        </View>
        <Input
          ref={(ref) => {
            if (ref) {
              setInputRef(ref);
            }
          }}
          value={value}
          onChange={(e) => {
            const newValue = e.nativeEvent.text;
            onChange(newValue);
          }}
          secureTextEntry={isPassword && hidePassword}
          keyboardType={keyboardType}
          disabled={disabled}
          label={label}
          onBlur={onBlur}
          onFocus={onFocus}
          style={[selectStyle('inputStyle', [labelStyle]), selectStyle('error', [haseErrors])]}
        //  {...inputProps}
        />
        {
        isPassword && !haseErrors
        && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setHidePassword(!hidePassword)}
          style={selectStyle('eye')}
        >
          <ExtendedSVG
            svgFile={passwordEye}
          />
        </TouchableOpacity>
        )
      }
        {
        haseErrors
        && (
        <View
          style={selectStyle('errorIcon')}
        >
          <ExtendedSVG
            svgFile={error}
          />
        </View>
        )
      }

        {unit && !haseErrors && (
        <Typography
          variant="subtitle2"
          customStyles={() => ({
            text: {
              ...selectStyle('unit'),
              top: hint ? spacing(7) : spacing(6.5),
            },
          })}
        >
          {unit}
        </Typography>
        )}
        {hint && (
        <Typography
          isCustomColor
          color="disabledText"
          variant="subtitle2"
          customStyles={() => ({
            text: selectStyle('hint'),
          })}
        >
          {hint}
        </Typography>
        )}
      </Item>
      {rightHint && (
      <View
        style={selectStyle('rightHint')}
      >
        {rightHint}
      </View>
      )}
    </View>

  );
};

export * from './types';
