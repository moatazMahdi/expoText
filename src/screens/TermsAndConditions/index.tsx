import React from 'react';
import WebView from 'react-native-webview';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useStyles, useTheme } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import styles from './styles';

export const TermsAndConditions: React.FC = () => {
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const GDriveOpenURL = 'http://docs.google.com/gview?embedded=true&url=';

  return (
    <ScrollContainerWithNavHeader
      title={translate('TERMS_AND_CONDITIONS')}
      style={selectStyle('container')}
    >
      <WebView
        source={{
          uri:
            // Platform.OS === 'android'
            //   ? GDriveOpenURL + translate('TERMS_URL')
            //   :
            translate('TERMS_URL'),
        }}
        containerStyle={{
          width: '100%',
          height: '100%',
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        mixedContentMode="always"
        startInLoadingState
        scrollEnabled
        scalesPageToFit
        renderLoading={() => {
          return (
            <View style={selectStyle('container')}>
              <ActivityIndicator size={'large'} color={common.darkBlue} />
            </View>
          );
        }}
      />
    </ScrollContainerWithNavHeader>
  );
};
