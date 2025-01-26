import React, {FC, useEffect} from 'react';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import OurServicesCard from 'src/components/OurServicesCard';
import {mixServicesData} from 'src/utils/HelpersFunctions';
import {useStores, useLocalization} from 'hooks';
import {useRoute} from '@react-navigation/native';
import {baseScreen} from 'hoc';
import ArticlesCard from 'src/components/ArticlesCard';
import OurServicesSVGCard from 'src/components/OurServicesSVGCard';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {Typography} from 'elephanz-rn-ui';
import {View} from 'react-native';
import NavigationHeader from 'src/components/NavigationHeader';

const ourServices: FC = () => {
  const {data, dynamicLink} =
    (useRoute().params as {data: any; dynamicLink?: boolean}) || {};

  const [programsProducts, setProgramsProducts] = React.useState<any>([]);

  const {translate} = useLocalization();
  const stores = useStores();

  const {data: programsData} = stores.backend.programs.programs;
  const {data: productsData} = stores.backend.products.products;

  let listData = dynamicLink ? programsProducts : data;

  listData = listData.map(item => {
    if (!item.cname) {
      if (item?.title === 'اشترى وانت مطمن') {
        item.title = 'We got you covered';
      }

      if (item?.title === 'عائلتك اولاً') {
        item.title = 'Family comes first';
      }

      item.cname = item?.title.split(' ').join('_').toLowerCase();
    }

    return item;
  });
  useEffect(() => {
    if (productsData || programsData)
      mixServicesData(
        programsData,
        productsData,
        translate,
        setProgramsProducts,
      );
  }, [productsData, programsData]);

  return (
    <>
      <NavigationHeader
        shapeVariant="orange"
        renderSearch
        withUserImage={true}
        title={translate('ALL_SERVICES')}
      />

      <DefaultFlatList
        horizontal={false}
        isFetchingData={false}
        flatListProps={{
          numColumns: 3,
          data: listData ? listData : [],
          renderItem: ({item}) => {
            return (
              <View
                style={{
                  width: wp(110), // Adjust this number based on the number of columns
                  height: hp(150),
                  // justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: hp(2),
                  // backgroundColor: 'red',
                }}>
                <OurServicesSVGCard
                  item={item}
                  svgImage={item?.cname}
                  width={90}
                  height={90}
                />
              </View>
            );
          },
        }}
      />
    </>
  );
};

export const OurServices = baseScreen(ourServices, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
