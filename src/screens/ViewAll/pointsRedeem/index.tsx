import React, { useState } from 'react';
import { Alert, Dimensions, Image, Pressable } from 'react-native';
import { baseScreen } from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import DefaultSeparator from 'src/components/DefaultSeparator';
import DefaultModal from 'src/components/DefaultModal';
import { RedeemPoints } from 'src/screens/RedeemPoints';

const pointsRedeem: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const stores = useStores();
  const DiscountMerchants = stores.backend.wallet.DiscountMerchants.data;

  const { translate } = useLocalization();
  const renderRedeemableMerchant = ({ item, index }) => {
    const itemsPerRow = 3;
    const marginStart = index % itemsPerRow === 0 ? 0 : 16;
    return (
      <Pressable
        onPress={() => {
          setSelectedItem(item);
          setShowModal(true);
        }}
      >
        <HorizontalFlatListItemWrapper
          style={{
            marginBottom: 0,
            backgroundColor: 'white',
            width: Dimensions.get('window').width / itemsPerRow - 22,
            height: 100,
            borderWidth: 1.43,
            borderRadius: 12,
            borderColor: '#E6E6E6',
            justifyContent: 'center',
            alignItems: 'center',
            paddingEnd: 0,
            marginStart: marginStart,
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </HorizontalFlatListItemWrapper>
      </Pressable>
    );
  };

  // const renderCards = ({ item }) => {
  //   return (
  //     <VerticalFlatListItemWrapper>
  //       <ImageWithShadow
  //         resizeMode="cover"
  //         noImage
  //         item={item}
  //         onPress={() => navigation.navigate('redeemPoints', { item: item })}
  //       />
  //     </VerticalFlatListItemWrapper>
  //   );
  // };

  const renderModel = () => {
    return (
      <>
        <DefaultModal
          bottom
          onCloseModal={() => setShowModal(false)}
          isVisible={showModal}
          animationInTiming={200}
          ViewContainerStyle={{ backgroundColor: '#FAFAFA' }}
        >
          <RedeemPoints
            selectedItem={selectedItem}
            closeModal={() => setShowModal(false)}
          />
        </DefaultModal>
      </>
    );
  };

  const renderList = () => {
    return (
      // <DefaultFlatList
      //   isFetchingData={false}
      //   flatListProps={{
      //     data: DiscountMerchants
      //       ? [ContactRedeemAt, ...DiscountMerchants]
      //       : [],
      //     renderItem: renderCards,
      //   }}
      // />
      <DefaultFlatList
        flatListProps={{
          contentContainerStyle: {
            paddingLeft: 0,
            alignItems: 'center',
          },

          numColumns: 3,
          data: DiscountMerchants,
          //       ? [ContactRedeemAt, ...DiscountMerchants]
          //       : [],
          renderItem: renderRedeemableMerchant,
          horizontal: false,
          keyExtractor: (item, index) => index + '',
        }}
      />
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      title={translate('REDEEMABLE_AT')}
    >
      <DefaultSeparator mt={8} height={0} color={'transparent'} />
      {renderList()}
      {renderModel()}
    </ScrollContainerWithNavHeader>
  );
};
export const PointsRedeem = baseScreen(pointsRedeem, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
