import React from 'react';
import {useNavigationUtils, useLocalization} from 'hooks';
import {baseScreen} from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ImageWithShadow from 'src/components/ImageWithShadowCN';

const merchantsSearch: React.FC = () => {
  const navigation = useNavigationUtils();

  const {data} = useRoute().params as {data: any};

  const {translate} = useLocalization();

  const renderItems = ({item}) => {
    const newItem = {...item, image: item.imageUrl};
    return (
      <VerticalFlatListItemWrapper style={{alignItems: 'center'}}>
        <ImageWithShadow
          renderTextInsteadOfImage
          mt={1}
          item={newItem}
          onPress={() =>
            navigation.navigate('merchantDetails', {merchant: newItem})
          }
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: data ? data : [],
          renderItem: renderItems,
        }}
      />
    );
  };

  return (
    <ScrollContainerWithNavHeader
      withUserImage={true}
      title={translate('ALL_MERCHANTS')}>
      {renderList()}
    </ScrollContainerWithNavHeader>
  );
};
export const MerchantsSearch = baseScreen(merchantsSearch, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
