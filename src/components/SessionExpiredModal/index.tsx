import {View} from 'react-native';
import React from 'react';
import styles from './styles';
import {Typography, useStyles} from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import {observer} from 'mobx-react';
import DefaultModal from '../DefaultModal';
import {NavigationContainerRef} from '@react-navigation/native';
import {useLocalization, useStores} from 'hooks';
import DefaultButton from '../DefaultButton';
import ReactNativeRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginAlerModalInterface {
  rootNavigator: React.MutableRefObject<NavigationContainerRef | null>;
}

const SessionExpiredModal: React.FC<LoginAlerModalInterface> = () => {
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();

  const stores = useStores();
  const {sessionExpiredModalView} = stores.backend.users;

  const renderModalContent = () => {
    return (
      <DropShadowWrapper style={selectStyle('modalContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}>
          {translate('SESSION_EXPIRED')}
        </Typography>
        <Typography
          customStyles={() => ({
            text: selectStyle('bodyText'),
          })}>
          {translate('LOG_IN_AGAIN')}
        </Typography>
        <View style={{justifyContent: 'flex-end', margin: 0, flex: 1}}>
          <DefaultButton
            titleStyle={selectStyle('buttonText')}
            onPress={async () => {
              await AsyncStorage.removeItem('dynamicLink');
              stores.backend.auth.logout();
              ReactNativeRestart.Restart();
            }}
            buttonStyle={selectStyle('buttonStyle')}
            title={translate('GENERIC_CONFIRM')}
            fromModal="sessionExpiredModal"
          />
        </View>
      </DropShadowWrapper>
    );
  };

  return (
    <DefaultModal
      hideModalViewStyle
      isVisible={sessionExpiredModalView}
      onCloseModal={() => {
        stores.backend.auth.logout();
        ReactNativeRestart.Restart();
      }}>
      {renderModalContent()}
    </DefaultModal>
  );
};

export default observer(SessionExpiredModal);
