import React, {useEffect, useState} from 'react';
import {I18nManager, Pressable, View, Text} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {ContinueButton, PageTitle} from 'components';
import SvgView from 'src/components/SvgView';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import {
  employmentStatuses,
  employmentStatusesEn,
} from 'src/screens/InstantApproval/clientInfo/data';
import {saveInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

const employmentStatusesIcons = [
  creditech.salariedEmployee,
  creditech.businessOwner,
  creditech.freelancer,
  creditech.lookingForJob,
];

export const EmploymentStatus: React.FC = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
    dependencies,
    refContact,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};

  const stores = useStores();
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const employmentStatusesLabel = [
    translate('SALARIED_EMPLOYEE'),
    translate('SELF_EMPLOYED'),
    translate('FREE_LANCER'),
    translate('UNEMPLOYED'),
  ];
  const [employmentStatus, setEmploymentStatus] = useState([]);
  const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    if (
      selectedEmploymentStatus !== 'Unemployed' &&
      selectedEmploymentStatus !== 'بدون عمل'
    ) {
      // Save Progress First Before Navigating to Next Screen
      ApplicationAnalytics(
        {
          eventKey: 'employment_details_continue',
          type: 'CTA',
          parameters: {
            selectedEmploymentStatus: selectedEmploymentStatus ?? '',
          },
        },
        stores,
      );

      const progress = {
        name: 'companyDetails',
        params: {
          nationalId,
          categoriesData,
          selfiePic,
          dependencies,
          refContact,
          employmentStatus: selectedEmploymentStatus,
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
    } else {
      ApplicationAnalytics(
        {
          eventKey: 'employment_details_continue',
          type: 'CTA',
          parameters: {
            selectedEmploymentStatus: selectedEmploymentStatus ?? '',
          },
        },
        stores,
      );
      const progress = {
        name: 'noCreditApproval',
        params: {
          nationalId,
          categoriesData,
          selfiePic,
          dependencies,
          refContact,
          employmentStatus: selectedEmploymentStatus,
          residentialStatus,
          userInputNationalId,
          personalDetails,
        },
      };
      await saveInstantApprovalProgress(progress);
      // Navigate to Next Screen
      navigation.navigate(progress);
    }
    setIsLoading(false);
  };

  const onContinuePressed = () => {
    formValid ? navigateToNextScreen() : null;
  };

  const setEmploymentStatusArrayData = () => {
    let newEmploymentStatusArray = [];
    if (I18nManager.isRTL) {
      employmentStatuses?.map((item, index) => {
        newEmploymentStatusArray.push({
          id: index,
          label: employmentStatusesLabel[index],
          value: item,
          statusIcon: employmentStatusesIcons[index],
          selected: false,
        });
      });
    } else {
      employmentStatusesEn?.map((item, index) => {
        newEmploymentStatusArray.push({
          id: index,
          label: employmentStatusesLabel[index],
          value: item,
          statusIcon: employmentStatusesIcons[index],
          selected: false,
        });
      });
    }
    setEmploymentStatus(newEmploymentStatusArray);
  };

  useEffect(() => {
    setEmploymentStatusArrayData();
  }, []);

  useEffect(() => {
    if (selectedEmploymentStatus !== '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [employmentStatus]);

  const renderEmploymentStatusDescription = () => {
    return (
      <View style={selectStyle('employmentStatusDescriptionContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('employmentStatusDescription'),
          })}>
          {translate('EMPLOYMENT_STATUS_2')}
        </Typography>
      </View>
    );
  };

  const onCardSelected = (selectedItem: any) => {
    setEmploymentStatus(
      employmentStatus?.map((item: any) => {
        return {
          ...item,
          selected: item.id === selectedItem.id ? true : false,
        };
      }),
    );
    ApplicationAnalytics(
      {
        eventKey: 'employment_details_employment_status',
        type: 'STATUS',
      },
      stores,
    );
    setSelectedEmploymentStatus(selectedItem.value);
  };

  const renderCard = ({item}) => {
    return (
      <DropShadowWrapper m={5}>
        <Pressable
          style={
            item.selected
              ? selectStyle('selectedCardContainer')
              : selectStyle('cardContainer')
          }
          onPress={() => onCardSelected(item)}>
          <SvgView
            svgFile={item.statusIcon}
            width={75}
            height={50}
            style={{alignSelf: 'flex-start'}}
          />
          <Text style={selectStyle('cardLabel')}>{item.label}</Text>
        </Pressable>
      </DropShadowWrapper>
    );
  };

  const renderEmploymentStatusList = () => (
    <DefaultFlatList
      isFetchingData={false}
      flatListProps={{
        numColumns: 2,
        data: employmentStatus ? employmentStatus : [],
        renderItem: renderCard,
      }}
    />
  );

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        hideBack
        shapeVariant="yellow"
        showLogo
        removeCapitalization>
        <ContinueLater fromScreen="employmentStatus" />
        <PageTitle title={translate('EMPLOYMENT_DETAILS')} />

        {renderEmploymentStatusDescription()}

        {renderEmploymentStatusList()}

        <ContinueButton
          back
          onContinuePressed={onContinuePressed}
          completeForm={formValid}
        />
      </ScrollContainerWithNavHeader>
      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </View>
  );
};
