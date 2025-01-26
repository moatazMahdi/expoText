import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image } from 'react-native';
import { View } from 'native-base';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import InstantApprovalTOSModal from 'src/components/InstantApprovalTOSModal';
import { checkUserInstantApprovalStatus } from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useStores, useNavigationUtils, useLocalization } from 'hooks';
import { BottomContainer } from 'src/components/BottomContainer';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import GetStartedButton from 'src/components/GetStartedButton';
import DefaultButton from 'src/components/DefaultButton';
import RowView from 'src/components/Wrappers/RowView';
import FatortyCameraModal from 'src/components/fatortyCameraModel';
import { hp } from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import styles from './styles';

const fatorty: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [gallery, setGallery] = React.useState<boolean>();
  const [thumbnail, setThumbnail] = useState(null);
  const [toView, setToView] = useState('fatorty');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fatortyClientCheckData,setFatortyClientCheckData] = useState([])
  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  const userCredit = stores.backend.users.userCredits.data;
  const user = stores.backend.users.userData;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  useEffect(() => {
    async function fetchFatortyClientCheck() {
      try {
        setLoading(true);
        const fatortyClientCheckData =
          await stores.backend.products.getFatortyClientCheck(
            user?.nationalId
            // '29409010101578'
          );
          setFatortyClientCheckData(fatortyClientCheckData);
      } catch (error) {
        console.error('Error fetching recently viewed items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFatortyClientCheck()
  }, []);

  useEffect(() => {
    if(userCredit[0]?.limit && user?.nationalId){
      setToView('creditActivated')
    }else{
      checkUserInstantApprovalStatus(stores, setToView);
    }
  }, []);

  useEffect(() => {
    if (photo) {
      setTimeout(() => {
        navigation.navigate('fatortyDataEntry', {
          photo: photo,
          gallery: gallery,
          thumbnail: thumbnail,
        });
      }, 500);
    }
  }, [photo]);

  const closeModal = () => {
    setShowModal(false);
  };

  const onOpenTerms = () => {
    ApplicationAnalytics(
      { eventKey: 'fatorty_get_limit', type: 'CTA' },
      stores,
    );
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

const onStart =()=>{
  if(fatortyClientCheckData?.status === true || fatortyClientCheckData?.status === "true" ){
    setShowModal(true)
  }else{
    Alert.alert(
      translate('ERROR'),
      translate('LUCKY_MASSAGE'),
      [
        {
          text: translate('VOUCHER_PAYMENT_APPROVE'),
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false }
    )
  }

}

  const renderCreditMessage = (data: {
    title: string;
    buttonTitle?: string;
    onPress: () => void;
    svgIcon: any;
    svgColor?: string;
    backColor?: string;
  }) => {
    const { title, buttonTitle, onPress, svgColor, svgIcon, backColor } = data;

    return (
      <View
        style={[
          selectStyle('creditMessageContainer'),
          backColor && { backgroundColor: backColor },
        ]}
      >
        <RowView>
          <SvgView stroke={svgColor} svgFile={svgIcon} width={20} height={20} />

          <Typography
            customStyles={() => ({
              text: selectStyle('creditMessageText'),
            })}
          >
            {title}
          </Typography>
        </RowView>

        <GetStartedButton
          ms={30}
          svgFile={creditech.BlackLongArrow}
          textStyle={{ color: common.darkBlue }}
          onPress={onPress}
          title={buttonTitle}
        />
      </View>
    );
  };

  const onNavigateBranches = () => {
    ApplicationAnalytics(
      { eventKey: 'Fatoorty_visit_branches', type: 'CTA' },
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
              { eventKey: 'fatorty_activate_limit', type: 'CTA' },
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

  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <View style={{ padding: hp(20) }}>
          <Typography
            customStyles={() => ({
              text: { textAlign: 'center' },
            })}
            fontSize={24}
            fontWeight="700"
          >
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

          <View
            style={{ justifyContent: 'flex-end', marginBottom: 0, flex: 1 }}
          >
            {renderCreditStatus()}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <BottomContainer>
            {toView === 'creditActivated' && (
              <DefaultButton
                title={translate('REQUEST_START')}
                onPress={onStart}
              />
            )}
            <DefaultButton
              variant="secondaryBackground"
              mt={20}
              onPress={() => {
                ApplicationAnalytics(
                  { eventKey: 'fatorty_cancel', type: 'CTA' },
                  stores,
                );
                navigation.goBack();
              }}
              title={translate('CANCEL')}
            />
          </BottomContainer>
        </View>

        <FatortyCameraModal
          closeModal={closeModal}
          showModal={showModal}
          setPhoto={setPhoto}
          setGallery={setGallery}
          setThumbnail={setThumbnail}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        shapeVariant="tangelo"
        title={translate('FATORTY')}
        floatBot={userCredit[0]?.limit && !user?.isEligible ? 140 : 80}
        showFloatingActionButton
      >
        {renderContent()}

        <InstantApprovalTOSModal isVisible={isModalVisible} onClose={onClose} />
      </ScrollContainerWithNavHeader>

      {(toView === 'loading' || loading) && <DefaultOverLayLoading />}
    </View>
  );
};

export const Fatorty = baseScreen(fatorty, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
