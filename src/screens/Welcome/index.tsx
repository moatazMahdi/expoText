import React, { useState } from 'react';
import { View, I18nManager, Pressable, ScrollView, Alert } from 'react-native';
import { useStores, useLocalization, useNavigationUtils } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import { useRoute } from '@react-navigation/native';
import { TermsAndCondsModel } from './termsCondsModel';
import InstantApprovalCard from 'src/components/InstantApprovalCard';
import {
  getInstantApprovalProgress,
  handleReturnUserName,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import ManageYourBillsCard from 'src/components/ManageYourBillsCard';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import styles from './styles';

export const Welcome: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const stores = useStores();
  const navigation = useNavigationUtils();
  const { selectStyle } = useStyles(styles);
  const user = stores.backend.users.userData;
  const route = useRoute() || {};
  const { translate } = useLocalization();

  const renderTitle = () => (
    <View style={selectStyle('titleContainer')}>
      <Typography customStyles={() => ({ text: selectStyle('titleText') })}>
        {user?.name &&
          `${translate('WELCOME_ON_BOARD')} ${handleReturnUserName(user)}${
            I18nManager.isRTL ? '' : "'"
          } ${translate('WHAT_YOU_CAN_DO')}`}
        {!user?.name && `${translate('HEY')}, ${translate('WHAT_YOU_CAN_DO')}`}
      </Typography>
    </View>
  );

  const onContinuePressed = async () => {
    // navigation.navigate('referralScreen');
    const progress = await getInstantApprovalProgress();
    if (progress) {
      if (progress?.name !== 'congratulations') {
        navigation.navigate(progress);
      } else
        Alert.alert(
          translate('DEAR_CLIENT'),
          tempTranslate(
            progress?.params?.res?.message?.en,
            progress?.params?.res?.message?.ar,
          ),
        );
    } else {
      navigation.navigate('permissionsDisclaimer');
    }
  };

  const onBrowseNavigate = async () => {
    ApplicationAnalytics(
      {
        eventKey: 'browse-the-app',
        type:'CTA',
        parameters: {  ScreenName: route?.name,
          user: user?.id ? 'registered' : 'guest', },
      },
      stores,
    );

    // ApplicationAnalytics(
    //   {
    //     eventKey: 'browse_the_app',
    //     parameters: {
    //       user: user?.id ? 'registered' : 'guest',
    //     },
    //   },
    //   stores,
    // );
    navigation.resetTo({ name: 'home' });
  };

  const renderWelcomeCards = () => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingStart: 20 }}
        horizontal={true}
      >
        <HorizontalFlatListItemWrapper>
          <InstantApprovalCard welcome={true} />
        </HorizontalFlatListItemWrapper>
        {/* <HorizontalFlatListItemWrapper>
          <InvestMoneyCard welcome={true} comingSoon={true} />
        </HorizontalFlatListItemWrapper> */}
        {/* <HorizontalFlatListItemWrapper>
          <MeezaCard welcome={true} comingSoon={true} />
        </HorizontalFlatListItemWrapper> */}
        <HorizontalFlatListItemWrapper>
          <ManageYourBillsCard welcome />
        </HorizontalFlatListItemWrapper>
      </ScrollView>
    );
  };

  const renderBrowseTheApp = () => (
    <Pressable
      onPress={onBrowseNavigate}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Typography
        customStyles={() => ({ text: selectStyle('browseAppDescriptionText') })}
      >
        {translate('BROWSE_FOR_NOW')}
      </Typography>
    </Pressable>
  );

  return (
    <View style={selectStyle('mainContainer')}>
      <ScrollView
        style={selectStyle('mainContainer')}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {!user?.phone && (
          <NavigationHeader shapeVariant="orange" title={translate('SIGNUP')} />
        )}

        {renderTitle()}

        {renderWelcomeCards()}

        {renderBrowseTheApp()}
      </ScrollView>

      {/* <TermsAndCondsModel
       isOpen={isTermsOpen} 
       onCancel={() => setIsTermsOpen(false)}
        onAgree={onContinuePressed}/> */}
    </View>
  );
};
