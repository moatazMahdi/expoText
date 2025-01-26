import React, {useState, useEffect} from 'react';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ViewAll from 'src/components/ViewAll';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import PlansCard from 'src/components/PlansCard';
import BranchCard from 'src/components/BranchCard';
import FloatingHelperView from 'src/components/FloatingHelperView';
import {View} from 'native-base';
import {LoadingState} from 'utils';
import ProgressiveImage from 'src/components/ProgressiveImage';
import DefaultButton from 'src/components/DefaultButton';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import {Dimensions, Image, Pressable, ScrollView} from 'react-native';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import BrokerageTabs from 'src/components/BrokerageTabs';
import {serviceItemInterface} from 'src/Types';
import {BottomContainer} from 'src/components/BottomContainer';

const serviceScreen: React.FC = () => {
  const {width} = Dimensions.get('window');

  const stores = useStores();

  const {
    backend: {general: gernalStore},
  } = stores;

  const navigation = useNavigationUtils();

  const {service} = useRoute().params as {service: serviceItemInterface};

  const {translate} = useLocalization();

  const [noCalculator, setNoCalculator] = React.useState(false);

  const [cardHeights, setCardHeights] = React.useState([]);
  const [biggestHeight, setBiggestHeight] = React.useState(260);

  const reference = React.createRef();

  const subproductsData = stores.backend.products.subproducts.data;

  const {selectStyle} = useStyles(styles);

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const [plansData, setPlansData] = useState([]);

  const filterPlansData = plansData => {
    let filteredPlansData = [];
    plansData?.forEach(plan => {
      if (plan.description !== '' && plan.title !== '') {
        filteredPlansData.push(plan);
      }
    });
    setPlansData(filteredPlansData);
  };

  const getSubproductCategories = async () => {
    await stores.backend.products.subproductCategories.updateOptions({
      productId: service.productId,
    });

    const getProductSubproducts = async (categoryName: string) => {
      stores.backend.products.setCurrentSubproductCategory(categoryName);
      await stores.backend.products.subproducts.updateOptions({
        productId: service.productId,
        categoryName,
      });
    };

    // Get Merchants of first ID
    const categoriesData = stores.backend.products.subproductCategories.data;
    if (categoriesData.length > 0) {
      await getProductSubproducts(categoriesData[0].name);
    }
  };

  useEffect(() => {
    if (service?.id && service?.type === 'product') {
      if (['Brokerage', 'Leasing']?.includes(service?.name)) {
        setNoCalculator(true);
      }

      const getData = async () => {
        await stores.backend.products.productPlans.updateOptions({
          productId: service?.id,
        });
        // setPlansData(stores.backend.products.productPlans.data);
        stores.backend.products.productPlans.data &&
          filterPlansData(stores.backend.products.productPlans.data);
      };

      getData();
    }
    stores.backend.products.setProduct(
      service?.type === 'product' ? service?.name : '',
    );

    if (service?.type === 'product' && service?.cname === 'Brokerage')
      getSubproductCategories();

    // if (!currentMerchant || !currentMerchant.name) {
    //   const getData = async () => {
    //     await stores.backend.wallet.getMerchantById(
    //       (service as any)?.name,
    //       (service as any)?.type
    //     );
    //     setCurrentMerchant(stores.backend.wallet.selectedMerchant);
    //   };
    //   getData();
    // }
  }, []);

  useEffect(() => {
    if (subproductsData && subproductsData.length > 0) {
      reference && reference?.current?.scrollToOffset();
    }
  }, [subproductsData]);

  useEffect(() => {
    setCardHeights([]);
  }, [plansData]);

  useEffect(() => {
    if (cardHeights.length > 0) {
      setBiggestHeight(Math.max(...cardHeights));
    }
  }, [cardHeights]);

  const renderImage = () => {
    return (
      <ProgressiveImage
        resizeMode="cover"
        // uri: service?.image ? service?.image : service?.backgroundImage
        imageSource={{
          uri: service?.image ? service?.image : service?.backgroundImage,
        }}
        imageStyle={selectStyle('headerImage')}
      />
    );
  };
  const renderPlansCards = ({item}) => {
    return (
      <PlansCard
        setHeight={value => {
          let ch = [...cardHeights];
          ch.push(value);
          setCardHeights(ch);
        }}
        item={item}
        height={biggestHeight + 130}
        width={plansData.length === 1 ? width - wp(20) : null}
      />
    );
  };
  const renderBranchLocations = ({item}) => {
    return <BranchCard item={item} />;
  };

  const onNavigatePlansCompare = () => {
    ApplicationAnalytics(
      {
        eventKey: 'contact_compare',
        type: 'CTA',
        parameters: {serviceName: service?.name},
      },
      stores,
    );
    navigation.navigate('plansSelection', {data: plansData, service});
  };
  const renderPlans = () => {
    return (
      service?.type === 'product' && (
        <ViewAll
          title={translate('PLANS')}
          rightComponentText={translate('COMPARE')}
          hideViewAll={plansData.length < 2}
          data={plansData}
          renderItems={renderPlansCards}
          onPress={onNavigatePlansCompare}
          horizontal={true}
        />
      )
    );
  };
  const onNavigateBranches = () => {
    navigation.navigate('branches', {data: gernalStore.branches.data});
  };
  const renderNearestBranch = () => {
    return (
      service?.type === 'product' && (
        <ViewAll
          title={translate('SERVICE_BRANCHES')}
          data={gernalStore.branches.data}
          renderItems={renderBranchLocations}
          onPress={onNavigateBranches}
          loading={
            gernalStore.branches.loadingState === LoadingState.SUCCEEDED
              ? false
              : true
          }
          maxNumberOfItemsToRender={3}
          horizontal={true}
        />
      )
    );
  };
  const canRenderButton = noCalculator || service?.type !== 'product';

  const renderApplyButton = () => {
    if (service?.type === 'program') {
      if (service?.id !== 'REWARDS') {
        return (
          canRenderButton && (
            <View style={{justifyContent: 'flex-end'}}>
              <BottomContainer>
                <DefaultButton
                  onPress={() =>
                    navigation.navigate('requestMoreInfoScreen', {
                      programId:
                        service?.type !== 'product' ? service?.id : null,
                    })
                  }
                  title={translate('APPLY')}
                />
              </BottomContainer>
            </View>
          )
        );
      }
    } else {
      if (service?.cname !== 'Brokerage') {
        return (
          canRenderButton && (
            <View
              style={{
                justifyContent: 'flex-end',
                //marginBottom: 0,
                marginBottom: hp(20),
              }}>
              <DefaultButton
                onPress={() =>
                  navigation.navigate('requestMoreInfoScreen', {
                    programId: service?.type !== 'product' ? service?.id : null,
                  })
                }
                title={translate('APPLY')}
              />
            </View>
          )
        );
      }
    }
  };

  const isValidJSONString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const renderSections = (value: {
    id: number;
    sectionBody: string;
    sectionName: string;
  }) => {
    return (
      <DropShadowWrapper mh={20} mv={15}>
        <View
          style={[selectStyle('detailsCard'), {backgroundColor: common.white}]}>
          <View key={value.sectionName}>
            {value?.sectionName ? (
              <Typography fontWeight="700">{value.sectionName}</Typography>
            ) : null}
            {isValidJSONString(value.sectionBody) && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {JSON.parse(value.sectionBody)?.map((ele: any) => (
                  <Pressable
                    key={ele.title}
                    // onPress={onCardPress(ele)}
                    style={selectStyle('cardContainer')}>
                    <View style={selectStyle('imageView')}>
                      <Image
                        source={{
                          uri: ele.url,
                        }}
                        style={selectStyle('cardImage')}
                      />
                    </View>
                    <Typography
                      customStyles={() => ({
                        text: selectStyle('titleCard'),
                      })}>
                      {ele.name}
                    </Typography>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {!isValidJSONString(value.sectionBody) && (
              <Typography
                customStyles={() => ({
                  text: {lineHeight: hp(20)},
                })}
                marginTop={16}>
                {/* {value?.sectionBody?.replaceAll('\t', '')} */}
                {value?.sectionBody.split('\t')?.join(' ')}
              </Typography>
            )}
          </View>
        </View>
      </DropShadowWrapper>
    );
  };

  const renderDetails = () => {
    return (
      service?.type === 'program' && (
        <View>{service?.sections?.map(value => renderSections(value))}</View>
      )
    );
  };

  /**
   *
   * @returns Brokerage sub products tab items
   */
  const renderBrokerageSubCategoriesItem = () => {
    return <BrokerageTabs service={service} />;
  };

  const renderProductDescription = () => {
    return (
      service?.type === 'product' && (
        <ViewAll
          title={translate('ABOUT') + ' ' + service?.title}
          showTitle
          hideViewAll>
          <DropShadowWrapper style={{elevation: 0}} mh={20} mb={20}>
            <View style={selectStyle('detailsCard')}>
              <Typography
                customStyles={() => ({
                  text: {lineHeight: hp(20)},
                })}>
                {service?.longDescription?.trim()
                  ? service?.longDescription?.trim()
                  : service?.description?.trim()}
              </Typography>
            </View>
          </DropShadowWrapper>
        </ViewAll>
      )
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        scrollViewStyle={{
          paddingBottom: service?.type === 'product' ? hp(80) : 0,
        }}
        withUserImage
        shapeVariant="orange"
        title={service?.title}>
        {renderImage()}
        {renderProductDescription()}
        {renderBrokerageSubCategoriesItem()}
        {renderPlans()}
        {renderDetails()}
        {renderNearestBranch()}
      </ScrollContainerWithNavHeader>
      {service?.type === 'product' && (
        <FloatingHelperView
          bot={canRenderButton ? 70 : 20}
          product={service}
          plans={service.plans}
        />
      )}
      {renderApplyButton()}
    </View>
  );
};
export const ServiceScreen = baseScreen(serviceScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
