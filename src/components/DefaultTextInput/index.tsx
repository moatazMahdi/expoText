import React from 'react';
import { View, TextInput } from 'react-native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { DefaultTextInputInterface } from 'src/Types';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import DefaultSeparator from '../DefaultSeparator';
import SvgView from '../SvgView';
import styles from './styles';

const DefaultTextInput: React.FC<DefaultTextInputInterface> = (props) => {
  const {
    editable,
    changed,
    value,
    placeHolder,
    title,
    onchangeText,
    mt,
    icon,
    textOnly,
    iconStyle,
    iconWidth,
    iconHeight,
    textInputStyle,
    onPress,
    inputContainer,
    viewStyle,
    startIcon,
    startIconWidth,
    startIconHeight,
    svgProps,
    noSeparator
  } = props;

  const { selectStyle } = useStyles(styles);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const renderTitle = () => {
    return (
      <View style={selectStyle('titleMainView')}>
        {noSeparator ? <View style={{width:wp(30)}}/> :<DefaultSeparator width={wp(30)} ms={5} />}
        

        <Typography
          fontWeight="bold"
          customStyles={() => ({ text: selectStyle('titleStyle') })}
        >
          {title}
        </Typography>
        {noSeparator ? null : <DefaultSeparator me={5} />}
       
      </View>
    );
  };

  return (
    <>
      {title && renderTitle()}

      <View
        style={[
          selectStyle('container'),
          { marginTop: title ? hp(4) : hp(15) },
          viewStyle,
        ]}
      >
        <View
          style={[
            !textOnly
              ? [selectStyle('editableInput')]
              : changed // item.changed
              ? selectStyle('textOnlyChanged')
              : selectStyle('textOnly'),
            mt && { marginTop: hp(mt) },
            (icon || startIcon) && {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
            inputContainer,
          ]}
        >
          {startIcon && (
            <SvgView
              svgFile={startIcon}
              width={startIconWidth || 11}
              height={startIconHeight || 19}
              me={15}
              ms={15}
              {...svgProps}
            />
          )}

          <TextInput
            style={[selectStyle('textInputStyle'), textInputStyle]}
            value={value}
            editable={editable || !textOnly}
            placeholder={placeHolder ?? title}
            placeholderTextColor={common.placeHolderText}
            onChangeText={(text) => onchangeText(text)}
            keyboardType={'default'}
            {...props}
          />

          {icon && (
            <SvgView
              svgFile={icon}
              width={iconWidth || 25}
              height={iconHeight || 25}
              onPress={onPress || null}
              style={iconStyle}
              {...svgProps}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default DefaultTextInput;
