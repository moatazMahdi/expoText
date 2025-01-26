import React, { useEffect, useState } from 'react';
import { useStores, useLocalization } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { hp } from 'src/utils/Dimensions/dimen';
import DefaultTextInput from 'src/components/DefaultTextInput';
import { View } from 'native-base';
import DefaultButton from 'src/components/DefaultButton';
import { activeContractInterface } from 'src/Types';
import { LoadingState } from 'src/utils/BackendEntity';
import DefaultFlatList from 'src/components/DefaulFlatList';
import PayModal from 'src/components/PayModal';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import ActiveContractCard from 'src/components/ActiveContractCard';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

const payToOthers: React.FC = () => {
  const stores = useStores();
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const [nationalId, setNationalId] = useState<string>();
  const [nationalIdError, setNationalIdError] = useState<string>('');
  const [pressed, setPressed] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const [selectedContract, setSelectedContract] =
    React.useState<activeContractInterface | null>(null);
  const data: activeContractInterface[] =
    stores.backend.users.userActiveContracts.data;
  const contractsLoading =
    stores.backend.users.userActiveContracts.loadingState ===
    LoadingState.LOADING;

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  useEffect(() => {
    if (data?.length > 0 && nationalId?.length === 14) {
      setFirstStep(false);
    }
  }, [data]);

  const handleGetContracts = () => {
    if (firstStep === true && nationalId.length === 14) {
      setPressed(true);
      stores.backend.users.userActiveContracts.updateOptions({
        nationalId,
      });
      ApplicationAnalytics(
        {
          eventKey: 'pay_to_others_req_installments',
          type: 'CTA',
          parameters: { nationalId },
        },
        stores,
      );
    } else {
      selectedContract && setShowModal(true);
      ApplicationAnalytics(
        {
          eventKey: 'pay_for_installments',
          type: 'CTA',
          parameters: { nationalId },
        },
        stores,
      );
    }
  };

  const renderCards = ({ item }) => {
    return (
      <VerticalFlatListItemWrapper>
        <ActiveContractCard
          selectedIds={selectedIds}
          selectable
          viewAll
          onPress={() => {
            setSelectedContract(item);
            setSelectedIds([item]);
          }}
          item={item}
          payToOther
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

  const renderPayModel = () => {
    return (
      <PayModal
        getContracts={() => {
          stores.backend.users.userContracts.data;
        }}
        screen={'payToOthers'}
        loading={loading}
        setLoading={setLoading}
        closeModal={closeModal}
        showModal={showModal}
        contract={selectedContract}
        isEarly={false}
      />
    );
  };

  const renderNationalId = () => {
    return (
      <View style={selectStyle('nationalIdContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('inputTitleText'),
          })}
        >
          {translate('ENTER_NATIONAL_ID')}
        </Typography>
        <DefaultTextInput
          keyboardType="decimal-pad"
          value={nationalId}
          textInputStyle={selectStyle('inputStyle')}
          maxLength={14}
          placeholder={translate('NID')}
          onchangeText={(value) => {
            setPressed(false);
            setNationalId(value);
            setFirstStep(true);
            setNationalIdError(
              value?.length !== 14 && translate('NATIONAL_ID_LENGTH'),
            );
            if (value === '')
              stores.backend.users.userActiveContracts._setData([], true);
          }}
        />
        {nationalIdError !== '' && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {nationalIdError}
          </Typography>
        )}
        {pressed && nationalId?.length === 14 && !contractsLoading
          ? renderList()
          : null}
        {renderPayModel()}
      </View>
    );
  };

  const renderButton = () => {
    return (
      <DefaultButton
        disabled={
          nationalId === '' ||
          nationalId?.length !== 14 ||
          (!firstStep && !selectedContract)
        }
        //mt={!firstStep ? 14 : 113}
        mb={20}
        title={
          !firstStep ? translate('PAY_DUE_INSTALLMENT') : translate('NEXT')
        }
        loading={contractsLoading}
        onPress={handleGetContracts}
        titleStyle={selectStyle('buttonTitle')}
        buttonStyle={selectStyle('buttonStyle')}
      />
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        scrollViewStyle={{ paddingTop: hp(20) }}
        showFloatingActionButton
        withUserImage
        title={translate('PAY_TO_OTHERS')}
      >
        {renderNationalId()}
      </ScrollContainerWithNavHeader>
      {renderButton()}
      {(loading || contractsLoading) && <DefaultOverLayLoading />}
    </View>
  );
};
export const PayToOthers = baseScreen(payToOthers, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
