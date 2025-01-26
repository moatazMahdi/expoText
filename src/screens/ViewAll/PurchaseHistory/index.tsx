import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import styles from './styles';
import PurchaseHistoryCard from 'src/components/PurchaseHistoryCard';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import FilterIconComponent from 'src/components/FilterIconComponent';
import Modal from 'react-native-modal';
const purchaseHistory: React.FC = () => {
  const { selectStyle } = useStyles(styles);

  const stores = useStores();

  const { translate } = useLocalization();

  const [loading, setLoading] = React.useState(false);

  const userContracts = stores.backend.users.userContracts.data;

  const { navigate } = useNavigationUtils();

  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState(4);
  const [sortedContracts, setSortedContracts] = React.useState([]);

  const navigatePurchaseHistoryItemInfo = async (item) => {
    setLoading(true);
    try {
      stores.backend.users.setCurrentContract(item?.contractId);
      await stores.backend.users.getContractDetailsById();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }

    navigate('installmentItemInfo', {
      purchaseData: { ...item, contractId: item?.contractId },
    });
  };

  const sortByDate = (arr, sortBy: string, orderBy: string) => {
    let newArr = [...arr];
    newArr.sort(function (a, b) {
      var aa = a[`${sortBy}`]?.split('/')?.reverse()?.join(),
        bb = b[`${sortBy}`]?.split('/')?.reverse()?.join();
      return orderBy === 'desc'
        ? aa > bb
          ? -1
          : aa < bb
          ? 1
          : 0
        : aa < bb
        ? -1
        : aa > bb
        ? 1
        : 0;
    });
    setSortedContracts(newArr);
  };

  useEffect(() => {
    switch (selectedFilter) {
      case 1:
        sortByDate(userContracts, 'contractDate', 'asc');
        break;
      case 2:
        sortByDate(userContracts, 'contractDate', 'desc');

        break;
      case 3:
        sortByDate(userContracts, 'nextDueDate', 'asc');
        break;
      case 4:
        sortByDate(userContracts, 'nextDueDate', 'desc');
        break;
      default:
        break;
    }
  }, [selectedFilter]);

  const closeModal = () => {
    setOpenFilter(false);
  };

  const renderOpenFilter = () => {
    return (
      <FilterIconComponent
        setOpenFilter={setOpenFilter}
        openFilter={openFilter}
      />
    );
  };

  const renderPurchaseHistoryCards = ({ item }) => {
    return (
      <VerticalFlatListItemWrapper>
        <PurchaseHistoryCard
          viewAll
          onPress={navigatePurchaseHistoryItemInfo}
          item={item}
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderPurchaseHistoryList = () => {
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: sortedContracts ? sortedContracts : [],
          renderItem: renderPurchaseHistoryCards,
        }}
      />
    );
  };

  const renderItemFilter = (text, id) => (
    <Pressable
      onPress={() => {
        setSelectedFilter(id);
        closeModal();
      }}
      style={[
        selectStyle('filterItem'),
        id === selectedFilter && selectStyle('filterItemSelected'),
      ]}
    >
      <Typography>{text}</Typography>
    </Pressable>
  );

  const renderFilterModal = () => {
    const animationTiming = 750;
    return (
      <Modal
        style={selectStyle('modalStyle')}
        animationIn={'slideInUp'}
        animationInTiming={animationTiming}
        animationOut={'slideOutDown'}
        animationOutTiming={animationTiming}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        isVisible={openFilter}
        backdropTransitionInTiming={animationTiming}
        backdropTransitionOutTiming={animationTiming}
      >
        <View style={selectStyle('modalViewContainer')}>
          {renderItemFilter(translate('SORT_BY_PURCHASE_DATE_ASCENDING'), 1)}
          {renderItemFilter(translate('SORT_BY_PURCHASE_DATE_DESCENDING'), 2)}
          {renderItemFilter(translate('SORT_BY_DUE_DATE_ASCENDING'), 3)}
          {renderItemFilter(translate('SORT_BY_DUE_DATE_DESCENDING'), 4)}
        </View>
      </Modal>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader
        navHeaderRightComponentWithImage={renderOpenFilter}
        showFloatingActionButton
        withUserImage
        title={translate('PURCHASE_HISTORY')}
      >
        {renderPurchaseHistoryList()}
        {renderFilterModal()}
      </ScrollContainerWithNavHeader>
      {loading && <DefaultOverLayLoading />}
    </>
  );
};
export const PurchaseHistoryScreen = baseScreen(purchaseHistory, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
