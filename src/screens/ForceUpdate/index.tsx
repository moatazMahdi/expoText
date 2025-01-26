import React from 'react';
import { View, Linking, Platform } from 'react-native';
import { useLocalization } from 'hooks';
import { useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultButton from 'src/components/DefaultButton';
import SvgView from 'src/components/SvgView';
import { hp } from 'src/utils/Dimensions/dimen';
import { androidStoreURL, iosStoreURL } from 'src/utils/Constants';

const forceUpdateScreen: React.FC = () => {
  const { translate } = useLocalization();
  const { selectStyle } = useStyles(styles);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const routeToCorrespondingStore = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(androidStoreURL);
    } else {
      Linking.openURL(iosStoreURL);
    }
  };

  return (
    <ScrollContainerWithNavHeader hideBack>
      <View style={selectStyle('container')}>
        <SvgView
          svgFile={creditech.ContactNow}
          width={65}
          height={35}
          style={selectStyle('imageContainer')}
          fill="#082483"
        />

        <DefaultButton
          disabled={false}
          onPress={routeToCorrespondingStore}
          title={translate('FORCE_UPDATE_BUTTON_UPDATE')}
          buttonStyle={{ height: hp(50) }}
          titleStyle={{ fontWeight: '600' }}
        />
      </View>
    </ScrollContainerWithNavHeader>
  );
};

export const ForceUpdateScreen = baseScreen(forceUpdateScreen, {
  allowedRoles: ['ADMIN', 'USER', 'GUEST', 'NONE'],
});
