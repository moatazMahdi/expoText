import React from 'react';
import {View, ScrollView} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {useStyles, Typography} from 'elephanz-rn-ui';
import styles from './styles';
import {PageTitle} from 'components';
import DefaultButton from 'src/components/DefaultButton';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {BottomContainer} from 'src/components/BottomContainer';
import NavigationHeader from 'src/components/NavigationHeader';
import {
  getInstantApprovalProgress,
  saveInstantApprovalProgress,
} from 'src/utils/HelpersFunctions';
import {useRoute} from '@react-navigation/native';

export const ContinueLaterScreen: React.FC = props => {
  const stores = useStores();
  const {fromScreen} = (useRoute().params as any) || {};

  /* Hooks */
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  /* States */

  const continueLaterPressed = async () => {
    // Should Navigate to Home Screen
    const progress = await getInstantApprovalProgress();
    await saveInstantApprovalProgress(
      fromScreen === 'permissionsDisclaimer'
        ? {name: fromScreen, params: {}}
        : progress,
    );
    navigation.navigate('home');

    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'continue_later',
        parameters: {
          name: progress?.name,
          pressed: 'continue_later',
        },
      },
      stores,
    );
  };

  const keepGoingPressed = async () => {
    const progress = await getInstantApprovalProgress();
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'continue_later',
        parameters: {name: progress?.name, pressed: 'keep_going'},
      },
      stores,
    );
    navigation.goBack();
  };

  const renderContinueLaterButtons = () => (
    <View style={selectStyle('continueLaterButtonsContainer')}>
      <BottomContainer>
        <DefaultButton
          onPress={continueLaterPressed}
          title={translate('CONTINUE_LATER')}
        />
        <DefaultButton
          variant="secondaryBackground"
          mt={20}
          onPress={keepGoingPressed}
          title={translate('KEEP_GOING')}
        />
      </BottomContainer>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={selectStyle('container')}>
      <NavigationHeader showLogo shapeVariant="tangelo" title="" hideBack />
      <PageTitle title={translate('INSTANT_APPROVAL_SAVE_DONE')} />
      <Typography
        customStyles={() => ({text: selectStyle('continueLaterDescription')})}>
        {translate('YOU_CAN_CONTINUE_LATER')}
      </Typography>
      {renderContinueLaterButtons()}
    </ScrollView>
  );
};
