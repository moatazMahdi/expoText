import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Linking, Image} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {BottomContainer} from 'src/components/BottomContainer';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {hp, wp} from '../../../utils/Dimensions/dimen';
import {formatMoney} from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import {Typography, useStyles} from 'elephanz-rn-ui';
import SvgView from 'src/components/SvgView';
import {PageTitle} from 'components';
import {Assets} from 'assets';
import styles from './styles';

export const Congratulations: React.FC = () => {
  const {res, refContact, hasPromoCode, additionalDocs} =
    (useRoute().params as any) || {};
  const [clientValidate, setClientValidate] = useState('false');

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();
  const user = stores.backend.users.userData;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const fetchValidation = async () => {
    try {
      const data = await stores.backend.instantApproval.validateHybrid(
        user?.nationalId,
      );
      setClientValidate(data?.status);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  useEffect(() => {
    if (refContact?.name && refContact?.selectedPhone?.number) {
      stores?.backend?.users?.updateUser({
        refContact: {
          name: refContact?.name,
          phone: '+2' + refContact?.selectedPhone?.number,
        },
      });
    }

    ApplicationAnalytics(
      {
        eventKey: 'SubmitApplication',
        type: 'CTA',
        fbStandard: true,
      },
      stores,
    );
    if (res?.limit !== 0) {
      ApplicationAnalytics(
        {
          eventKey: 'SuccessfulApprovedLimit',
          type: 'STATUS',
        },
        stores,
      );
    } else {
      ApplicationAnalytics(
        {
          eventKey: 'rejectedLimit',
          type: 'STATUS',
        },
        stores,
      );
      fetchValidation();
    }
  }, []);

  const renderSVG = (type, promoCode?) => {
    const isSuccess = type === 'success';

    return (
      <View style={selectStyle('congratulationsSVGWrapper')}>
        <Image
          source={
            isSuccess
              ? creditech.congratulationsImage
              : creditech.applicationApprovalRejected
          }
          style={{width: hp(248), height: hp(248), alignSelf: 'center'}}
        />

        {!promoCode && isSuccess && (
          <Text style={selectStyle('limitText')}>
            {formatMoney(res?.limit)}
          </Text>
        )}
      </View>
    );
  };

  const renderDescription = (text, customStyle?) => (
    <Typography
      customStyles={() => ({
        text: {
          ...selectStyle('congratulationsDescription'),
          ...customStyle,
        },
      })}>
      {text}
    </Typography>
  );

  const renderCTAButton = (onPress, svgImage, text) => (
    <DropShadowWrapper mv={20} style={selectStyle('visitNearestBranchWrapper')}>
      <Pressable onPress={onPress}>
        <SvgView
          svgFile={svgImage}
          width={wp(35)}
          height={wp(45)}
          style={{alignSelf: 'flex-start'}}
        />

        <Typography
          customStyles={() => ({text: selectStyle('visitNearestBranchText')})}>
          {text}
        </Typography>
      </Pressable>
    </DropShadowWrapper>
  );

  const onActivateNearestBranch = (isSuccess?: boolean) => {
    if (clientValidate === 'true') {
      navigation.navigate('creditUpgrade', {title: 'Normal'});
    } else {
      navigation.navigate('branches', {
        data: stores.backend.general.branches.data,
      });
    }
    ApplicationAnalytics({
      eventKey: 'activate_limit_nearest_branch',
      type: 'CTA',
    });

    if (isSuccess == true) {
      ApplicationAnalytics(
        {
          eventKey: 'SuccessfulOnboardingApprovedLimit',
          type: 'STATUS',
          parameters: {action: 'atNearestBranch'},
        },
        stores,
      );
    } else {
      ApplicationAnalytics(
        {
          eventKey: 'RejectedOnboardingApprovedLimit',
          type: 'STATUS',
          parameters: {action: 'atNearestBranch'},
        },
        stores,
      );
    }
  };

  const onActivateRequestPhoneCall = () => {
    Linking.openURL(`tel:${translate('HOT_LINE')}`);

    ApplicationAnalytics(
      {eventKey: 'activate_limit_request_phone_call', type: 'CTA'},
      stores,
    );

    ApplicationAnalytics(
      {
        eventKey: 'SuccessfulOnboardingApprovedLimit',
        type: 'STATUS',
        parameters: {action: 'scheduleVisit'},
      },
      stores,
    );
  };

  const renderCongratulationsCTAs = () => {
    return (
      <View style={selectStyle('congratulationsCTAsWrapper')}>
        {renderCTAButton(
          () => onActivateNearestBranch(true),
          creditech.locationMarker,
          translate('SIGN_IN_BRANCH'),
        )}

        {renderCTAButton(
          onActivateRequestPhoneCall,
          creditech.Phone,
          translate('SIGN_WITH_PHONE'),
        )}
      </View>
    );
  };

  const renderContinueButton = () => {
    return (
      <BottomContainer>
        <DefaultButton
          title={translate('GO_HOME')}
          onPress={() => {
            ApplicationAnalytics(
              {
                eventKey: 'SuccessfulOnboardingApprovedLimit',
                type: 'STATUS',
                parameters: {action: 'GO_HOME'},
              },
              stores,
            );
            navigation.resetTo({name: 'home'});
          }}
        />
      </BottomContainer>
    );
  };

  const renderRejectContinueButton = () => {
    return (
      <View style={{justifyContent: 'flex-end'}}>
        <BottomContainer>
          <DefaultButton
            onPress={() => onActivateNearestBranch()}
            title={
              clientValidate === 'true'
                ? translate('REQUEST_MORE_INFO_BUTTON')
                : translate('VISIT_BRANCH')
            }
          />

          <DefaultButton
            mt={20}
            variant="secondaryBackground"
            title={translate('GO_HOME')}
            onPress={() => {
              ApplicationAnalytics(
                {
                  eventKey: 'RejectedOnboardingApprovedLimit',
                  type: 'STATUS',
                  parameters: {action: 'GO_HOME'},
                },
                stores,
              );
              navigation.resetTo({name: 'home'});
            }}
          />
        </BottomContainer>
      </View>
    );
  };

  if (hasPromoCode) {
    const text = `${translate(
      'PROMO_CODE_CONFIRMATION_HEADER',
    )}\n - ${translate('PROMO_CODE_DOC1')}\n - ${translate(
      'PROMO_CODE_DOC2',
    )}\n - ${translate('PROMO_CODE_DOC3')}`;

    return (
      <ScrollContainerWithNavHeader hideBack showLogo shapeVariant="orange">
        <PageTitle style={{width: 'auto'}} title={translate('CONGRATS')} />
        {renderSVG('success', true)}
        {renderDescription(text, {
          textAlign: 'justify',
          marginBottom: hp(30),
        })}
        {renderContinueButton()}
      </ScrollContainerWithNavHeader>
    );
  } else {
    let text;
    if (res?.limit !== 0) {
      text = `${translate('A_LIMIT_OF')} ${formatMoney(res?.limit)} ${translate(
        'HAS_BEEN_APPROVED',
      )} \n\n ${translate('HOW_TO_SIGN')}`;
      return (
        <ScrollContainerWithNavHeader hideBack showLogo shapeVariant="orange">
          <PageTitle style={{width: 'auto'}} title={translate('CONGRATS')} />
          {renderSVG('success')}
          {renderDescription(text)}
          {renderCongratulationsCTAs()}
          {renderContinueButton()}
        </ScrollContainerWithNavHeader>
      );
    }
    text = translate('INSTANT_APPROVAL_REJECT_DESC');
    return (
      <ScrollContainerWithNavHeader hideBack showLogo shapeVariant="tangelo">
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={creditech.rejectionVariantTwo}
            style={{
              width: hp(160),
              height: hp(160),
              alignSelf: 'center',
              marginBottom: 25,
            }}
          />
          <PageTitle
            title={
              clientValidate === 'true'
                ? translate('MISSING_DATA_INCOMPLETE_DOX_HEADLINE')
                : translate('INSTANT_APPROVAL_REJECT_TITLE')
            }
          />
          {renderDescription(
            clientValidate === 'true'
              ? translate('MISSING_DATA_INCOMPLETE_DOX_BODY')
              : translate('REJECTED_WITH_SHOWSTOPPER_REASON_BODY'),
          )}
        </View>

        {renderRejectContinueButton()}
      </ScrollContainerWithNavHeader>
    );
  }
};
