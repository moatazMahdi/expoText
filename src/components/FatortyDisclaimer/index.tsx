import React from 'react';
import { View } from 'react-native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { FatortyDisclaimerInterface } from 'src/Types';
import GetStartedButton from '../GetStartedButton';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';

const FatortyDisclaimer: React.FC<FatortyDisclaimerInterface> = (props) => {
  const { title, buttonTitle, onPress, svgColor, svgIcon, backColor, style } =
    props;

  const { selectStyle } = useStyles(styles);

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
        selectStyle('creditMessageContainer'),
        backColor && { backgroundColor: backColor },
        style,
      ]}
    >
      <RowView>
        <SvgView stroke={svgColor} svgFile={svgIcon} width={20} height={20} />

        <Typography
          customStyles={() => ({
            text: selectStyle('creditMessageText'),
          })}
        >
          {title}
        </Typography>
      </RowView>

      <GetStartedButton
        ms={30}
        svgFile={creditech.BlackLongArrow}
        textStyle={{ color: common.darkBlue }}
        onPress={onPress}
        title={buttonTitle}
      />
    </View>
  );
};

export default FatortyDisclaimer;
