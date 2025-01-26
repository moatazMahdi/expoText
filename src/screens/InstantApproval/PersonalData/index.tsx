import React, {useEffect, useState} from 'react';
import {I18nManager, View, Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {BottomContainer} from 'src/components/BottomContainer';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {ContinueLater} from 'src/components/ContinueLater';
import DefaultDropdown from 'src/components/DefaultDropdown';
import DefaultButton from 'src/components/DefaultButton';
import {
  areas,
  areasEn,
  governorates,
  governoratesEn,
  maritalStatusEn,
  maritalStatus as MaritalStatus,
} from 'src/screens/InstantApproval/clientInfo/data';
import {useStyles, useTheme} from 'elephanz-rn-ui';
import {hp} from 'src/utils/Dimensions/dimen';
import {PageTitle} from 'components';
import {
  getTextColor,
  saveInstantApprovalProgress,
} from 'src/utils/HelpersFunctions';
import styles from './styles';

export const PersonalData: React.FC = () => {
  const route = useRoute() || {};
  const params = useRoute().params as any;
  const {
    nationalId,
    categoriesData,
    selfiePic,
    userInputNationalId,
    referralType,
    referralCode,
    hasPromoCode,
  } = params || {};
  const {street, full_name, first_name} =
    categoriesData && categoriesData[0]?.data
      ? categoriesData[0]?.data
      : {street: '', full_name: '', first_name: ''};

  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [editAdditionAddress, setEditAdditionAddress] =
    useState<boolean>(false);
  const [name, setName] = useState(
    first_name || full_name ? `${first_name} ${full_name}` : '',
  );
  const [address, setAddress] = useState(street);
  const [additionalAddress, setAdditionalAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const spaceBetween = {marginBottom: hp(20)};
  const [homeArea, setHomeArea] = useState('');
  const [homeGov, setHomeGov] = useState('');

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(
    () => setEditAdditionAddress(!additionalAddress ? true : false),
    [],
  );

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'goodPersonalDetails',
        type: 'STATUS',
        parameters: {
          name: name ?? '',
          address: address ?? '',
          additionalAddress: additionalAddress ?? '',
          maritalStatus: maritalStatus ?? '',
          homeGov: homeGov ?? '',
          homeArea: homeArea ?? '',
        },
      },
      stores,
    );

    const progress = {
      name: 'residentialStatus',
      params: {
        userInputNationalId,
        nationalId,
        categoriesData,
        selfiePic,
        personalDetails: {
          name,
          address,
          maritalStatus,
          homeGov,
          homeArea,
          additionalAddress,
        },
        referralType,
        referralCode,
        hasPromoCode,
      },
    };

    await saveInstantApprovalProgress(progress);

    // Navigate to Next Screen
    navigation.navigate(progress);

    setIsLoading(false);
  };

  const renderPersonalDataInfo = (
    title,
    changed,
    value,
    editable,
    onchangeText,
  ) => {
    return (
      <DefaultTextInput
        title={title}
        textOnly={!editable}
        changed={changed}
        value={value}
        placeHolder={title}
        placeholderTextColor={common.placeHolderText}
        onchangeText={onchangeText}
        inputContainer={spaceBetween}
      />
    );
  };

  const onContinuePressed = () => {
    // Check if every required field is filled
    if (
      name !== '' &&
      address !== '' &&
      maritalStatus !== '' &&
      homeGov !== '' &&
      homeArea !== '' &&
      additionalAddress !== ''
    ) {
      navigateToNextScreen();
    } else {
      Alert.alert(translate('DEAR_CLIENT'), translate('PLEASE_FILL'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    }
  };

  const onEditInfoPressed = () => {
    ApplicationAnalytics(
      {
        eventKey: 'editPersonalDetails',
        type: 'CTA',
        parameters: {ScreenName: route?.name},
      },
      stores,
    );
    setEnableEdit(true);
    setEditAdditionAddress(true);
  };

  const renderEditButtons = () => (
    <View>
      <DefaultButton
        onPress={onContinuePressed}
        title={translate('LOOKS_GOOD')}
      />

      <DefaultButton
        mt={10}
        onPress={onEditInfoPressed}
        title={translate('EDIT_SOME_INFO')}
        variant="secondaryBackground"
      />
    </View>
  );

  const renderConfirmEditButtons = () => (
    <View>
      <DefaultButton
        onPress={() => {
          setEnableEdit(false);
          setEditAdditionAddress(additionalAddress ? false : true);
        }}
        title={translate('DONE')}
      />

      <DefaultButton
        mt={10}
        onPress={() => setEnableEdit(false)}
        title={translate('GENERIC_CANCEL')}
        variant="secondaryBackground"
      />
    </View>
  );

  const renderMaritalStatus = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          data={
            I18nManager.isRTL
              ? MaritalStatus?.map(value => {
                  return {value, label: value};
                })
              : maritalStatusEn?.map(value => {
                  return {value, label: value};
                })
          }
          title={translate('MARTIAL_STATUS')}
          placeholder={translate('WHATS_YOUR_MARTIAL_STATUS').replace('"', "'")}
          value={maritalStatus}
          onChange={item => setMaritalStatus(item)}
          textColor={getTextColor(maritalStatus)}
        />
      </View>
    );
  };

  const renderHomeGov = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('GOVERNORATE')}
          placeholder={translate('WHATS_YOUR_HOME_GOVERNORATE').replace(
            '"',
            "'",
          )}
          value={homeGov}
          data={
            I18nManager.isRTL
              ? governorates?.map(value => {
                  return {value, label: value};
                })
              : governoratesEn?.map(value => {
                  return {value, label: value};
                })
          }
          onChange={item => {
            setHomeGov(item);
            setHomeArea('');
          }}
          textColor={getTextColor(homeGov)}
        />
      </View>
    );
  };

  const listAreas = areaType => {
    if (areaType[`${homeGov}`]) {
      const cities = areaType[`${homeGov}`]?.map((item: any) => ({
        label: item,
        value: item,
      }));
      return cities;
    }
    return [];
  };

  const renderHomeArea = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('AREA')}
          placeholder={translate('WHATS_YOUR_HOME_AREA').replace('"', "'")}
          value={homeArea}
          data={I18nManager.isRTL ? listAreas(areas) : listAreas(areasEn)}
          onChange={item => setHomeArea(item)}
          disabled={!homeGov}
          textColor={getTextColor(homeArea)}
        />
      </View>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader removeCapitalization shapeVariant="tangelo">
        <ContinueLater fromScreen="personalData" />

        <PageTitle title={translate('REVIEW_YOUR_DETAILS')} />

        {renderPersonalDataInfo(
          translate('NAME'),
          name !== `${first_name} ${full_name}`,
          name,
          enableEdit,
          setName,
        )}

        {renderPersonalDataInfo(
          translate('NATIONAL_ID_PLACEHOLDER'),
          false,
          nationalId,
          false,
          null,
        )}

        {renderPersonalDataInfo(
          translate('ADDRESS'),
          address !== street,
          address,
          enableEdit,
          setAddress,
        )}

        {renderPersonalDataInfo(
          translate('ADDITIONAL_ADDRESS'),
          false,
          additionalAddress,
          editAdditionAddress,
          setAdditionalAddress,
        )}

        {renderMaritalStatus()}

        {renderHomeGov()}

        {renderHomeArea()}

        {isLoading && <DefaultOverLayLoading message={'PLEASE_WAIT'} />}

        <BottomContainer>
          {!enableEdit && renderEditButtons()}

          {enableEdit && renderConfirmEditButtons()}
        </BottomContainer>
      </ScrollContainerWithNavHeader>
    </>
  );
};
