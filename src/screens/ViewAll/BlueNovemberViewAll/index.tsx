import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import HomeVoucherCard from 'src/components/HomeVoucherCard';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useStyles} from 'elephanz-rn-ui';
import {wp} from 'src/utils/Dimensions/dimen';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import styles from './styles';

const blueNovemberViewAll: React.FC = () => {
  const {selectedDate, todayDate} =
    (useRoute().params as {
      selectedDate?: any;
      todayDate?: any;
    }) || {};

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();

  const stores = useStores();
  const latestOffersLoading =
    stores.backend.wallet.generalBlueNovOffers.loadingState ===
    LoadingState.LOADING;
  const generalMerchantOffers =
    stores.backend.wallet.generalBlueNovOffers.data;

  const {width} = useWindowDimensions();

  useEffect(() => {
    stores.backend.wallet.generalBlueNovOffers.updateOptions({
      productId: '6',
      merchantId: '0',
      offerDate: selectedDate,
      offerType: 2,
    });
  }, []);

  const renderCards = ({item}) => {
    const newItem = {...item, image: item.Image};
    return (
      <VerticalFlatListItemWrapper>
        <HomeVoucherCard
          bookingAuth
          onPress={() => {
            navigation.navigate('offerDetails', {offer: newItem});
          }}
          item={newItem}
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const OfferList = () => {
    // const listData = dynamicLink ? offers : data;
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: generalMerchantOffers ? generalMerchantOffers : [],
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
      title={translate('BLUE_NOVEMBER_OFFERS')}>
        {latestOffersLoading ? null:<OfferList/> }

      {latestOffersLoading && <DefaultOverLayLoading />}
    </ScrollContainerWithNavHeader>
  );
};

export const BlueNovemberViewAll = baseScreen(blueNovemberViewAll, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
