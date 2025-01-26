import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Pressable,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Alert,
  Image,
} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {ContinueButton, PageTitle} from 'components';
import SvgView from 'src/components/SvgView';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import {saveInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import {getOCR} from 'utils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import deviceInfoModule from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';

const {
  images: {
    screens: {creditech, instantApproval},
  },
} = Assets;

export const AdditionalDocs: React.FC = () => {
  const stores = useStores();
  const navigation = useNavigationUtils();

  const {
    nationalId,
    categoriesData,
    selfiePic,
    dependencies,
    refContact,
    employmentStatus,
    companyDetails,
    salary,
    jobTitle,
    workExperience,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};
  const {translate} = useLocalization();
  const {selectStyle} = useStyles(styles);

  const AdditionalDocsCategories = [
    {
      id: 1,
      completed: false,
      title: translate('CAR_LICENSE'),
      optional: true,
      message: translate('CAR_LICENSE_MSG'),
      captureCardsMsg: translate('CAR_LICENSE_CARDS_MSG'),
      frontCard: instantApproval.DLicenseFront,
      backCard: instantApproval.DLicenseBack,
      icon: creditech.carLicense,
      data: [
        {id: 3, photo: null, SYNAPS_id: 2, data: null},
        {id: 4, photo: null, SYNAPS_id: 4, data: null},
      ],
    },
    {
      id: 2,
      completed: false,
      title: translate('CLUB_ID'),
      optional: true,
      message: translate('CLUB_ID_MSG'),
      captureCardsMsg: translate('MAKE_INFO_CLEAR'),
      frontCard: instantApproval.ClubCard,
      backCard: null,
      icon: creditech.clubId,
      data: [{id: 5, photo: null, SYNAPS_id: 123, data: null}],
    },
    {
      id: 3,
      completed: false,
      title: translate('INSURANCE_ID'),
      optional: true,
      message: translate('INSURANCE_ID_MSG'),
      captureCardsMsg: translate('MAKE_INFO_CLEAR'),
      frontCard: instantApproval.InsuranceCard,
      backCard: null,
      icon: creditech.insuranceCards,
      data: [{id: 6, photo: null, SYNAPS_id: 124, data: null}],
    },
  ];

  const [additionalDocs, setAdditionalDocs] = useState(
    AdditionalDocsCategories,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      location => {
        const {latitude, longitude} = location.coords;
        setLat(latitude.toString());
        setLong(longitude.toString());
      },
      err => {
        console.log(err);
      },
      {timeout: 20000, enableHighAccuracy: true, maximumAge: 1000},
    );
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ])
        .then(granted => {
          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
          ) {
            getLocation();
          } else {
            console.log('Permission not granted');
          }
        })
        .catch(err => {
          console.log('error: ', err);
        });
    } else {
      const result = await Geolocation.requestAuthorization('always');
      if (result === 'granted') {
        getLocation();
      } else {
        // Linking.openURL('app-settings:');
      }
    }
  };

  const submitToInstantApproval = async () => {
    // flat categories first
    const newAdditionalDocs = additionalDocs?.flatMap(item => item.data);
    const newocrData = [...categoriesData, ...newAdditionalDocs];
    let ocrData: {Results: any}[] = [];
    newocrData?.forEach(item => {
      if (item.data) {
        ocrData.push({Results: {...item.data}});
      }
    });

    const calcCreditObj = {
      userInputNationalId,
      nationalId,
      selfiePic,
      ocrData,
      referralObj: {referralType, referralCode, hasPromoCode},
      ClientInfo: {
        homeAddress: personalDetails?.address || '',
        homeGov: personalDetails?.homeGov || '',
        homeArea: personalDetails?.homeArea || '',
        additionalAddress: personalDetails?.additionalAddress || '',
        maritalStatus: personalDetails?.maritalStatus || '',
        residentStatus: residentialStatus || '',
        dependentsNum: dependencies || '',
        refContactName: refContact?.name || '',
        refContactNum: refContact?.selectedPhone?.number || '01001234567',
      },
      EmploymentDetails: {
        companyName: companyDetails?.companyName,
        workAddress: companyDetails?.companyAddress,
        workGov: companyDetails?.companyGov,
        workArea: companyDetails?.companyArea,
        employmentStatus: employmentStatus,
        employmentSector: companyDetails?.companySector,
        jobTitle: jobTitle,
        currentWorkYears: workExperience,
        appMonthlyIncome: +salary,
        requestedLimit: 50000, // Static for now
      },
      Boosters: {
        deviceType: deviceInfoModule.getBrand(),
        Location: {lat, long},
      },
      bulkFile: false,
    };
    await stores.backend.instantApproval
      .calculateCredit(calcCreditObj)
      .then(async res => {
        setIsLoading(false);
        // analytics().logEvent('instant_approval_limit', { name: res });
        // navigation.resetTo({ name: 'creditResult', params: { userCredit: res } });
        navigateToNextScreen(res);
      })
      .catch(async ({response}) => {
        setIsLoading(false);
        await stores.backend.instantApproval.saveErrors({
          config: response.config,
          data: response.data,
        });
        // analytics().logEvent('instant_approval_failure', { name: response.data.message });
        Alert.alert(
          translate('DEAR_CLIENT'),
          response.data.translatedMessage
            ? I18nManager.isRTL
              ? response.data.translatedMessage.ar
              : response.data.translatedMessage.en
            : translate('TRY_AGAIN'),
          [{text: translate('GENERIC_CONFIRM')}],
        );
      });
  };

  const submitPhotos = async () => {
    setIsLoading(true);
    if (!additionalDocs[0].data[0].data) {
      try {
        const token = stores.backend.auth.getAccessToken();
        let promises = [];
        let newCategories = [...additionalDocs];
        for (let i in additionalDocs) {
          if (additionalDocs[i].completed) {
            for (let j in additionalDocs[i].data) {
              if (additionalDocs[i]?.data[j]?.photo) {
                let promise = new Promise(async resolve => {
                  let ocrResult = await getOCR({
                    token,
                    fileType: 'image/jpeg',
                    id:
                      additionalDocs[i].data[j].id.toString() +
                      '_' +
                      nationalId,
                    photoURI: additionalDocs[i].data[j].photo?.uri.uri,
                    SYNAPS_id: additionalDocs[i].data[j].SYNAPS_id,
                  });
                  newCategories[i].data[j].data = ocrResult?.Results;
                  resolve(
                    ocrResult ? true : {cat: Number(i), catData: Number(j)},
                  );
                });
                promises.push(promise);
              }
            }
          }
        }
        Promise.all(promises).then(async () => {
          await setAdditionalDocs([...newCategories]);
          await submitToInstantApproval(); // Proceed with submission
        });
      } catch (error) {
        console.error('Error in submitPhotos:', error);
        setIsLoading(false);
      }
    } else {
      await submitToInstantApproval(); // Proceed if data already exists
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onContinuePressed = () => {
    submitPhotos();
  };

  const logAnalytics = () => {
    ApplicationAnalytics(
      {
        eventKey: 'almost_there_continue',
        type: 'CTA',
        parameters: {
          carLicense: AdditionalDocsCategories[0]?.data[0]?.data && true,
          clubId: AdditionalDocsCategories[1]?.data[0]?.data && true,
          insuranceId: AdditionalDocsCategories[2]?.data[0]?.data && true,
        },
      },
      stores,
    );
  };

  const navigateToNextScreen = async res => {
    // setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    logAnalytics();
    const progress = {
      name: 'congratulations',
      params: {res, refContact, hasPromoCode, additionalDocs},
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate(progress);
    setIsLoading(false);
  };

  const renderAddtionalDocsDescription = () => {
    return (
      <View style={selectStyle('renderAddtionalDocsDescriptionContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('addtionalDocsDescription'),
          })}>
          {translate('INCREASE_CREDIT_CHANCE')}
        </Typography>
      </View>
    );
  };

  const onCardSelected = (selectedItem: any) => {
    ApplicationAnalytics(
      {
        eventKey: 'almost_there_chosen_document_to_upload',
        type: 'CTA',
        parameters: {
          document: additionalDocs[selectedItem]?.title,
        },
      },
      stores,
    );
    navigation.navigate('captureCards', {
      category: additionalDocs[selectedItem],
      setCategories: setAdditionalDocs,
    });
  };

  const renderCard = ({item, index}) => {
    return (
      <DropShadowWrapper m={5}>
        <Pressable
          style={
            item.completed
              ? selectStyle('selectedCardContainer')
              : selectStyle('cardContainer')
          } // selectStyle('selectedCardContainer')
          onPress={() => onCardSelected(index)}>
          <SvgView
            svgFile={item.icon}
            width={75}
            height={50}
            style={{alignSelf: 'flex-start'}}
          />
          <Text style={selectStyle('cardLabel')}>{item.title}</Text>
        </Pressable>
      </DropShadowWrapper>
    );
  };

  const renderAdditionalDocsImage = () => {
    return (
      <Image
        resizeMode="contain"
        source={creditech.instantAlmostFinish}
        style={selectStyle('imageStyle')}
      />
    );
  };

  const renderAddtionalDocsList = () => {
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          numColumns: 2,
          data: additionalDocs ? additionalDocs : [],
          renderItem: renderCard,
        }}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        shapeVariant="tangelo"
        hideBack
        showLogo
        removeCapitalization>
        <ContinueLater fromScreen="additionalDocs" />
        <PageTitle title={translate('ONE_STEP_AWAY')} />
        {renderAdditionalDocsImage()}
        {renderAddtionalDocsDescription()}
        {renderAddtionalDocsList()}

        <ContinueButton
          back
          onContinuePressed={onContinuePressed}
          completeForm={true}
          containerStyle={selectStyle('continueButton')}
        />
      </ScrollContainerWithNavHeader>
      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </View>
  );
};
