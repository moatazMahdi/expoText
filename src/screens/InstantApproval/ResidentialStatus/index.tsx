import React, {useEffect, useState} from 'react';
import {I18nManager, Pressable, View, Text} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {ContinueButton, PageTitle} from 'components';
import SvgView from 'src/components/SvgView';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import {
  residentialStatuses,
  residentialStatusesEn,
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

const residentialStatusesIcons = [
  creditech.ownerResStatus,
  creditech.familyHouseResStatus,
  creditech.rentingResStatus,
];

export const ResidentialStatus: React.FC = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
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

  const [residentialStatus, setResidentialStatus] = useState([]);
  const [selectedResidentialStatus, setSelectedResidentialStatus] =
    useState('');
  const [formValid, setFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const residentialStatusesTitles = [
    translate('FULLY_OWNED'),
    translate('FAMILY_HOUSE'),
    translate('RENTED'),
  ];

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'residential_status_continue',
        type: 'STATUS',
        parameters: {
          residential_status: selectedResidentialStatus ?? '',
        },
      },
      stores,
    );
    const progress = {
      name: 'clientDependencies',
      params: {
        nationalId,
        categoriesData,
        selfiePic,
        residentialStatus: selectedResidentialStatus,
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

  const onContinuePressed = () => {
    formValid ? navigateToNextScreen() : null;
  };

  const setResidentialStatusArrayData = () => {
    let newResidentialStatusArray = [];
    if (I18nManager.isRTL) {
      residentialStatuses?.map((item, index) => {
        newResidentialStatusArray.push({
          id: index,
          label: residentialStatusesTitles[index],
          value: item,
          statusIcon: residentialStatusesIcons[index],
          selected: false,
        });
      });
    } else {
      residentialStatusesEn?.map((item, index) => {
        newResidentialStatusArray.push({
          id: index,
          label: residentialStatusesTitles[index],
          value: item,
          statusIcon: residentialStatusesIcons[index],
          selected: false,
        });
      });
    }
    setResidentialStatus(newResidentialStatusArray);
  };

  useEffect(() => {
    setResidentialStatusArrayData();
  }, []);

  useEffect(() => {
    if (selectedResidentialStatus !== '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [residentialStatus]);

  const onCardSelected = (selectedItem: any) => {
    ApplicationAnalytics(
      {eventKey: 'residential_status_chosen_status', type: 'STATUS'},
      stores,
    );
    setResidentialStatus(
      residentialStatus?.map((item: any) => {
        return {
          ...item,
          selected: item.id === selectedItem.id ? true : false,
        };
      }),
    );
    setSelectedResidentialStatus(selectedItem.value);
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

  const renderResidentialStatusList = () => (
    <View style={{alignItems: 'center'}}>
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          numColumns: 2,

          data: residentialStatus ? residentialStatus : [],
          renderItem: renderCard,
          contentContainerStyle: {
            alignItems: 'flex-start',
            paddingBottom: 20,
            paddingHorizontal: 20,
          },
        }}
      />
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        hideBack
        removeCapitalization
        shapeVariant="tangelo"
        showLogo>
        <ContinueLater fromScreen="residentialStatus" />
        <PageTitle
          title={translate('WHATS_YOU_RESIDENTIAL_STATUS').replace('"', "'")}
        />

        {renderResidentialStatusList()}

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
