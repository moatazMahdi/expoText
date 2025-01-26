import React, {useCallback, useEffect, useState} from 'react';
import {View, ActivityIndicator, Dimensions, Alert, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {BookingAuthenticationCard} from 'src/components/BookingAuthenticationCard';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {
  mixOffersData,
  returnCredit,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import DefaultTextInput from 'src/components/DefaultTextInput';
import ImageWithShadow from 'src/components/ImageWithShadowCN';
import HomeVoucherCard from 'src/components/HomeVoucherCard';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {BookingMerchants} from 'src/utils/Constants';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import ViewAll from 'src/components/ViewAll';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import SvgView from 'src/components/SvgView';
import {BalanceInterface} from 'src/Types';
import DefaultButton from 'src/components/DefaultButton';

const bookingAuthentication = () => {
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const stores = useStores();

  const [bookingSearch, setBookingSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [recentlyViewedData, setRecentlyViewedData] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [showSearchView, setShowSearchView] = useState(false);
  const [merchantData, setMerchantData] = useState(null);

  const generalMerchantOffers =
    stores.backend.wallet.generalMerchantOffers.data;
  const {data: generalOffer} = stores.backend.wallet.generalVouchers;
  const latestOffersLoading =
    stores.backend.wallet.generalMerchantOffers.loadingState ===
    LoadingState.LOADING;
  const searchLoading =
    stores.backend.products.Search.loadingState === LoadingState.LOADING;
  const user = stores.backend.users?.userData;
  const userCredit = stores.backend.users.userCredits.data;

  const balance: BalanceInterface = returnCredit(userCredit);

  const {
    images: {
      screens: {creditech, home},
    },
  } = Assets;

  const {
    theme: {
      palette: {common, primary},
    },
  } = useTheme();

  useEffect(() => {
    if (generalMerchantOffers?.length || generalOffer?.length)
      mixOffersData(generalMerchantOffers, [], setOffers);
  }, [generalMerchantOffers]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (bookingSearch) {
      const timer = setTimeout(() => {
        handleInstallmentCalculation();
      }, 300);

      setDebounceTimer(timer);
    }

    return () => clearTimeout(debounceTimer);
  }, [bookingSearch]);

  useFocusEffect(
    useCallback(() => {
      async function fetchBookingHistory() {
        try {
          setLoading(true);
          const bookingHistoryData =
            await stores.backend.bookingAuth.bookingHistory(user?.nationalId);
          const savedBookings = bookingHistoryData.filter(
            (item: any) =>
              item.status === tempTranslate('saved', 'محفوظة') ||
              item.status === tempTranslate('pending', 'معلقة'),
          );
          setBookingHistory(savedBookings);
        } catch (error) {
          console.error('Error fetching booking history:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchBookingHistory();
    }, [user?.nationalId]),
  );
  useFocusEffect(
    useCallback(() => {
      async function fetchRecentlyViewedItems() {
        try {
          setLoading(true);
          const recentlyViewedItems =
            await stores.backend.bookingAuth.recentlyViewList();
          setRecentlyViewedData(recentlyViewedItems);
        } catch (error) {
          console.error('Error fetching recently viewed items:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchRecentlyViewedItems();
    }, [user?.nationalId]),
  );


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('home'); 
        return true; 
      };
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
  
      return () => backHandler.remove(); // Cleanup listener on unmount
    }, [navigation]),
  );

  const filteredOffers = recentlyViewedData?.offers?.filter(item => {
    const offerDate = new Date(item?.expiryDate).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return offerDate >= today;
  });

  const BuyNowOffers = offers?.filter(item => {
    const filterOffer = item?.isDigital === 'true';
    return filterOffer;
  });

  const handleInstallmentCalculation = async () => {
    try {
      setLoading(true);
      let response;
      if (!isNaN(Number(bookingSearch))) {
        response = await stores.backend.products.getProductMerchants({
          code: bookingSearch,
          productId: '6',
          categoryId: '0',
          areaId: '0',
          cityId: '0',
          pageNumber: 1,
          pageSize: 50,
        });
      } else {
        response = await stores.backend.products.getProductMerchants({
          query: bookingSearch,
          productId: '6',
          categoryId: '0',
          areaId: '0',
          cityId: '0',
          pageNumber: 1,
          pageSize: 20,
        });
      }
      setMerchantData(response);
      // stores.backend.products.Search.updateOptions({
      //   query: bookingSearch,
      // });
    } catch (error) {
      console.error('Error calculating installment:', error);
    } finally {
      setLoading(false);
    }
  };

  const onNavigateShopFromMerchants = async () => {
    navigation.navigate('shopFromMerchants');
  };

  const navigateToScreenWithParams = async (screenName, params, type) => {
    navigation.navigate(screenName, params);
  };

  const onNavigateLatestOffers = async () => {
    navigation.navigate('latestOffers', {data: offers});
  };
  const onNavigateBookingAuth = async (data, type) => {
    navigation.navigate('bookingAuth', {data: data, cardType: type});
  };

  const renderItems = ({item}) => {
    const newItem = {...item, image: item.imageUrl};
    return (
      <HorizontalFlatListItemWrapper>
        <ImageWithShadow
          w={140}
          h={140}
          fit={true}
          renderTextInsteadOfImage
          mt={0}
          item={newItem}
          onPress={() =>
            navigation.navigate('merchantDetails', {merchant: newItem})
          }
        />
      </HorizontalFlatListItemWrapper>
    );
  };

  const SearchResult = () => {
    return (
      <>
        {merchantData?.merchants.length > 0 ? (
          <DefaultFlatList
            isFetchingData={false}
            flatListProps={{
              numColumns: 2,
              scrollEventThrottle: 32,
              data: merchantData?.merchants ?? [],
              renderItem: renderItems,
            }}
          />
        ) : (
          <Typography textAlign="center" marginTop={hp(190)}>
            {tempTranslate(' Result not found ', ' لا يوجد نتائج للبحث ')}
          </Typography>
        )}
      </>
    );
  };

  if (balance?.amount < 100) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Typography style={{fontSize:16,fontWeight:'700',color:common.black,marginBottom:hp(20)}}>
          {tempTranslate(
            'Sorry, the service is not available for you.',
            'نأسف، هذه الخدمة غير متاحة لك.',
          )}
        </Typography>
        <DefaultButton
      
          title={translate('GENERIC_CONFIRM')}
          onPress={() => navigation.navigate('home')}
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        title={translate('BUY_NOW')}
        shapeVariant="orange"
        removeCapitalization
        // renderHistory
        onPress={()=>{
          navigation.navigate('home'); 
        return true
        }}
        // hideBack
        scrollViewStyle={{paddingVertical: hp(24)}}>
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <DefaultTextInput
            startIcon={creditech.SearchIcon}
            // icon={creditech.Close}
            // onPress={() => {
            //   setBookingSearch('');
            //   setShowSearchView(false);
            // }}
            // iconWidth={12}
            // iconHeight={12}
            iconStyle={selectStyle('CloseIconStyle')}
            placeHolder={translate('MERCHANT_CODE_OR_NAME')}
            viewStyle={selectStyle('TextInputViewStyle')}
            inputContainer={selectStyle('TextInputContainer')}
            textInputStyle={{width: '85%'}}
            value={bookingSearch}
            onchangeText={item => setBookingSearch(item)}
            onFocus={() => setShowSearchView(true)}
          />
          {showSearchView ? (
            <SvgView
              svgFile={creditech.Close}
              width={12}
              height={12}
              onPress={() => {
                setBookingSearch('');
                setShowSearchView(false);
                setMerchantData(null)
              }}
              style={{marginStart: wp(-17)}}
            />
          ) : null}
        </View>
        {showSearchView ? (
          <>
            {bookingSearch.length > 0 ? (
              <>
                <SearchResult />
              </>
            ) : null}
          </>
        ) : (
          <View>
            <ViewAll
              title={translate('PENDING_PURCHASE')}
              horizontal={true}
              onPress={() => onNavigateBookingAuth(bookingHistory, 'saved')}
              notPadding
              data={bookingHistory || []}
              isOurServices
              renderItems={({item}) => {
                let newItem;
                if (!item?.hasOwnProperty('Image')) {
                  newItem = {
                    title: item.title,
                    image: item.imageUrl || item.image,
                    description: item.description,
                    ...item,
                  };
                } else {
                  newItem = {title: item.Title, image: item.Image, ...item};
                }
                return (
                  <BookingAuthenticationCard
                    item={item}
                    width={Dimensions.get('window').width / 1.2 - 25}
                    onPress={() => {
                      if (
                        newItem?.status === tempTranslate('saved', 'محفوظة')
                      ) {
                        navigateToScreenWithParams(
                          'bookingAuthenticationOfferCalculate',
                          {
                            savedData: newItem,
                            saved: tempTranslate('saved', 'محفوظة'),
                          },
                          newItem,
                        );
                      } else if (
                        newItem?.status === tempTranslate('pending', 'معلقة')
                      ) {
                        navigateToScreenWithParams(
                          'orderSummary',
                          {
                            params: newItem,
                            saved: tempTranslate('pending', 'معلقة'),
                          },
                          newItem,
                        );
                      } else {
                        return;
                      }
                    }}
                  />
                );
              }}
              loading={loading}
              hideViewAll={bookingHistory && bookingHistory?.length <= 2}
              maxNumberOfItemsToRender={5}
              style={{paddingLeft: 16, paddingRight: 16, marginTop: 16}}
              listStyle={{paddingStart: 16}}
            />
            <ViewAll
              title={translate('TOP_MERCHANTS')}
              horizontal={true}
              notPadding
              onPress={onNavigateShopFromMerchants}
              data={BookingMerchants}
              renderItems={({item}) => {
                let newItem;
                if (!item?.hasOwnProperty('Image')) {
                  newItem = {
                    title: item.title,
                    image: item.imageUrl || item.image,
                    description: item.description,
                    ...item,
                  };
                } else {
                  newItem = {title: item.Title, image: item.Image, ...item};
                }
                return (
                  <HomeVoucherCard
                    onPress={() =>
                      navigateToScreenWithParams(
                        'bookingAuthenticationOfferCalculate',
                        {merchant: newItem, type: 'merchant'},
                        newItem,
                      )
                    }
                    bookingAuth
                    item={item}
                  />
                );
              }}
              loading={loading}
              hideViewAll={BookingMerchants && BookingMerchants?.length <= 2}
              maxNumberOfItemsToRender={25}
              style={{paddingLeft: 16, paddingRight: 16, marginTop: 16}}
              listStyle={{paddingStart: 16}}
            />
            <ViewAll
              title={translate('TOP_OFFERS')}
              horizontal={true}
              notPadding
              onPress={onNavigateLatestOffers}
              data={BuyNowOffers}
              renderItems={({item}) => {
                let newItem;
                if (!item?.hasOwnProperty('Image')) {
                  newItem = {
                    title: item.title,
                    image: item.imageUrl || item.image,
                    description: item.description,
                    ...item,
                  };
                } else {
                  newItem = {title: item.Title, image: item.Image, ...item};
                }
                return (
                  <HomeVoucherCard
                    onPress={() =>
                      navigateToScreenWithParams(
                        'bookingAuthenticationOfferCalculate',
                        {offer: newItem, type: 'offer'},
                        newItem,
                      )
                    }
                    bookingAuth
                    fontSize={12}
                    item={item}
                  />
                );
              }}
              loading={loading}
              hideViewAll={offers && offers?.length <= 2}
              maxNumberOfItemsToRender={6}
              style={{paddingLeft: 16, paddingRight: 16, marginTop: 8}}
              listStyle={{paddingStart: 16}}
              loading={latestOffersLoading}
              emptyComponent={() =>
                !latestOffersLoading ? (
                  <View style={{marginVertical: hp(20)}}>
                    <Typography colorHex={common.grey} textAlign="center">
                      {translate('NO_OFFERS')}
                    </Typography>
                  </View>
                ) : (
                  <ActivityIndicator size={'large'} color={common.darkBlue} />
                )
              }
            />
            {recentlyViewedData?.merchants?.length > 0 ? (
              <ViewAll
                title={translate('RECENTLY_VIEWED_MERCHANT')}
                horizontal={true}
                notPadding
                onPress={() =>
                  onNavigateBookingAuth(
                    recentlyViewedData?.merchants,
                    'merchant',
                  )
                }
                data={recentlyViewedData?.merchants}
                renderItems={({item}) => {
                  let newItem;
                  if (!item?.hasOwnProperty('Image')) {
                    newItem = {
                      title: item.title,
                      image: item.imageUrl || item.image,
                      description: item.description,
                      ...item,
                    };
                  } else {
                    newItem = {title: item.Title, image: item.Image, ...item};
                  }
                  return (
                    <HomeVoucherCard
                      onPress={() =>
                        navigateToScreenWithParams(
                          'bookingAuthenticationOfferCalculate',
                          {recentlyViewedData: newItem, type: 'merchant'},
                          newItem,
                        )
                      }
                      bookingAuth
                      fontSize={12}
                      item={item}
                    />
                  );
                }}
                loading={loading}
                hideViewAll={
                  recentlyViewedData?.merchants &&
                  recentlyViewedData?.merchants?.length <= 2
                }
                maxNumberOfItemsToRender={6}
                style={{paddingLeft: 16, paddingRight: 16, marginTop: 16}}
                listStyle={{paddingStart: 16}}
              />
            ) : null}

            {recentlyViewedData?.offers?.length > 0 ? (
              <ViewAll
                title={translate('RECENTLY_VIEWED_OFFERS')}
                horizontal={true}
                notPadding
                onPress={() => onNavigateBookingAuth(filteredOffers, 'offer')}
                data={filteredOffers}
                renderItems={({item}) => {
                  let newItem;
                  if (!item?.hasOwnProperty('Image')) {
                    newItem = {
                      title: item.title,
                      image: item.imageUrl || item.image,
                      description: item.description,
                      ...item,
                    };
                  } else {
                    newItem = {title: item.Title, image: item.Image, ...item};
                  }
                  return (
                    <HomeVoucherCard
                      onPress={() =>
                        navigateToScreenWithParams(
                          'bookingAuthenticationOfferCalculate',
                          {recentlyViewedData: newItem, type: 'offer'},
                          newItem,
                        )
                      }
                      bookingAuth
                      fontSize={12}
                      item={item}
                    />
                  );
                }}
                loading={loading}
                hideViewAll={filteredOffers.length <= 2}
                maxNumberOfItemsToRender={6}
                style={{paddingLeft: 16, paddingRight: 16, marginTop: 16}}
                listStyle={{paddingStart: 16}}
              />
            ) : null}
          </View>
        )}

        {loading && <DefaultOverLayLoading />}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const BookingAuthentication = baseScreen(bookingAuthentication, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
