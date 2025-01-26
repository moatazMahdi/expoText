import React, {useEffect, useState} from 'react';
import {I18nManager, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {ContinueLater} from 'src/components/ContinueLater';
import DefaultDropdown from 'src/components/DefaultDropdown';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {ContinueButton, PageTitle} from 'components';
import {hp} from 'src/utils/Dimensions/dimen';
import MapModal from 'src/components/MapModal';
import {
  employmentSectors,
  employmentSectorsEn,
  governorates,
  governoratesEn,
  areas,
  areasEn,
} from '../../InstantApproval/clientInfo/data';
import {
  getTextColor,
  saveInstantApprovalProgress,
} from 'src/utils/HelpersFunctions';
import styles from './styles';

export const CompanyDetails: React.FC = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
    dependencies,
    refContact,
    employmentStatus,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySector, setCompanySector] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyArea, setCompanyArea] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyGov, setCompanyGov] = useState('');

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const spaceBetween = {marginBottom: hp(20)};

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'locate_company_proceed',
        type: 'CTA',
        parameters: {
          companyName: companyName ?? '',
          companyAddress: companyAddress ?? '',
          companySector: companySector ?? '',
          companyGov: companyGov ?? '',
          companyArea: companyArea ?? '',
        },
      },
      stores,
    );

    const progress = {
      name: 'jobInfo',
      params: {
        nationalId,
        categoriesData,
        selfiePic,
        dependencies,
        refContact,
        employmentStatus,
        companyDetails: {
          companyName,
          companyAddress,
          companySector,
          companyGov,
          companyArea,
        },
        residentialStatus,
        userInputNationalId,
        personalDetails,
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

  useEffect(() => {
    if (
      companyName?.trim() !== '' &&
      companyAddress?.trim() !== '' &&
      /\S/.test(companyAddress) !== false &&
      companySector?.trim() !== '' &&
      companyGov?.trim() !== '' &&
      companyArea?.trim() !== ''
    ) {
      setFormValid(true);
    } else setFormValid(false);
  }, [companyName, companyAddress, companySector, companyGov, companyArea]);

  const renderEmploymentStatusDescription = () => {
    return (
      <View style={selectStyle('employmentStatusDescriptionContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('employmentStatusDescription'),
          })}>
          {translate('WHATS_JOB_COMPANY')}
        </Typography>
      </View>
    );
  };

  const renderCompanyName = () => {
    return (
      <DefaultTextInput
        title={translate('WHERE_DO_YOU_WORK')}
        value={companyName}
        placeholder={translate('WHERE_DO_YOU_WORK')}
        onchangeText={text => setCompanyName(text)}
        inputContainer={spaceBetween}
      />
    );
  };

  const renderCompanyAddress = () => {
    return (
      // <Pressable onPress={() => setIsModalVisible(true)}>
      // <View pointerEvents="none">
      <DefaultTextInput
        title={translate('WHERE_COMPANY')}
        // editable={false}
        value={companyAddress}
        placeholder={translate('WHERE_COMPANY')}
        onchangeText={text => setCompanyAddress(text)}
        inputContainer={spaceBetween}
      />
      // </View>
      // </Pressable>
    );
  };

  const listEmploymentSectorData = () => {
    if (I18nManager.isRTL) {
      const sectors = employmentSectors[employmentStatus]?.map(item => ({
        label: item,
        value: item,
      }));
      return sectors;
    } else {
      const sectors = employmentSectorsEn[employmentStatus]?.map(item => ({
        label: item,
        value: item,
      }));
      return sectors;
    }
  };

  const renderCompanySector = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('WHATS_COMPANY_SECTOR').replace('"', "'")}
          data={listEmploymentSectorData()}
          value={companySector}
          onChange={item => setCompanySector(item)}
          textColor={getTextColor(companySector)}
        />
      </View>
    );
  };

  const renderCompanyGov = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('WHATS_COMPANY_GOVERNORATE').replace('"', "'")}
          data={
            I18nManager.isRTL
              ? governorates?.map(value => {
                  return {value, label: value};
                })
              : governoratesEn?.map(value => {
                  return {value, label: value};
                })
          }
          value={companyGov}
          onChange={item => {
            setCompanyGov(item);
            setCompanyArea('');
          }}
          textColor={getTextColor(companyGov)}
        />
      </View>
    );
  };

  const listAreas = areaType => {
    if (areaType[`${companyGov}`]) {
      const cities = areaType[`${companyGov}`]?.map((item: any) => ({
        label: item,
        value: item,
      }));
      return cities;
    }
    return [];
  };

  const renderCompanyArea = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('WHATS_COMPANY_AREA').replace('"', "'")}
          data={I18nManager.isRTL ? listAreas(areas) : listAreas(areasEn)}
          value={companyArea}
          onChange={item => setCompanyArea(item)}
          disabled={!companyGov}
          textColor={getTextColor(companyArea)}
        />
      </View>
    );
  };

  const confirmLocation = (coords, locationName) => {
    setCompanyAddress(locationName);
  };

  return (
    <ScrollContainerWithNavHeader
      showLogo
      hideBack
      shapeVariant="tangelo"
      removeCapitalization>
      <ContinueLater fromScreen="companyDetails" />

      <PageTitle title={translate('EMPLOYMENT_DETAILS')} />

      {renderEmploymentStatusDescription()}

      <KeyboardAwareScrollView style={selectStyle('mainContainer')}>
        {renderCompanyName()}

        {renderCompanySector()}

        {renderCompanyAddress()}

        {renderCompanyGov()}

        {renderCompanyArea()}
      </KeyboardAwareScrollView>

      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}

      <ContinueButton
        back
        onContinuePressed={() => formValid && navigateToNextScreen()}
        completeForm={formValid}
      />

      <MapModal
        modalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        confirmLocation={confirmLocation}
      />
    </ScrollContainerWithNavHeader>
  );
};
