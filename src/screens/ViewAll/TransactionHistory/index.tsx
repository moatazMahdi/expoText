import React from 'react';
import {useRoute} from '@react-navigation/native';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import TransActionHistoryCard from 'src/components/TransActionHistoryCard';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useStyles} from 'elephanz-rn-ui';
import {useLocalization} from 'hooks';
import {baseScreen} from 'hoc';
import styles from './styles';

const transactionHistory: React.FC = () => {
  const route = useRoute();
  const data = route?.params?.data;

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();

  return (
    <ScrollContainerWithNavHeader
      showFloatingActionButton
      title={translate('PAYMENT_HISTORY')}>
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: data ? data : [],
          renderItem: ({item}) => {
            return (
              <VerticalFlatListItemWrapper>
                <TransActionHistoryCard
                  fromItemInfo={route?.params?.fromItemInfo}
                  cardStyle={selectStyle('customCard')}
                  item={item}
                />
              </VerticalFlatListItemWrapper>
            );
          },
        }}
      />
    </ScrollContainerWithNavHeader>
  );
};
export const TransactionHistory = baseScreen(transactionHistory, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
