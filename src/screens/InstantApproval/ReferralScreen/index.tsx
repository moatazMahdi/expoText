import React, { useState } from 'react';
import { Alert, I18nManager, View } from 'react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import DefaultTextInput from 'src/components/DefaultTextInput';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { ContinueLater } from 'src/components/ContinueLater';
import DefaultDropdown from 'src/components/DefaultDropdown';
import { ContinueButton, PageTitle } from 'components';
import {
  referralTypes,
  referralTypesEn,
} from 'src/screens/InstantApproval/clientInfo/data';
import { hp } from 'src/utils/Dimensions/dimen';
import { useStyles } from 'elephanz-rn-ui';
import {
  getTextColor,
  saveInstantApprovalProgress,
} from 'src/utils/HelpersFunctions';
import styles from './styles';

export const ReferralScreen: React.FC = () => {
  const [referralType, setReferralType] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  let employeeReferralValue: boolean =
    referralType === 'Family and Friends' ||
    referralType === 'العائلة والأصدقاء';
  const spaceBetween = { marginBottom: hp(20) };

  const checkPromoCode = async () => {
    try {
      setIsLoading(true);
      return await stores.backend.instantApproval.checkPromoCode(referralCode);
    } catch (e) {
      setIsLoading(false);
      Alert.alert('', translate('ERROR'), [
        { text: translate('GENERIC_CONFIRM') },
      ]);
    }
  };

  const navigateToNextScreen = async () => {
    let hasPromoCode = undefined;
    setIsLoading(true);

    const referral = (skip?) => {
      hasPromoCode = null;
      const main = {
        type: 'CTA',
        eventKey: skip ? 'know_about_us_skip' : 'how_did_you_know_about_us',
      };

      ApplicationAnalytics(
        skip
          ? main
          : {
              ...main,
              parameters: {
                referralType: referralType ?? '',
                referralCode: referralCode ?? '',
              },
            },

        stores,
      );
    };

    if (referralType) {
      if (referralCode) {
        if (employeeReferralValue && referralCode) {
          hasPromoCode = await checkPromoCode();
        } else referral();
      } else referral();
    } else referralCode ? referral() : referral(true);

    //if still undefined so check promo called and failed
    //null main that there no promo check
    if (hasPromoCode === true || hasPromoCode === null) {
      const progress = {
        name: 'scanNID',
        params: {
          referralType: employeeReferralValue ? 'Employee' : referralType,
          referralCode,
          hasPromoCode: hasPromoCode,
        },
      };

      await saveInstantApprovalProgress(progress);
      setIsLoading(false);
      navigation.navigate(progress);
    } else if (hasPromoCode === false) {
      Alert.alert('', translate('INVALID_PROMO_CODE'), [
        { text: translate('GENERIC_CONFIRM') },
      ]);
    }

    setIsLoading(false);
  };

  const listReferralTypes = () => {
    const referralTypesList = I18nManager.isRTL
      ? referralTypes?.map((item) => ({ label: item, value: item }))
      : referralTypesEn?.map((item) => ({ label: item, value: item }));
    return referralTypesList;
  };

  const renderReferralTypesList = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          data={listReferralTypes()}
          placeholder={translate('HOW_DID_YOU_KNOW_ABOUT_US')}
          value={referralType}
          onChange={(item) => {
            setReferralType(item);
          }}
          textColor={getTextColor(referralType)}
        />
      </View>
    );
  };

  const renderReferralCode = () => {
    return (
      <DefaultTextInput
        editable={true}
        value={referralCode}
        placeholder={translate('IF_YOU_HAVE_CODE_WRITE_HERE')}
        onchangeText={(text) => setReferralCode(text)}
      />
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      showLogo
      hideBack
      removeCapitalization
    >
      <KeyboardAwareScrollView style={selectStyle('mainContainer')}>
        <ContinueLater fromScreen="referralScreen" />

        <PageTitle title={translate('HOW_DID_YOU_KNOW_ABOUT_US')} />

        {renderReferralTypesList()}

        {renderReferralCode()}
      </KeyboardAwareScrollView>

      <ContinueButton
        back
        onContinuePressed={navigateToNextScreen}
        completeForm={true}
        loading={isLoading}
        containerStyle={selectStyle('continueContainerButton')}
      />

      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </ScrollContainerWithNavHeader>
  );
};
