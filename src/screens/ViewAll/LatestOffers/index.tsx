import React, {useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import ProgressiveImage from 'src/components/ProgressiveImage';
import HomeVoucherCard from 'src/components/HomeVoucherCard';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {mixOffersData} from 'src/utils/HelpersFunctions';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {wp} from 'src/utils/Dimensions/dimen';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import styles from './styles';

const latestOffers: React.FC = () => {
  const {data, dynamicLink, personaTitle, image, EnTitle} =
    (useRoute().params as {
      data: any;
      dynamicLink?: boolean;
      personaTitle?: any;
      image?: string;
      EnTitle?: string;
    }) || {};

  const [offers, setOffers] = React.useState<any>([]);
  
  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  
  const stores = useStores();
  const generalMerchantOffers =
  stores.backend.wallet.generalMerchantOffers.data;
  const latestOffersLoading =
  stores.backend.wallet.generalMerchantOffers.loadingState ===
  LoadingState.LOADING;
  
  console.log("offers",generalMerchantOffers);
  const {width} = useWindowDimensions();

  useEffect(() => {
    if (dynamicLink) {
      stores.backend.wallet.generalMerchantOffers.updateOptions({
        productId: '6',
        merchantId: '0',
      });
    }
  }, []);

  useEffect(() => {
    if (dynamicLink && generalMerchantOffers) {
      mixOffersData(generalMerchantOffers, [], setOffers);
    }
  }, [generalMerchantOffers]);

  const renderCards = ({item}) => {
    const newItem = {...item, image: item.Image};
    return (
      <VerticalFlatListItemWrapper>
        <HomeVoucherCard
        bookingAuth
          onPress={() => {
            item?.navigateToBillPayment
              ? navigation.navigate('billPayment')
              : navigation.navigate('offerDetails', {offer: newItem});
            personaTitle
              ? ApplicationAnalytics(
                  {
                    eventKey: EnTitle,
                    parameters: {offer: item?.merchantName},
                    type: 'CTA',
                  },
                  stores,
                )
              : null;
          }}
          item={newItem}
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderList = () => {
    const listData = dynamicLink ? offers : data;
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: listData ? listData : [],
          renderItem: renderCards,
          numColumns: 2,
          columnWrapperStyle: {
            justifyContent: 'flex-start',
            paddingHorizontal: wp(11),
            width: width,
          },
        }}
      />
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      withUserImage
      title={translate('ALL_OFFERS')}>
      {personaTitle ? (
        <View style={selectStyle('rowStyle')}>
          <View style={selectStyle('imageContainer')}>
            <ProgressiveImage
              imageSource={{uri: image}}
              imageStyle={selectStyle('personaImage')}
            />
          </View>

          <Typography
            customStyles={() => ({
              text: selectStyle('textStyle'),
            })}>
            {/* {translate(personaTitle)} */}
            {personaTitle}
          </Typography>
        </View>
      ) : null}

      {renderList()}

      {dynamicLink && latestOffersLoading && <DefaultOverLayLoading />}
    </ScrollContainerWithNavHeader>
  );
};

export const LatestOffers = baseScreen(latestOffers, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
