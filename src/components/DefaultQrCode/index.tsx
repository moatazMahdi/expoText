import { View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import QRCode from 'react-native-qrcode-svg';

interface DefaultQRCodeInterface {
  qrValue: string;
  style?: ViewStyle;
  mt?: number;
  jc?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  wt?: string | number;
  ht?: string | number;
  size?: number;
}

const DefaultQRCode: React.FC<DefaultQRCodeInterface> = (props) => {
  const { qrValue, mt, jc, wt, ht, style, size } = props;

  const { selectStyle } = useStyles(styles);

  return (
    <View
      style={[
        selectStyle('container'),
        mt && { marginTop: hp(mt) },
        jc && { justifyContent: jc },
        wt && { width: wp(wt) },
        ht && { height: hp(ht) },

        style,
      ]}
    >
      {qrValue ? <QRCode size={hp(size)} value={qrValue} /> : null}
    </View>
  );
};

export default DefaultQRCode;
