import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import { Assets } from 'assets';
import SvgView from '../SvgView';

const InstallmentPaymentDisclaimer: React.FC = () => {
  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech }
    }
  } = Assets;

  const {
    theme: {
      palette: { common }
    }
  } = useTheme();

  return (
    <View style={selectStyle('container')}>
      <SvgView svgFile={creditech.AttentionIcon} fill={common.darkOrange} width={20} height={20} />
      <Typography
        customStyles={() => ({
          text: {
            flex: 1,
            flexWrap: 'wrap'
          }
        })}
        colorHex={common.darkOrange}
        marginLeft={16}
        fontWeight="500"
        fontSize={11}
      >
        {translate('PAYMENT_DISCLAIMER')}
      </Typography>
    </View>
  );
};

export default InstallmentPaymentDisclaimer;
