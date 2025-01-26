import React from 'react';
import {Pressable, View} from 'react-native';
import {useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import DefaultFlatList from 'src/components/DefaulFlatList';
import PointsHistoryCard from 'src/components/PointsHistoryCard';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import {useLocalization, useStores} from 'hooks';
import NavigationHeader from 'src/components/NavigationHeader';
import FloatingActionButton from 'src/components/FloatingActionButton';
import DefaultSeparator from 'src/components/DefaultSeparator';
import {hp} from 'src/utils/Dimensions/dimen';

const pointsHistory: React.FC = () => {
  const stores = useStores();

  const userVouchers = stores.backend.wallet.userVouchers.data;

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  const renderCards = ({item}) => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginTop: 16,
          paddingHorizontal: 16,
        }}>
        <PointsHistoryCard item={item} />
      </View>
    );
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        optimized
        isFetchingData={false}
        flatListProps={{
          data: userVouchers ? userVouchers : [],
          renderItem: renderCards,
        }}
      />
    );
  };

  return (
    <View style={selectStyle('container')}>
      <FloatingActionButton bot={hp(40)} />
      <NavigationHeader
        shapeVariant="orange"
        title={translate('POINTS_HISTORY')}
        withUserImage={false}
      />
      <DefaultSeparator mt={8} height={0} color={'transparent'} />

      {renderList()}
    </View>
  );
};
export const PointsHistory = baseScreen(pointsHistory, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
