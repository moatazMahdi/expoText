import React, {useEffect, useState} from 'react';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import {
  getHistoryListFromAsyncStorage,
  mixSearchServices,
  offersDataSearch,
  removeHistoryListFromAsyncStorage,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {View} from 'native-base';
import HomeNavHeader from 'src/components/HomeNavHeaderCN';
import {Pressable, ScrollView, ActivityIndicator, useWindowDimensions} from 'react-native';
import {LoadingState} from 'utils';
import ImageWithShadow from 'src/components/ImageWithShadowCN';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import {Assets} from 'assets';
import {saveHistoryListToAsyncStorage} from '../../utils/HelpersFunctions';
import RowView from 'src/components/Wrappers/RowView';
import ViewAll from 'src/components/ViewAll';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import OurServicesCard from 'src/components/OurServicesCard';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import HomeVoucherCard from 'src/components/HomeVoucherCard';

const search: React.FC = () => {
  const navigation = useNavigationUtils();
  const stores = useStores();

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();
  const {width} = useWindowDimensions();

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

  const {data: programsData} = stores.backend.programs.programs;
  const generalMerchantOffers =
    stores.backend.wallet.generalMerchantOffers.data;
  const {data: productsData} = stores.backend.products.products;
  const searchLoading =
    stores.backend.products.Search.loadingState === LoadingState.LOADING;
  const searchData = stores.backend.products.Search.data;
  const [query, setQuery] = useState<string>('');
  const [programsProducts, setProgramsProducts] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [historyQuery] = useState('');
  const [mixedSearchServices, setMixedSearchServices] = useState([]);

  const onPressOffers = () => {
    const offersData = offersDataSearch(generalMerchantOffers);
    navigation.navigate('latestOffers', {data: offersData});
  };

  const onPressServices = () => {
    navigation.navigate('ourServices', {data: programsProducts});
  };

  const onPressPoints = () => {
    ApplicationAnalytics({eventKey: 'search_loyalPoints', type: 'CTA'}, stores);
    navigation.navigate('loyalPoints');
  };

  const quickActionsList = [
    {titleAr: 'العروض', titleEn: 'Offers', _onPress: () => onPressOffers()},
    // {
    //   titleAr: 'الخدمات',
    //   titleEn: 'Services',
    //   _onPress: () => onPressServices(),
    // },
    {
      titleAr: 'نقاط الولاء',
      titleEn: 'Loyalty Points',
      _onPress: () => onPressPoints(),
    },
  ];

  useEffect(() => {
    (async () => getHistoryListFromAsyncStorage())().then(res =>
      setHistoryList([...res.history]),
    );
  }, []);

  useEffect(() => {
    if (searchData) {
      mixSearchServices(
        searchData?.services?.programs,
        searchData?.services?.products,
        translate,
        setMixedSearchServices,
      );
    } else {
      if (mixedSearchServices) {
        setMixedSearchServices([]);
      }
    }
  }, [searchData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query?.trim()?.length > 0) {
        onSearch();
      } else {
        stores.backend.products.Search._setData(null);
      }
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    if (productsData || programsData) mixServicesData();
  }, [productsData, programsData]);

  const onSearch = () => {
    stores.backend.products.Search.updateOptions({
      query: query,
    });
    if (!historyList?.includes(query) && query?.trim() !== '') {
      if (historyList.length >= 5) {
        saveHistoryListToAsyncStorage({
          history: [...historyList?.slice(1), query?.trim()],
        });
      } else {
        saveHistoryListToAsyncStorage({
          history: [...historyList, query?.trim()],
        });
      }
    }
  };

  const checkSearchData = (obj: Object) => {
    if (query === '') return false;
    return (
      obj &&
      !Object.values(obj)?.some(item =>
        Array.isArray(item)
          ? item?.length
          : Object.values(item)?.some((arr: []) => arr?.length),
      )
    );
  };

  const onQueryChange = text => {
    setQuery(text);
  };

  const mixServicesData = () => {
    let newArray = [];

    programsData &&
      programsData?.map(item => {
        if (item?.id !== 'REFERRAL' && item?.id !== 'REWARDS') {
          newArray.push({
            id: item.id,
            title: item.title,
            image: item.imageUrl,
            description: item.description,
            type: 'program',
            ...item,
          });
        }
      });
    productsData &&
      productsData?.map(item => {
        if (item?.name !== 'Finishing') {
          newArray.push({
            id: item.id,
            title: item.name,
            image: item.backgroundImage,
            description: item.description,
            type: 'product',
            ...item,
          });
        }
      });
    let sortedArray = [];
    newArray?.map(item => {
      switch (item.title) {
        case 'Auto':
          //  sortedArray?.splice(0, 0, item);
          sortedArray[0] = item;
          break;

        case 'Shopping':
          sortedArray[1] = item;
          //  sortedArray?.splice(1, 0, item);

          break;

        case 'Contact Clubs':
          sortedArray[2] = item;
          // sortedArray?.splice(2, 0, item);
          break;

        case 'Education Program':
          sortedArray[3] = item;
          // sortedArray?.splice(3, 0, item);
          break;

        case 'Contact Homes':
          sortedArray[4] = item;
          // sortedArray?.splice(4, 0, item);
          break;

        case 'Trucks':
          sortedArray[5] = item;
          // sortedArray?.splice(5, 0, item);
          break;

        case 'Mortgage':
          sortedArray[6] = item;
          // sortedArray?.splice(6, 0, item);
          break;

        case 'Brokerage':
          sortedArray[7] = item;
          // sortedArray?.splice(7, 0, item);
          break;

        case 'Leasing':
          sortedArray[8] = item;
          // sortedArray?.splice(8, 0, item);
          break;

        default:
          break;
      }
    });
    setProgramsProducts(sortedArray);
    //concat two arrays
  };

  const renderOurServicesItems = ({item}) => {
    return item && <OurServicesCard item={item} forSearch />;
  };

  const renderMerchants = ({item}) => {
    const newItem = {...item, image: item.imageUrl};
    return (
      <ImageWithShadow
        renderTextInsteadOfImage
        mt={1}
        item={newItem}
        onPress={() =>
          navigation.navigate('merchantDetails', {merchant: newItem})
        }
      />
    );
  };

  const onNavigateOurServices = async () => {
    ApplicationAnalytics({eventKey: 'search_ourServices', type: 'CTA'}, stores);
    navigation.navigate('ourServices', {data: mixedSearchServices});
  };

  const onNavigateShopFromMerchants = async () => {
    ApplicationAnalytics(
      {eventKey: 'search_shopFromMerchants', type: 'CTA'},
      stores,
    );
    navigation.navigate('merchantsSearch', {data: searchData?.merchants});
  };

  const onNavigateOffers = async () => {
    ApplicationAnalytics({eventKey: 'search_offers', type: 'CTA'}, stores);
    navigation.navigate('latestOffers', {data: searchData?.offers});
  };

  const renderOfferItems = ({item}) => {
    let newItem;
    if (!item?.hasOwnProperty('Image')) {
      newItem = {
        title: item.title,
        image: item.imageUrl || item.image,
        Description: item.description,
        ...item,
      };
    } else {
      newItem = {title: item.Title, image: item.Image, ...item};
    }

    return (
      <HomeVoucherCard
        onPress={() =>
          navigateToScreenWithParams('offerDetails', {offer: newItem}, newItem)
        }
        item={newItem}
      />
    );
  };

  const renderSections = () => {
    return (
      <View>
        {checkSearchData(searchData) ? (
          <Typography textAlign="center">
            {tempTranslate(' Result not found ', ' لا يوجد نتائج للبحث ')}
          </Typography>
        ) : null}

        {mixedSearchServices && mixedSearchServices.length > 0 && (
          <ViewAll
            title={translate('OUR_SERVICES')}
            horizontal={true}
            maxNumberOfItemsToRender={3}
            onPress={onNavigateOurServices}
            data={mixedSearchServices}
            renderItems={renderOurServicesItems}
            hideViewAll={mixedSearchServices?.length <= 2}
          />
        )}

        {searchData?.merchants && searchData?.merchants.length > 0 && (
          <ViewAll
            title={translate('SHOP_FROM_MERCHANTS')}
            horizontal={true}
            maxNumberOfItemsToRender={3}
            onPress={onNavigateShopFromMerchants}
            data={searchData?.merchants}
            renderItems={renderMerchants}
            hideViewAll={searchData?.merchants?.length < 2}
          />
        )}

        {searchData?.offers && searchData?.offers.length > 0 && (
          <ViewAll
            title={translate('LATEST_OFFERS')}
            horizontal={true}
            maxNumberOfItemsToRender={3}
            onPress={onNavigateOffers}
            data={offersDataSearch(searchData?.offers)}
            renderItems={renderOfferItems}
            hideViewAll={searchData?.offers?.length < 2}
          />
        )}
      </View>
    );
  };

  const renderSearchResults = () => {
    return (
      <View style={{flex: 1}}>
        <Typography
          marginBottom={20}
          customStyles={() => ({text: selectStyle('titleText')})}>
          {translate('SEARCH_RESULTS')?.toUpperCase()}
        </Typography>
        {searchLoading ? (
          <ActivityIndicator size="large" color={common.darkBlue} />
        ) : (
          renderSections()
        )}
      </View>
    );
  };

  const navigateToScreenWithParams = async (screenName, params, item) => {
    // ApplicationAnalytics(
    //   {
    //     eventKey: screenName,
    //     params: { name: item?.title },
    //   },
    //   stores,
    // );
    navigation.navigate(screenName, params);
  };

  const renderQuickAction = ({item}) => {
    return (
      <Pressable
        style={selectStyle('quickActionContainer')}
        onPress={() => item._onPress()}>
        <Typography
          customStyles={() => ({text: selectStyle('quickActionText')})}>
          {tempTranslate(item.titleEn, item.titleAr)}
        </Typography>
      </Pressable>
    );
  };

  const renderHistoryItem = item => {
    return (
      <Pressable
        style={selectStyle('quickActionContainer')}
        onPress={() => setQuery(item)}>
        <Typography
          customStyles={() => ({text: selectStyle('quickActionText')})}>
          {item}
        </Typography>
      </Pressable>
      // </VerticalFlatListItemWrapper>
    );
  };

  const renderQuickActions = () => {
    return (
      <View style={{marginVertical: hp(5)}}>
        <Typography customStyles={() => ({text: selectStyle('titleText')})}>
          {translate('QUICK_ACTIONS')?.toUpperCase()}
        </Typography>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: hp(5), flexDirection: 'row'}}>
          {quickActionsList?.length > 1 &&
            quickActionsList?.map((item, index) => {
              return (
                <HorizontalFlatListItemWrapper
                  style={index === 0 && {marginStart: wp(20)}}>
                  <DropShadowWrapper style={selectStyle('itemStyle')}>
                    {renderQuickAction({item})}
                  </DropShadowWrapper>
                </HorizontalFlatListItemWrapper>
              );
            })}
          {!quickActionsList ||
            (quickActionsList?.length === 0 && (
              <Typography>{translate('NO_ACTIONS')}</Typography>
            ))}
        </ScrollView>
      </View>
    );
  };

  const renderHistorySearch = () => {
    return (
      <View style={{marginVertical: hp(5)}}>
        <RowView jc="space-between">
          <Typography customStyles={() => ({text: selectStyle('titleText')})}>
            {translate('HISTORY')?.toUpperCase()}
          </Typography>
          {historyList && historyList?.length > 0 && (
            <Pressable
              onPress={() => {
                removeHistoryListFromAsyncStorage();
                setHistoryList([]);
              }}
              hitSlop={{bottom: 10, top: 10, left: 10, right: 10}}>
              <SvgView
                svgFile={creditech.Close}
                me={20}
                width={16}
                height={16}
              />
            </Pressable>
          )}
        </RowView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: hp(5), flexDirection: 'row'}}>
          {historyList?.length >= 1 &&
            historyList?.map((item, index) => {
              return (
                <HorizontalFlatListItemWrapper
                  style={index === 0 && {marginStart: wp(20)}}>
                  <DropShadowWrapper style={selectStyle('itemStyle')}>
                    {renderHistoryItem(item)}
                  </DropShadowWrapper>
                </HorizontalFlatListItemWrapper>
              );
            })}

          {!historyList ||
            (historyList?.length === 0 && (
              <Typography
                style={{ width:width}}
                customStyles={() => ({text: selectStyle('noHistoryText')})}>
                {translate('NO_HISTORY')}
              </Typography>
            ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <HomeNavHeader
          hiderUserImage
          search
          onChangeText={onQueryChange}
          value={
            historyQuery !== ''
              ? query
                ? query
                : historyQuery
              : query
              ? query
              : historyQuery
          }
        />
      </View>
      <ScrollView style={{flex: 1}}>
        {renderHistorySearch()}
        {renderQuickActions()}
        {renderSearchResults()}
      </ScrollView>
    </View>
  );
};

export const Search = baseScreen(search, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
