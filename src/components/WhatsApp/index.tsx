import React from 'react';
import { View, ViewStyle, Linking, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useStyles } from 'elephanz-rn-ui';
import { useLocalization, useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';
interface WhatsAppInterface {
  style?: ViewStyle;
  mt?: number;
  jc?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  wt?: string | number;
  serviceTitle?: string;
}

const WhatsApp: React.FC<WhatsAppInterface> = (props) => {
  const { mt, jc, wt, style, serviceTitle } = props;
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const route = useRoute() || {};
  const stores = useStores();

  const openWhatsApp = async () => {
    // ApplicationAnalytics(
    //   {
    //     eventKey: 'openWhatsapp',
    //     type:'CTA',
    //     parameters: { name: 'openWhatsapp', ScreenName: route?.name },
    //   },
    //   stores,
    // );

    const string = translate('HELP');
    Linking.openURL(`whatsapp://send?text=${string}&phone=+20216177`).catch(
      () =>
        Alert.alert('', translate('NO_WHATSAPP'), [
          { text: translate('GENERIC_CONFIRM') },
        ]),
    );
    // ApplicationAnalytics({
    //   eventKey: 'whatsApp_opened',
    //   type:'STATUS',
    //   parameters: {
    //     fromScreen: serviceTitle ? serviceTitle : 'service',
    //   },
    // });
  };

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <View
      style={[
        selectStyle('container'),
        mt && { marginTop: hp(mt) },
        jc && { justifyContent: jc },
        wt && { width: wp(wt) },
        style,
      ]}
    >
      <SvgView
        onPress={openWhatsApp}
        ms={15}
        svgFile={creditech.WhatsAppIcon}
        width={31}
        height={31}
      />
    </View>
  );
};

export default WhatsApp;
