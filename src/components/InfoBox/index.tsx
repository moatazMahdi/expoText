import React, { FC } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import SvgView from '../SvgView';
import { SvgProps } from 'react-native-svg';
import { Typography, useStyles } from 'elephanz-rn-ui';
import styles from './styles';
import { useLocalization } from 'hooks';
import { Assets } from 'assets';

interface InfoBoxProps {
  messageKey?: string;
  messageText?: string;
  iconName?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  leftBarColor?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  svgIcon?: FC<SvgProps>;
  additionalText?: string;
}
const {
  images: {
    screens: { creditech },
  },
} = Assets;
const InfoBox: React.FC<InfoBoxProps> = ({
  messageKey,
  messageText,
  iconColor = '#FFA500',
  svgIcon = creditech.AttentionIcon,
  backgroundColor = '#FFF3E0',
  textColor = '#FFA500',
  leftBarColor = '#FFA500',
  containerStyle,
  textStyle,
  additionalText = '',
}) => {
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  return (
    <View style={[selectStyle('wrapper'), containerStyle]}>
      <View
        style={[selectStyle('leftBar'), { backgroundColor: leftBarColor }]}
      />
      <View style={[selectStyle('container'), { backgroundColor }]}>
        <SvgView
          stroke={iconColor}
          svgFile={svgIcon}
          width={28}
          height={28}
          style={selectStyle('icon')}
        />
        <Typography
          customStyles={() => ({
            text: { ...selectStyle('text'), color: textColor, textStyle },
          })}
        >
          {messageText
            ? `${messageText} ${additionalText} `
            : `${translate(messageKey)} ${additionalText} `}
        </Typography>
      </View>
    </View>
  );
};

export default InfoBox;
