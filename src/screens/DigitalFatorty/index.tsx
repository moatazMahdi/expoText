import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image} from 'react-native';
import {View} from 'native-base';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import InstantApprovalTOSModal from 'src/components/InstantApprovalTOSModal';
import {
  checkUserInstantApprovalStatus,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {BottomContainer} from 'src/components/BottomContainer';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import GetStartedButton from 'src/components/GetStartedButton';
import DefaultButton from 'src/components/DefaultButton';
import RowView from 'src/components/Wrappers/RowView';
import CameraModal from 'src/components/cameraModel';
import {hp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import {useRoute} from '@react-navigation/native';

const digitalFatorty: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [gallery, setGallery] = React.useState<boolean>();
  const [thumbnail, setThumbnail] = useState(null);
  const [toView, setToView] = useState('digitalFatorty');
  const [photo, setPhoto] = useState(null);
  const [isInvoice, setIsInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {translate} = useLocalization();

  //isLoading
  const instructions = translate('FATORTY_INSTRUCTIONS').split(',');

  const [approvementPoints, setApprovementPoints] = useState({
    type: 'info',
    points: instructions,
    isEligible: true,
  });

  //approvementPoints
  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const stores = useStores();

  const userCredit = stores.backend.users.userCredits.data;
  const user = stores.backend.users.userData;
  const fatortyCheckStatus = async () => {
    return await stores.backend.products.getFatortyCheck();
  };

  const params =
    (useRoute()?.params as {
      openCameraModal?: boolean;
      isInvoice?: boolean;
      isInvoiceError?: boolean;
      isAgreed?: boolean;
      approvementPointsData?: any;
    }) ?? {};

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    setIsInvoice(params?.isInvoiceError);
    if ((params.openCameraModal === true, params.isInvoice === false)) {
      setShowModal(true);
    }

    // checkUserInstantApprovalStatus(stores, setToView);
  }, []);

  useEffect(() => {
    if (photo) {
      setTimeout(() => {
        navigation.navigate('digitalFatortyDataEntry', {
          photo: photo,
          gallery: gallery,
          thumbnail: thumbnail,
        });
      }, 50);
    }
  }, [photo]);

  const closeModal = () => {
    setShowModal(false);
  };

  const onOpenTerms = () => {
    ApplicationAnalytics({eventKey: 'fatorty_get_limit', type: 'CTA'}, stores);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const renderCreditMessage = (data: {
    title: string;
    buttonTitle?: string;
    onPress: () => void;
    svgIcon: any;
    svgColor?: string;
    backColor?: string;
  }) => {
    const {title, buttonTitle, onPress, svgColor, svgIcon, backColor} = data;

    return (
      <View
        style={[
          selectStyle('creditMessageContainer'),
          backColor && {backgroundColor: backColor},
        ]}>
        <RowView>
          <SvgView stroke={svgColor} svgFile={svgIcon} width={20} height={20} />

          <Typography
            customStyles={() => ({
              text: selectStyle('creditMessageText'),
            })}>
            {title}
          </Typography>
        </RowView>

        <GetStartedButton
          ms={30}
          svgFile={creditech.BlackLongArrow}
          textStyle={{color: common.darkBlue}}
          onPress={onPress}
          title={buttonTitle}
        />
      </View>
    );
  };

  const onNavigateBranches = () => {
    ApplicationAnalytics(
      {eventKey: 'Fatoorty_visit_branches', type: 'CTA'},
      stores,
    );

    navigation.navigate('branches', {
      data: stores.backend.general.branches.data,
    });
  };

  const renderCreditStatus = () => {
    switch (toView) {
      case 'creditNotActivated':
        return renderCreditMessage({
          title: translate('FATORTY_ACTIVATE'),
          buttonTitle: translate('ACTIVATE_LIMIT'),
          onPress: () => {
            ApplicationAnalytics(
              {eventKey: 'fatorty_activate_limit', type: 'CTA'},
              stores,
            );
            //  navigation.navigate('activationVerify');
            navigation.navigate('creditActivationEnquiry');
          },
          svgIcon: creditech.AttentionIcon,
          backColor: '#FFF7E2',
          svgColor: '#E9A136',
        });
      case 'noCredit':
        return renderCreditMessage({
          title: translate('FATORTY_NO_CREDIT'),
          buttonTitle: translate('GET_STARTED_2'),
          onPress: onOpenTerms,
          svgIcon: creditech.AttentionIcon,
          backColor: '#FFE2E1',
          svgColor: '#E93636',
        });
      case 'rejected':
        return renderCreditMessage({
          title: translate('USER_REJECTED_CREDIT'),
          buttonTitle: translate('VISIT_BRANCH'),
          onPress: onNavigateBranches,
          svgIcon: creditech.AttentionIcon,
          backColor: '#FFE2E1',
          svgColor: '#E93636',
        });
      case 'creditActivated':
        return null;
      case 'loading':
        return <ActivityIndicator />;
      default:
        break;
    }
  };

  const handleClientStatus = clintStatus => {
    if (clintStatus.eligible === 'False') {
      if (clintStatus.reason === '1') {
        setApprovementPoints({
          type: 'error',
          points: [translate('RESON_1')],
          isEligible: false,
        });
      } else if (clintStatus.reason === '2') {
        setApprovementPoints({
          type: 'error',
          points: [translate('RESON_2')],
          isEligible: false,
        });
      } else {
        setApprovementPoints({
          type: 'error',
          points: [translate('RESON_1')],
          isEligible: false,
        });
      }
    } else setShowModal(true);
  };

  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <View style={{padding: hp(20)}}>
          <Typography
            customStyles={() => ({
              text: {textAlign: 'center'},
            })}
            fontSize={24}
            fontWeight="700">
            {translate('FATORTY_BILL')}
          </Typography>

          <Image
            resizeMode="contain"
            source={creditech.FatortyBill}
            style={{
              width: hp(190),
              marginVertical: hp(20),
              height: hp(221),
              alignSelf: 'center',
            }}
          />

          <Typography textAlign="center" fontSize={12}>
            {translate('FATORTY_DESC')}
          </Typography>

          <View style={{justifyContent: 'flex-end', marginBottom: 0, flex: 1}}>
            {renderCreditStatus()}
          </View>
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <BottomContainer>
            <DefaultButton
              title={translate('REQUEST_START')}
              onPress={() => {
                setIsLoading(true);
                setToView('loading');
                fatortyCheckStatus()
                  .then(data => {
                    handleClientStatus(data);
                    setIsLoading(false);
                    setToView('creditActivated');
                  })
                  .catch(err => {
                    setToView('digitalFatorty');
                    setIsLoading(false);
                  });
              }}
            />
            <DefaultButton
              variant="secondaryBackground"
              mt={20}
              onPress={() => {
                ApplicationAnalytics(
                  {eventKey: 'fatorty_cancel', type: 'CTA'},
                  stores,
                );
                navigation.goBack();
              }}
              title={translate('CANCEL')}
            />
          </BottomContainer>
        </View>

        <CameraModal
          isAgreed={params?.isAgreed}
          closeModal={closeModal}
          showModal={showModal}
          // showModal={true} params?.approvementPointsData ||
          approvementPoints={approvementPoints}
          setPhoto={setPhoto}
          setGallery={setGallery}
          setThumbnail={setThumbnail}
          isInvoiceError={isInvoice}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader shapeVariant="orange">
        {/* {isLoading ? <DefaultOverLayLoading message={translate('PLEASE_WAIT')} /> : null} */}
        {renderContent()}
        <InstantApprovalTOSModal isVisible={isModalVisible} onClose={onClose} />
      </ScrollContainerWithNavHeader>
      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};

export const DigitalFatorty = baseScreen(digitalFatorty, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
