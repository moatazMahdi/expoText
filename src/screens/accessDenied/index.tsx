import {View} from 'react-native';
import React from 'react';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography} from 'elephanz-rn-ui';
import DefaultButton from 'src/components/DefaultButton';
import {useRoute} from '@react-navigation/native';

export const AccessDenied: React.FC = () => {
  const {navTo} = (useRoute().params as any) || {};

  const stores = useStores();
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();

  const signOutNavigate = async () => {
    stores.backend.users.role !== 'GUEST' ??
      (await stores.backend.auth.setSavedPhone(
        stores.backend.users.userData?.phone,
      ));
    stores.backend.auth.logout();
    navigation.reset({
      index: 0,
      routes: [{name: navTo ?? 'onboarding'}],
    });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Typography textAlign="center" fontSize={20} marginBottom={20}>
        {translate('NEED_TO_REGISTER')}
      </Typography>
      <DefaultButton title={translate('LOGIN')} onPress={signOutNavigate} />
    </View>
  );
};
