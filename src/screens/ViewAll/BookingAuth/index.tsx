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
import {mixOffersData, tempTranslate} from 'src/utils/HelpersFunctions';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {wp} from 'src/utils/Dimensions/dimen';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import styles from './styles';

const bookingAuth: React.FC = () => {
  const {data, dynamicLink, personaTitle, image, cardType} =
    (useRoute().params as {
      data: any;
      dynamicLink?: boolean;
      personaTitle?: any;
      image?: string;
      cardType?: string;
    }) || {};

  const [offers, setOffers] = React.useState<any>([]);
  
  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();

  const {width} = useWindowDimensions();

  const navigateToScreenWithParams = async (screenName, params) => {
    navigation.navigate(screenName, params);
  };

  const renderCards = ({item}) => {

    const newItem = {...item, image: item.Image};
    let params;
    if (cardType === 'saved') {
      params = {savedData: newItem, params: newItem,saved: 'saved'};
    } else if (cardType === 'offer') {
      params = {offer: newItem, type: 'offer'};
    } else {
      params = {merchant: newItem, type: 'merchant'};
    }
    const handlePress = () => {
      if (item?.status === tempTranslate('saved', 'محفوظة')) {
        navigateToScreenWithParams(
          'bookingAuthenticationOfferCalculate',
          params,
        );
      } else if (item?.status === tempTranslate('pending', 'معلقة')) {
        navigateToScreenWithParams('orderSummary',params);
      } else {
        navigateToScreenWithParams(
          'bookingAuthenticationOfferCalculate',
          params,
        );
      }
    };

    return (
      <VerticalFlatListItemWrapper>
        <HomeVoucherCard bookingAuth onPress={handlePress} item={newItem} />
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
      // title={translate('ALL_OFFERS')}
      title={translate('VIEW_ALL')}>
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

export const BookingAuth = baseScreen(bookingAuth, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
