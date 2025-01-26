import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { DropdownOption } from 'elephanz-rn-ui/src/components/inputs/Dropdown/types';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import ImageWithShadow from 'src/components/ImageWithShadowCN';
import DefaultDropdown from 'src/components/DefaultDropdown';
import PressableChoice from 'src/components/PressableChoice';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import { useStyles, useTheme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Area, City } from 'src/Types';
import { LoadingState } from 'utils';
import { Merchant } from 'shared';
import { baseScreen } from 'hoc';
import styles from './styles';

const shopFromMerchants: React.FC = () => {
  const { dynamicLink, merchantCategoryId, subCategoryId,screenName } =
    (useRoute().params as any) || {};

  const [merchantSubCategory, setMerchantSubCategory] = useState<string>(
    subCategoryId ?? '0',
  );
  const [merchantSubCategories, setMerchantSubCategories] = useState([]);
  const [city, setCity] = useState<DropdownOption>({ label: '', value: '' });
  const [area, setArea] = useState<DropdownOption>({ label: '', value: '' });
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [totalPages, setTotalPages] = useState(2);

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  const merchantCategories = stores.backend.products.merchantsCategories.data;
  const [merchantCategory, setMerchantCategory] = React.useState<
    DropdownOption | { subCategories: [] }
  >({
    label: 'All',
    value: dynamicLink ? merchantCategoryId : '1',
    subCategories: [],
  });
  const citiesData: City[] = stores.backend.products.productCities.data;
  const citiesLoading =
    stores.backend.products.productCities.loadingState === LoadingState.LOADING;
  const areasLoading =
    stores.backend.products.productAreas.loadingState === LoadingState.LOADING;
  const areasData: Area[] = stores.backend.products.productAreas.data || [];
  const [productMerchants, setProductMerchants] = useState<Merchant[]>(
    stores.backend.products.productMerchants.data,
  );
  const productMerchantsLoadingState =
    stores.backend.products.productMerchantsLoadingState ===
    LoadingState.LOADING;
  const areasIsDisabled = city?.value === '' || areasData.length <= 0;
  const { width } = Dimensions.get('screen');

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  useEffect(() => {
    const getCities = async () => {
      await stores.backend.products.productCities.updateOptions({
        productId: 6,
      });
    };

    const getMerchantCatagories = async () => {
      dynamicLink
        ? stores.backend.products.merchantsCategories.data ??
          (await stores.backend.products.merchantsCategories.updateOptions({}))
        : null;
    };

    getMerchantCatagories();
    getCities();
  }, []);

  const getProductMerchants = async (
    newOptions: any,
    clearMerchants?: boolean,
  ) => {
    const options = stores.backend.products.productMerchants.options
      ? stores.backend.products.productMerchants.options
      : {};

    try {
      const newData = await stores.backend.products.getProductMerchants({
        productId: '6',
        pageNumber: currentPage,
        pageSize: 20,
        ...options,
        ...newOptions,
      });

      const oldData = clearMerchants ? [] : productMerchants;

      oldData?.length > 0
        ? setProductMerchants([...oldData, ...newData?.merchants])
        : setProductMerchants(newData?.merchants);

      setTotalPages(newData?.totalPages);
    } catch (e) {}
  };

  const onSearch = (data?) => {
    // const category = merchantCategory?.value + '';
    const subCategory = merchantSubCategory + '';
    const cityValue = city?.value + '';
    const areaValue = area?.value + '';

    const productMerchantsData = {
      cityId: cityValue ? city?.value + '' : '0',
      areaId: areaValue ? area?.value + '' : '0',
      categoryId: subCategory,
    };

    getProductMerchants(productMerchantsData, data?.clearMerchants);
  };

  useEffect(() => {
    currentPage < totalPages && currentPage > 1
      ? onSearch()
      : setLoadingMore(false);
  }, [currentPage]);

  useEffect(() => {
    onSearch({ clearMerchants: true });
  }, [merchantCategory, merchantSubCategory, area, city]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setLoadingMore(true);
  };

  const resetData = () => {
    setProductMerchants([]);
    setLoadingMore(false);
    setCurrentPage(1);
  };

  const merchantSubCategoriesItem = ({ item }) => {
    return (
      <PressableChoice
        item={item}
        itemId={item.code}
        onPress={() => {
          resetData();
          setMerchantSubCategory(item?.code);
        }}
        selectedId={merchantSubCategory}
        title={tempTranslate(item?.name?.en, item?.name?.ar)}
      />
    );
  };

  const renderSearchResult = ({ item }) => {
    const newItem = { ...item, image: item.imageUrl };

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
            screenName === "bookingAuth" ? 
            navigation.navigate('bookingAuthenticationOfferCalculate', { merchant: newItem }):navigation.navigate('merchantDetails', { merchant: newItem })
          }
        />
      </HorizontalFlatListItemWrapper>
    );
  };

  const getAreas = async (cityId: string) => {
    await stores.backend.products.productAreas.updateOptions({
      cityId,
    });
  };

  const dropDownsData = [
    {
      data: merchantCategories,
      placeholder: translate('MERCHANT_CATEGORIES'),
      value: merchantCategory,
      onChangeItem: (item) => {
        resetData();
        setMerchantCategory(item);

        //press select
        if (item === 0) {
          setMerchantSubCategories([]);
          setMerchantCategory({ value: '', label: '', subCategories: [] });
        } else {
          let SubCategories = item?.subCategories;
          setMerchantSubCategories(item?.subCategories);

          //to handle all category
          if (SubCategories?.length > 0) {
            const firstSubCategoryCode = SubCategories[0]?.code;
            setMerchantSubCategory(firstSubCategoryCode);
          } else setMerchantSubCategory('0');
        }
      },
    },
    {
      data: citiesData && !citiesLoading ? citiesData : [],
      placeholder: translate('CITY'),
      value: city,
      onChangeItem: (item) => {
        getAreas(item?.value);
        setCity(item);
        setArea({ label: '', value: '' });
        resetData();
      },
    },
    {
      data: areasData && !areasLoading ? areasData : [],
      placeholder: translate('AREAS'),
      value: area,
      onChangeItem: (item) => {
        setArea(item);
        resetData();
      },
      disabled: areasIsDisabled,
      textColor: areasIsDisabled ? common.placeHolderText : common.darkBlue,
    },
  ];

  return (
    <ScrollContainerWithNavHeader
      renderSearch
      showFloatingActionButton
      view
      withUserImage
      title={translate('ALL_MERCHANTS')}
    >
      <View style={{ height: hp(100) }}>
        <DefaultFlatList
          horizontal
          flatListProps={{
            data: dropDownsData,
            contentContainerStyle: selectStyle('rowStyle'),
            renderItem: ({ item }) => {
              return (
                <DefaultDropdown
                  data={item?.data}
                  placeholder={item?.placeholder}
                  value={item?.value}
                  onChange={item?.onChangeItem}
                  style={selectStyle('dropdownStyle')}
                  disabled={item?.disabled}
                  textColor={item?.textColor ?? common.darkBlue}
                  dropDownStyle={{
                    minWidth: width / 4,
                    marginHorizontal: wp(5),
                  }}
                  SelectedItemObject
                  removeBorderIfNotOpen
                  notFullWidth
                />
              );
            },
          }}
        />
      </View>

      {merchantSubCategories?.length > 1 ? (
        <View style={{ height: hp(70) }}>
          <DefaultFlatList
            flatListProps={{
              data: merchantSubCategories ?? [],
              renderItem: merchantSubCategoriesItem,
            }}
            horizontal
          />
        </View>
      ) : null}

      <DefaultFlatList
        emptyString={translate('NO_MERCHANTS_FOUND')}
        isFetchingData={productMerchantsLoadingState && currentPage === 1}
        optimized
        loadingMore={loadingMore}
        style={{ marginTop: 0 }}
        flatListProps={{
          numColumns: 2,
          scrollEventThrottle: 32,
          data: productMerchants ?? [],
          extraData: productMerchants ?? [],
          renderItem: renderSearchResult,
          onEndReached: () => setScrollEnd(true),
          onMomentumScrollEnd: () => {
            scrollEnd && currentPage < totalPages ? handleLoadMore() : null;
            setScrollEnd(false);
          },
          onEndReachedThreshold: 1,
        }}
      />
    </ScrollContainerWithNavHeader>
  );
};

export const ShopFromMerchants = baseScreen(shopFromMerchants, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
