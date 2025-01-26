import React from 'react';
import { View, Linking, Alert } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { Assets } from 'assets';
import ItemWithArrow from 'src/components/ItemWithArrow';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

const customerSupport: React.FC = () => {
  const stores = useStores();
  const navigation = useNavigationUtils();
  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const openWhatsApp = async () => {
    const string = translate('HELP');
    Linking.openURL(`whatsapp://send?text=${string}&phone=+20216177`).catch(
      () =>
        Alert.alert('', translate('NO_WHATSAPP'), [
          { text: translate('GENERIC_CONFIRM') },
        ]),
    );
    logAnalytics('Chat');
  };

  const logAnalytics = (action) => {
    ApplicationAnalytics(
      {
        type:"CTA",
        eventKey: 'contact_us',
        parameters: { action: action },
      },
      stores,
    );
  };
  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <ItemWithArrow
          title={translate('CALL_HOTLINE')}
          icon={creditech.Phone}
          marginTop={26}
          onPress={() => {
            Linking.openURL(`tel:${translate('HOT_LINE')}`);
            logAnalytics('Hotline');
          }}
          customArrow={creditech.OutArrow}
        />
        <ItemWithArrow
          title={translate('OUR_BRANCHES')}
          icon={creditech.LocationPin}
          marginTop={26}
          onPress={() => {
            logAnalytics('Branches');
            navigation.navigate('branches', {
              data: stores.backend.general.branches.data,
            });
          }}
        />
        <ItemWithArrow
          title={translate('SEND_UD_MESSAGE')}
          icon={creditech.Message}
          marginTop={26}
          onPress={() => {
            navigation.navigate('sendMessage');
            logAnalytics('Send message');
          }}
        />
        <ItemWithArrow
          title={translate('CHAT_WITH_US')}
          icon={creditech.whatsappOutlined}
          marginTop={26}
          onPress={() => openWhatsApp()}
        />
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="yellow"
      title={translate('CUSTOMER_SUPPORT')}
    >
      {renderContent()}
    </ScrollContainerWithNavHeader>
  );
};
export const CustomerSupport = baseScreen(customerSupport, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
