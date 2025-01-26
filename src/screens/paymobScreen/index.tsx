import React, {useState} from 'react';
import {View, TouchableOpacity, Alert, Platform} from 'react-native';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import Lottie from 'lottie-react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {ProviderType} from 'shared/DTOs/payment';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const paymobScreen: React.FC = () => {
  const route: any = useRoute();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {currentLanguage, translate} = useLocalization();
  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const stores = useStores();

  const {
    images: {
      common,
      screens: {instantApproval},
    },
  } = Assets;

  const goBack = () =>
    route?.params?.isEarly
      ? navigation.navigate('manageCredit')
      : navigation.goBack();

  const loadingView = () => (
    <View style={selectStyle('loadingStyle')}>
      <Lottie
        source={instantApproval.loadingLottie}
        autoPlay
        loop
        style={selectStyle('lottieContainer')}
      />
    </View>
  );

  if (stores.backend.payment.paymobRequestStatus === LoadingState.LOADING) {
    return loadingView();
  }

  if (stores.backend.payment.paymobRequestStatus === LoadingState.FAILED) {
    return (
      <>
        <View style={selectStyle('backContainer')}>
          <TouchableOpacity
            onPress={goBack}
            style={currentLanguage.isRTL ? selectStyle('backArrowArabic') : {}}>
            <View style={selectStyle('backButton')}>
              <common.back />
            </View>
          </TouchableOpacity>
        </View>

        <View style={selectStyle('indicatorContainer')}>
          <Typography> {translate('PAYMOB_ERROR_MESSAGE')} </Typography>
        </View>
      </>
    );
  }

  const handleShouldStartLoadWithRequest =
    route?.params?.provider === ProviderType.NOON
      ? request => {
          if (Platform.OS === 'ios' && isInitialLoad) {
            setIsInitialLoad(false);
            return true;
          }
          const matchedOrderId = request?.url?.match(/[?&]orderId=([^&]+)/);
          if (matchedOrderId) {
            const orderId = matchedOrderId[1];
            navigation.navigate('manageCredit', {orderId});
          } else if (Platform?.OS === 'android') {
            Alert.alert('', translate('ERROR'), [
              {
                text: translate('GENERIC_CONFIRM'),
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          }

          return true;
        }
      : () => true;

  if (route?.params?.url) {
    return (
      <View style={selectStyle('container')}>
        <View style={selectStyle('backContainer')}>
          <TouchableOpacity
            onPress={goBack}
            style={currentLanguage.isRTL ? selectStyle('backArrowArabic') : {}}>
            <View style={selectStyle('backButton')}>
              <common.back />
            </View>
          </TouchableOpacity>
        </View>

        <WebView
          containerStyle={selectStyle('fullScreen')}
          style={selectStyle('fullScreen')}
          scrollEnabled
          javaScriptEnabled
          source={{uri: route?.params?.url}}
          allowUniversalAccessFromFileURLs
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          startInLoadingState
          domStorageEnabled
          originWhitelist={['*']}
          allowFileAccess
          mixedContentMode="compatibility"
          bounces={false}
          scalesPageToFit
          onMessage={e => console.log(e.nativeEvent.data)}
          renderLoading={loadingView}
        />
      </View>
    );
  }
};

export const PaymobScreen = baseScreen(paymobScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
