import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, I18nManager} from 'react-native';
import {useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import Lottie from 'lottie-react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {contactPayIframeURL} from 'src/utils/Constants';
import {useNavigationUtils, useStores} from 'hooks';
import {hp} from 'src/utils/Dimensions/dimen';
import {useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import {getInstantApprovalProgress} from 'src/utils/HelpersFunctions';

const billPayment: React.FC = () => {
  const {link} = (useRoute().params as {link: string}) || {};

  const [webViewCanGoBack, setWebViewCanGoBack] = useState(false);

  const {selectStyle} = useStyles(styles);
  const {goBack, navigate} = useNavigationUtils();

  const stores = useStores();
  const {userData, controlSessionExpiredModalView} = stores.backend.users;
  const accessToken = stores.backend.auth.getAccessToken();
  const refreshToken = stores.backend.auth.getRefreshToken();
  const webViewRef = useRef();

  const {
    images: {
      screens: {instantApproval},
    },
  } = Assets;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const handleBackAction = () => {
    const webView: {goBack(): () => {}} = webViewRef.current;
    if (webViewCanGoBack) webView.goBack();
    else {
      goBack();
    }
  };

  const handleOnMessage = async message => {
    const msg = message?.nativeEvent?.data;
    if (msg == 'EXPIRED') {
      controlSessionExpiredModalView(true);
    } else if (msg == 'permissionsDisclaimer') {
      const progress = await getInstantApprovalProgress();
      navigate(progress ?? msg);
    } else navigate(msg);
  };

  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <WebView
          ref={webViewRef}
          startInLoadingState={true}
          cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
          onLoadProgress={({nativeEvent}) => {
            Platform.OS === 'android' &&
              setWebViewCanGoBack(nativeEvent.canGoBack);
          }}
          onLoadEnd={({nativeEvent}) => {
            Platform.OS === 'ios' && setWebViewCanGoBack(nativeEvent.canGoBack);
          }}
          renderLoading={() => (
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: hp(400),
              }}>
              <Lottie
                source={instantApproval.loadingLottie}
                autoPlay
                loop
                style={selectStyle('lottieContainer')}
              />
            </View>
          )}
          onMessage={handleOnMessage}
          source={{
            uri:
              link ??
              `${contactPayIframeURL}/?lang=${
                I18nManager.isRTL ? 'ar' : 'en'
              }&phone=${userData?.phone}&nationalId=${
                userData?.nationalId
              }&name=${
                userData?.name
              }&token=${accessToken}&refreshToken=${refreshToken}`,
          }}
        />
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      showFloatingActionButton
      floatBot={40}
      showLogo
      onPress={handleBackAction}>
      {renderContent()}
    </ScrollContainerWithNavHeader>
  );
};
export const BillPayment = baseScreen(billPayment, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
