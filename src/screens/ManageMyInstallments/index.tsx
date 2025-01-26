import React from 'react';
import { RefreshControl, View } from 'react-native';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useStores, useNavigationUtils, useLocalization } from 'hooks';
import PurchaseHistoryCard from 'src/components/PurchaseHistoryCard';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { useTheme } from 'elephanz-rn-ui';
import { LoadingState } from 'utils';
import { baseScreen } from 'hoc';

const manageMyInstallments: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  const contractsLoading =
    stores.backend.users.userContracts.loadingState === LoadingState.LOADING;
  const userActiveContractsLoading =
    stores.backend.users.userActiveContracts.loadingState ===
    LoadingState.LOADING;
  const userContracts = stores.backend.users.userContracts.data;
  const userActiveContracts = stores.backend.users.userActiveContracts.data;
  const user = stores?.backend?.users?.userData;

  const {
    theme: {
      palette: { primary },
    },
  } = useTheme();

  const refresh = async () => {
    await stores.backend.users.userContracts.updateOptions({
      userId: user?.id,
    });

    await stores.backend.users.userActiveContracts.updateOptions({
      nationalId: user?.nationalId,
    });
  };

  const renderRefreshControl = () => {
    return (
      <RefreshControl
        tintColor={primary.value}
        colors={[primary.value]}
        refreshing={contractsLoading || userActiveContractsLoading}
        onRefresh={refresh}
      />
    );
  };

  const navigatePurchaseHistoryItemInfo = async (item) => {
    setLoading(true);

    try {
      stores.backend.users.setCurrentContract(item?.contractId);
      await stores.backend.users.getContractDetailsById();
      setLoading(false);
      navigation.navigate('installmentItemInfo', {
        purchaseData: { ...item, contractId: item?.contractId },
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        emptyString={translate('INSTALLMENT_EMPTY_MESSAGE')}
        isFetchingData={false}
        flatListProps={{
          refreshControl: renderRefreshControl(),
          data:
            userActiveContracts && userActiveContracts?.length > 0
              ? userActiveContracts
              : userContracts
              ? userContracts
              : [],
          renderItem: ({ item }) => (
            <VerticalFlatListItemWrapper>
              <PurchaseHistoryCard
                viewAll
                onPress={navigatePurchaseHistoryItemInfo}
                item={item}
              />
            </VerticalFlatListItemWrapper>
          ),
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        view
        showFloatingActionButton
        withUserImage={false}
        title={translate('MANAGE_MY_INSTALLMENTS')}
      >
        {renderList()}
      </ScrollContainerWithNavHeader>
      {(loading || contractsLoading || userActiveContractsLoading) && (
        <DefaultOverLayLoading />
      )}
    </View>
  );
};

export const ManageMyInstallments = baseScreen(manageMyInstallments, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
