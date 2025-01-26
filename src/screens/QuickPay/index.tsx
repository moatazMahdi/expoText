import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { baseScreen } from 'hoc';
import { LoadingState } from 'utils';
import PayModal from 'src/components/PayModal';
import { useStores, useLocalization } from 'hooks';
import { activeContractInterface } from 'src/Types';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import ActiveContractCard from 'src/components/ActiveContractCard';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';

const quickPay: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedContract, setSelectedContract] =
    useState<activeContractInterface | null>(null);

  const { translate } = useLocalization();
  const stores = useStores();

  const user = stores?.backend?.users?.userData;
  const data: activeContractInterface[] =
    stores.backend.users.userActiveContracts.data;
  const contractsLoading =
    stores.backend.users.userActiveContracts.loadingState ===
    LoadingState.LOADING;

  useEffect(() => {
    stores.backend.users.userActiveContracts.updateOptions({
      nationalId: user?.nationalId,
    });
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const renderCards = ({ item }) => {
    return (
      <VerticalFlatListItemWrapper>
        <ActiveContractCard
          viewAll
          onPress={() => {
            setSelectedContract(item);
            ApplicationAnalytics(
              {
                type: 'CTA',
                eventKey: 'quick_pay_selected_items_to_pay',
                parameters: {
                  ...item,
                },
              },
              stores,
            );
            setShowModal(true);
          }}
          item={item}
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        emptyString={translate('INSTALLMENT_EMPTY_MESSAGE')}
        isFetchingData={false}
        flatListProps={{
          data: data ? data : [],
          renderItem: renderCards,
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        showFloatingActionButton
        withUserImage={false}
        title={translate('QUICK_PAY')}
      >
        {renderList()}

        {selectedContract && (
          <PayModal
            getContracts={() => {
              stores.backend.users.userActiveContracts.updateOptions({
                nationalId: user?.nationalId,
              });
            }}
            screen={'quickPay'}
            loading={loading}
            setLoading={setLoading}
            closeModal={closeModal}
            showModal={showModal}
            contract={selectedContract}
            isEarly={false}
          />
        )}
      </ScrollContainerWithNavHeader>

      {(loading || contractsLoading) && <DefaultOverLayLoading />}
    </View>
  );
};
export const QuickPay = baseScreen(quickPay, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
