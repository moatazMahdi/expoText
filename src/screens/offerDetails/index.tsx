import React, {useEffect, useState} from 'react';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {View} from 'native-base';
import ProgressiveImage from 'src/components/ProgressiveImage';
import DefaultButton from 'src/components/DefaultButton';
import VoucherView from 'src/components/VoucherView';
import DefaultModal from 'src/components/DefaultModal';
import {Alert} from 'react-native';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import FloatingHelperView from 'src/components/FloatingHelperView';
import {hp} from 'src/utils/Dimensions/dimen';
import {useRoute} from '@react-navigation/native';
import { convertToHttps } from 'src/utils/HelpersFunctions';

interface OfferDetailsInterface {
  $id: number;
  Description: string;
  Discount: number;
  EndDate: string;
  ExpiryDate: string;
  Id: number;
  Image: string;
  IsLaddered: boolean;
  Merchant: string;
  OfferNumber: string;
  StartDate: string;
  Terms: string;
  Title: string;
  Points: 0;
  MerchantMSISDN: any;
  MerchantId: number;
  OfferType: string;
  CategoryId: number;
  CategoryName: string;
  Logo: string;
  Externalpoints: any;
  IsLocked: boolean;
  Value: any;
  image: string;
  merchantOffer?: boolean;
  calcId?: number;
  id?: number;
}
const offerDetails: React.FC = () => {
  const stores = useStores();
  const {} = stores;

  const {offer, offerTitle, showFloating, key, dynamicLink} = useRoute()
    .params as {
    offer?: OfferDetailsInterface;
    showFloating?: boolean;
    key?: number;
    dynamicLink?: boolean;
    offerTitle?: string;
    screenName?:string;
  };
  
  const [Offer, setOffer] = useState<any>(offer);

  const [offerLoading, setOfferLoading] = useState(false);

  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);

  const [redeemedVoucher, setRedeemedVoucher] = useState<{}>(null);

  const [showModal, setShowModal] = useState(false);

  const {controlLoginModalView} = stores.backend.users;

  const {goBack, navigate} = useNavigationUtils();

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();

  const userId = stores.backend.users.userData?.id;
  const role = stores.backend.users.role;
  const logOfferDetailsVisited = () => {
    if (Offer?.id && Offer?.id == 320) {
      ApplicationAnalytics(
        {
          eventKey: 'Cashback_offerDetails',
          type: 'CTA',
          parameters: {name: Offer?.title || Offer?.Title},
        },
        stores,
      );
    } else {
      ApplicationAnalytics(
        {
          eventKey: 'offerDetails',
          type: 'CTA',
          parameters: {name: Offer?.title || Offer?.Title},
        },
        stores,
      );
    }
  };
  const ImageUrlHttps = convertToHttps(offer?.image || offer?.Image || offer?.merchantImage)

  useEffect(() => {
    const getOffer = async () => {
      try {
        setOfferLoading(true);
        const offer = await stores.backend.products.getOfferById(key);
        setOffer(offer);
      } catch (e) {
      } finally {
        setOfferLoading(false);
      }
    };
    !offer && getOffer();
    logOfferDetailsVisited();
  }, []);

  useEffect(() => {
    async function handleRecentlyViewCreate() {
      try {
        const type = 'offer';
        const imageUrl =
          offer?.imageUrl || offer?.image || offer?.Image || offer?.merchantImage||'http://example.com/detail-image.jpg';
        const name = offer?.Title || offer?.title;
        const code = offer?.id + '';
        const expiryDate = offer?.expiryDate;
        const details = {
          id:  offer?.merchantId + '',
          name: offer?.Title || offer?.merchantName,
          image: offer?.image || offer?.merchantImage|| 'http://example.com/detail-image.jpg',
        };

        await stores.backend.bookingAuth.recentlyViewCreate(
          type,
          imageUrl,
          name,
          code,
          expiryDate,
          details,
        );
      } catch (error) {
        console.error('Error in recentlyViewCreate:', error);
      }
    }
    if (role !== 'GUEST') {
      if(offer?.isDigital === 'true' || offer?.isDigital === 'True'){
        handleRecentlyViewCreate();
      }
    }
  }, []);

  const updateUserVouchers = () => {
    stores.backend.wallet.generalVouchers.fetch();
  };

  const handleNavigateToOfferCalculator = () => {
    navigate('offerCalculator', {
      offer: dynamicLink ? {...Offer, id: +key} : offer || [],
    });
  };
  const handelBookingSubmit = () => {
    navigate('bookingAuthenticationOfferCalculate', {
      offer: offer,
      type: 'offer',
    });
  };

  const getVoucherCode = async () => {
    setRedeemedVoucher(null);
    try {
      setIsClaimLoading(true);
      await stores.backend.wallet.addVoucher(userId, `${Offer?.OfferNumber}`);
      await stores.backend.wallet.userWallet.fetch(userId.toString());
      ApplicationAnalytics(
        {
          eventKey: 'vouchers_claim_offerDetails',
          type: 'CTA',
          parameters: {name: Offer?.title || Offer?.Title},
        },
        stores,
      );
      setIsClaimLoading(false);
      setRedeemedVoucher(stores.backend.wallet.redeemVoucher);
      updateUserVouchers();
      setShowModal(true);
    } catch (error) {
      setIsClaimLoading(false);
      if (error.response?.data?.message) {
        Alert.alert('', error.response.data.message, [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      } else {
        Alert.alert('', translate('GENERIC_ERROR_MESSAGE'), [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      }
    }
  };
  
  const renderImage = () => {
    return (
      <View style={selectStyle('ContainerHeaderImage')}>
        {(offer?.image || offer?.Image || offer?.merchantImage )&& <ProgressiveImage
          imageSource={{uri: ImageUrlHttps}}
          imageStyle={selectStyle('headerImage')}
        /> }
       
      </View>
    );
  };

  const renderButton = () => {
    return (
      <DefaultButton
        loading={isClaimLoading}
        disabled={false}
        onPress={() => controlLoginModalView(true, () => getVoucherCode())}
        bottom
        title={translate('CLAIM')}
        buttonStyle={selectStyle('button')}
      />
    );
  };

  const onCloseModal = () => {
    setShowModal(false);
    goBack();
  };

  const renderRedeemedVoucher = () => {
    return (
      <VoucherView
        voucherNumber={redeemedVoucher?.code}
        onCloseModal={onCloseModal}
        brandName={Offer?.title || Offer?.Title}
        description={redeemedVoucher?.description}
      />
    );
  };

  const renderRedeemedVoucherModal = () => {
    return (
      <DefaultModal bottom onCloseModal={onCloseModal} isVisible={showModal}>
        {renderRedeemedVoucher()}
      </DefaultModal>
    );
  };

  const renderDetails = () => {
    return (
      <View style={selectStyle('detailsContainer')}>
        <Typography customStyles={() => ({text: selectStyle('titleText')})}>
          {Offer?.title?.trim() || Offer?.Title?.trim()}
        </Typography>

        <Typography
          customStyles={() => ({text: selectStyle('descriptionText')})}>
          {Offer?.description || Offer?.Description}
        </Typography>
      </View>
    );
  };

  const FooterBottom = () => {
    return (
      <View style={selectStyle('footerButtonContainer')}>
        {Offer?.isDigital === 'true' ? <>
          <DefaultButton
          titleStyle={{fontSize: hp(12)}}
          variant="secondaryBackground"
          title={translate('CALCULATE_OFFER')}
          onPress={handleNavigateToOfferCalculator}
          buttonStyle={selectStyle('buttonStyle')}
        />

        <DefaultButton
          titleStyle={{fontSize: hp(12)}}
          title={translate('BUY_NOW')}
          onPress={handelBookingSubmit}
          buttonStyle={[
            selectStyle('buttonStyle'),
            {backgroundColor: '#FD8326'},
          ]}
        />
        </>:<>
        <DefaultButton
          titleStyle={{fontSize: hp(12)}}
          title={translate('CALCULATE_OFFER')}
          onPress={handleNavigateToOfferCalculator}
          buttonStyle={selectStyle('calcButtonStyle')}
        />
        </>}

      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        // showFloatingActionButton={showFloating}
        title={Offer?.title || Offer?.Title}>
        {offerLoading && <DefaultOverLayLoading />}
        <View style={{flex: 1, paddingHorizontal: 16}}>
          {renderImage()}

          {renderDetails()}

          {!Offer?.merchantOffer || (dynamicLink && renderButton())}

          {renderRedeemedVoucherModal()}
        </View>
      </ScrollContainerWithNavHeader>
      {offer?.tenors?.length >= 0 ? <FooterBottom /> :null }
      
      {/* {Offer?.tenors?.length ? (
        <FloatingHelperView
          fromOffer
          onPress={handleNavigateToOfferCalculator}
        />
      ) : null} */}
    </View>
  );
};

export const OfferDetails = baseScreen(offerDetails, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER','GUEST'],
});