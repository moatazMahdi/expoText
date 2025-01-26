import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import SvgView from '../SvgView';

interface DynamicDisclaimerInterface {
  text: string;
  withBackground?: boolean;
  textColor?: string;
  iconColor?: string;
  icon?: any;
  customStyle?: any;
}
const DynamicDisclaimer: React.FC<DynamicDisclaimerInterface> = (props) => {
  const { selectStyle } = useStyles(styles);

  const { text, withBackground, iconColor, textColor, icon, customStyle } =
    props;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  return (
    <View
      style={[
        selectStyle('container'),
        withBackground && selectStyle('containerWithBackground'),
        customStyle,
      ]}
    >
      <SvgView
        svgFile={icon ?? creditech.AttentionIcon}
        fill={iconColor ?? common.placeHolderText}
        width={20}
        height={20}
      />
      <Typography
        customStyles={() => ({
          text: {
            ...selectStyle('textStyle'),
            color: textColor ?? common.placeHolderText,
          },
        })}
        marginLeft={16}
        fontWeight="500"
        fontSize={11}
      >
        {text}
      </Typography>
    </View>
  );
};

export default DynamicDisclaimer;
