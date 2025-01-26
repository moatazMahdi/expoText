import {View} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {Typography, useStyles} from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import {observer} from 'mobx-react';
import DefaultModal from '../DefaultModal';
import {NavigationContainerRef} from '@react-navigation/native';
import {useLocalization, useStores} from 'hooks';
import RowView from '../Wrappers/RowView';
import DefaultButton from '../DefaultButton';

interface LoginAlerModalInterface {
  rootNavigator: React.MutableRefObject<NavigationContainerRef | null>;
  dynamicLink: string;
}

const LoginAlertModal: React.FC<LoginAlerModalInterface> = props => {
  const {rootNavigator, dynamicLink} = props;
  const stores = useStores();
  const {loginModalView, controlLoginModalView, setDynamicLink} =
    stores.backend.users;
  const {translate} = useLocalization();

  const {selectStyle} = useStyles(styles);

  useEffect(() => {
    if (dynamicLink) {
      setDynamicLink(dynamicLink);
    }
  }, [dynamicLink]);

  const onCLoseModal = () => {
    controlLoginModalView(false);
  };

  const onNavigateLogin = () => {
    rootNavigator.current?.reset({
      index: 0,
      routes: [{name: 'onboarding'}],
    });
    onCLoseModal();
  };

  const renderModalContent = () => {
    return (
      <DropShadowWrapper style={selectStyle('modalContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}>
          {translate('AUTH_REQUIRED')}
        </Typography>
        <Typography
          customStyles={() => ({
            text: selectStyle('bodyText'),
          })}>
          {translate('LOGIN_REQUIRED')}
        </Typography>
        <View style={{justifyContent: 'flex-end', margin: 0, flex: 1}}>
          <RowView jc="space-around">
            <DefaultButton
              titleStyle={selectStyle('buttonText')}
              onPress={onNavigateLogin}
              buttonStyle={selectStyle('buttonStyle')}
              title={translate('LOGIN')}
              fromModal="loginAlertModal"
            />
            <DefaultButton
              titleStyle={selectStyle('buttonText')}
              onPress={onCLoseModal}
              variant="secondary"
              buttonStyle={selectStyle('buttonStyle')}
              title={translate('CANCEL')}
              fromModal="loginAlertModal"
            />
          </RowView>
        </View>
      </DropShadowWrapper>
    );
  };

  return (
    <DefaultModal
      hideModalViewStyle
      isVisible={loginModalView}
      onCloseModal={onCLoseModal}>
      {renderModalContent()}
    </DefaultModal>
  );
};

export default observer(LoginAlertModal);
