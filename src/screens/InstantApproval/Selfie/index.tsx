import React, {useEffect, useState} from 'react';
import {Pressable, Image} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {ContinueButton, PageTitle} from 'components';
import {useRoute} from '@react-navigation/native';
import {uploadDocs} from 'utils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {saveInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
import DropShadowWrapper from '../../../components/Wrappers/DropShadowWrapper/index';
import SvgView from 'src/components/SvgView';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

export const Selfie: React.FC = () => {
  const stores = useStores();
  const navigation = useNavigationUtils();
  const [selfiePic, setSelfiePic] = useState(null);
  const [selfieLink, setSelfieLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const params = useRoute().params as any;
  const {
    nationalId,
    categoriesData,
    userInputNationalId,
    referralType,
    referralCode,
    hasPromoCode,
  } = params || {};

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    ApplicationAnalytics({eventKey: 'successfulSelfie', type: 'CTA'}, stores);
    // Save Progress First Before Navigating to Next Screen
    const progress = {
      name: 'personalData',
      params: {
        userInputNationalId,
        nationalId,
        categoriesData,
        selfiePic: selfieLink,
        referralType,
        referralCode,
        hasPromoCode,
      },
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate(progress);
    setIsLoading(false);
  };

  const uploadSelfiePic = async () => {
    try {
      setIsLoading(true);
      const userData = stores.backend.users.userData;
      const token = stores.backend.auth.getAccessToken();
      let getSelfieLink = await uploadDocs({
        token,
        fileType: 'image/jpeg',
        id: `${userData.id}_${new Date().getTime()}_InstantSelfiePic`,
        photoURI: selfiePic.uri,
      });
      setSelfieLink(getSelfieLink);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const onCompleteSelfie = () => {
    selfiePic ? navigateToNextScreen() : null;
    // navigation.navigate('personalData', { userInputNationalId, nationalId, categoriesData, selfiePic: selfieLink });
  };

  useEffect(() => {
    if (selfiePic?.uri) {
      uploadSelfiePic();
    }
  }, [selfiePic]);

  const renderSelfiePic = () => {
    return (
      <Pressable
        style={selectStyle('selfieContainer')}
        // onPress={() => navigation.navigate('selfieCamera', { setSelfiePic })}
      >
        {!selfiePic?.url && <SvgView svgFile={creditech.avatar} />}
        {selfiePic?.url && (
          <Image
            source={{uri: selfiePic.url}}
            style={selectStyle('selfieImage')}
          />
        )}
      </Pressable>
    );
  };

  const renderTakeSelfieButton = () => {
    return (
      <DropShadowWrapper style={selectStyle('takeSelfieButtonContainer')}>
        <Pressable
          style={selectStyle('selfieButton')}
          onPress={() => {
            if (!selfiePic?.url) {
              ApplicationAnalytics(
                {eventKey: 'selfie_capture', type: 'CTA'},
                stores,
              );
            } else {
              ApplicationAnalytics(
                {eventKey: 'selfie_retake', type: 'CTA'},
                stores,
              );
            }
            navigation.navigate('selfieCamera', {
              setSelfiePic,
              title: translate('TAKE_SELFIE'),
            });
          }}>
          {!selfiePic?.url && (
            <SvgView
              width={34}
              height={34}
              svgFile={creditech.takeSelfieButton}
            />
          )}
          {selfiePic?.url && (
            <SvgView
              width={34}
              height={34}
              svgFile={creditech.retakeSelfieButton}
            />
          )}
        </Pressable>
      </DropShadowWrapper>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader hideBack shapeVariant="yellow" showLogo>
        <ContinueLater fromScreen="selfie" />
        <PageTitle title={translate('TAKE_SELFIE')} />
        {renderSelfiePic()}
        {renderTakeSelfieButton()}
        {isLoading && (
          <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
        )}
        <ContinueButton
          back
          onContinuePressed={onCompleteSelfie}
          completeForm={selfiePic ? true : false}
        />
      </ScrollContainerWithNavHeader>
    </>
  );
};
