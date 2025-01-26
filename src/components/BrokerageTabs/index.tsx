/**
 * Custom component for the brokerage sub categories tabs
 */
import { FlatList, Pressable, View, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useNavigationUtils, useStores } from 'hooks';
import { serviceItemInterface } from 'src/Types';
import DefaultFlatList from '../DefaulFlatList';
import ImageBackGroundWithTitle from '../ImageBackGroundWithTitle';
import { LoadingState } from 'utils';

interface BrokerageTabsInterface {
  style?: ViewStyle;
  width?: number;
  height?: number;
  br?: number;
  ms?: number;
  me?: number;
  service: serviceItemInterface;
}

const BrokerageTabs: React.FC<BrokerageTabsInterface> = (props) => {
  const stores = useStores();

  const { width, height, br, ms, me, style, service } = props;

  const brokerageSubData = stores.backend.products.subproductCategories.data;

  const selectedId = stores.backend.products.selectedSubproductCategoryName;

  const subproductsData = stores.backend.products.subproducts.data;

  const subproductsDataLoading = stores.backend.products.subproducts.loadingState === LoadingState.LOADING;

  const reference: React.RefObject<FlatList> = React.createRef();

  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  useEffect(() => {
    if (subproductsData && subproductsData.length > 0) {
      reference && reference?.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [subproductsData]);

  const {
    theme: {
      palette: { common }
    }
  } = useTheme();

  const getProductSubProducts = async (categoryName: string) => {
    stores.backend.products.setCurrentSubproductCategory(categoryName);
    await stores.backend.products.subproducts.updateOptions({
      productId: service.productId,
      categoryName
    });
  };

  const renderBrokerageSubCategoriesDataItem = ({ item }) => {
    return (
      <ImageBackGroundWithTitle
        onPress={async () => {
          await stores.backend.products.setSelectedSubproduct(Number(service?.productId), item);
          navigation.navigate('subCategoryService', {
            subCategoryData: { ...item, description: stores.backend.products.selectedSubproduct.description }
          });
        }}
        image={item.image}
        title={item.name}
      />
    );
  };

  return (
    service?.type === 'product' &&
    service?.cname === 'Brokerage' &&
    brokerageSubData?.length > 0 && (
      <View>
        <View style={selectStyle('container')}>
          <View style={selectStyle('tabsContainer')}>
            {brokerageSubData?.map((item, index) => (
              <Pressable
                onPress={() => getProductSubProducts(item.name)}
                style={[
                  selectStyle('categoryCard'),
                  width && { width: hp(width) },
                  height && { height: hp(height) },
                  br && { borderRadius: br },
                  ms && { marginStart: wp(ms) },
                  me && { marginEnd: wp(me) },
                  selectedId === item.name && selectStyle('tabSelected'),
                  index === brokerageSubData?.length - 1 && { marginEnd: 0 },
                  style
                ]}
              >
                <Typography
                  customStyles={() => ({
                    text: {
                      ...selectStyle('categoryText'),
                      color: common.darkBlue
                    }
                  })}
                >
                  {item.name}
                </Typography>
              </Pressable>
            ))}
          </View>
        </View>
        <DefaultFlatList
          ref={reference}
          isFetchingData={subproductsDataLoading}
          flatListProps={{
            data: subproductsData,
            renderItem: renderBrokerageSubCategoriesDataItem,
            horizontal: true,
            extraData: [subproductsData, subproductsDataLoading],
            keyExtractor: (item, index) => index + ''
          }}
          horizontal
        />
      </View>
    )
  );
};

export default BrokerageTabs;
