import React from 'react';
import {Linking, Platform, View} from 'react-native';
import {Typography, useStyles} from 'elephanz-rn-ui';
import ScrollContainerWithNavHeader from '../Wrappers/SafeAreaScrollContainer';
import SvgView from '../SvgView';
import DefaultButton from '../DefaultButton';
import styles from './styles';
import {Assets} from 'assets';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import {hp} from 'src/utils/Dimensions/dimen';

const NoInternetConnection: React.FC = () => {
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const {selectStyle} = useStyles(styles);

  const openWifiAndroid = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  };

  const handleWifiPress = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=WIFI');
    } else {
      openWifiAndroid();
    }
  };

  const renderContent = () => {
    return (
      <>
        <View style={selectStyle('ViewContainer')}>
          <SvgView svgFile={creditech.noInternet} width={245} height={245} />

          <Typography marginTop={hp(30)} fontWeight="700" fontSize={24}>
            {tempTranslate('No Internet Connection', 'لا يوجد اتصال بالانترنت')}
          </Typography>
        </View>

        <DefaultButton
          fromModal="noInternetConnection"
          onPress={handleWifiPress}
          title={tempTranslate('Refresh', 'تحديث')}
          mb={30}
        />
      </>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      noInternetModal="noInternetConnection"
      hideBack
      shapeVariant="orange">
      {renderContent()}
    </ScrollContainerWithNavHeader>
  );
};

export default NoInternetConnection;
