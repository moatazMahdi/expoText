import React from 'react';
import { I18nManager, Image, View } from 'react-native';
import { observer } from 'mobx-react';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { contactPayIframeURL } from 'src/utils/Constants';
import { Typography, useStyles } from 'elephanz-rn-ui';
import BillOptionsCard from '../BillOptionsCard';
import { hp } from 'src/utils/Dimensions/dimen';
import DefaultButton from '../DefaultButton';
import { Assets } from 'assets';
import styles from './styles';

const BillPaymentCard = () => {
  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();

  const stores = useStores();
  const { userData } = stores.backend.users;
  const accessToken = stores.backend.auth.getAccessToken();
  const refreshToken = stores.backend.auth.getRefreshToken();
  const baseUrl = `${contactPayIframeURL}/?lang=${
    I18nManager.isRTL ? 'ar' : 'en'
  }&phone=${userData?.phone}&nationalId=${userData?.nationalId}&name=${
    userData?.name
  }&token=${accessToken}&refreshToken=${refreshToken}`;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const onManageMyBillsPress = () => navigation.navigate('manageMyBills');

  const renderHeader = () => (
    <View style={selectStyle('headerContainer')}>
      <Image
        source={creditech.ManageBills}
        style={selectStyle('BillPaymentIcon')}
        resizeMode="contain"
      />
      <Typography
        fontWeight="700"
        fontSize={16}
        colorHex="#333333"
        marginLeft={12}
      >
        {translate('BILLS')}
      </Typography>
    </View>
  );

  const renderBody = () => (
    <View style={selectStyle('optionsContainer')}>
      <BillOptionsCard
        compact
        icon={creditech.Telecom}
        title={translate('TELECOM')}
        link={`${baseUrl}&id=3`}
      />
      <BillOptionsCard
        compact
        icon={creditech.Donations}
        title={translate('DONATIONS')}
        link={`${baseUrl}&id=2`}
      />
      <BillOptionsCard
        compact
        icon={creditech.BillMore}
        title={translate('MORE')}
      />
    </View>
  );

  const handleOuickPay = () => {
    navigation.navigate('billPayment', {
      link: `${baseUrl}&quickPay=true`,
    });
    ApplicationAnalytics(
      {
        eventKey: 'bill_payment',
        type: 'CTA',
        parameters: {
          action: 'quickPay',
        },
      },
      stores,
    );
  };

  const renderFooter = () => (
    <View style={selectStyle('buttonsContainer')}>
      <DefaultButton
        titleStyle={{
          fontSize: hp(12),
        }}
        variant="secondaryBackground"
        title={translate('MANAGE_MY_BILLS')}
        onPress={onManageMyBillsPress}
        buttonStyle={selectStyle('buttonStyle')}
      />
      <DefaultButton
        titleStyle={{
          fontSize: hp(12),
        }}
        variant="secondaryBackground"
        title={translate('QUICK_PAY')}
        onPress={handleOuickPay}
        buttonStyle={selectStyle('buttonStyle')}
      />
    </View>
  );

  return (
    <View style={selectStyle('PannerHomeContainer')}>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </View>
  );
};

export default observer(BillPaymentCard);
