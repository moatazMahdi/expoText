import React, {useState, useEffect} from 'react';
import {View, Alert, Keyboard, ImageBackground} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import DropShadow from 'react-native-drop-shadow';
import {ContinueButton, PageTitle} from 'components';
import {getNidOCR} from 'utils';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {NIDConfirmModel} from 'src/screens/InstantApproval/scanDocs/NIDConfirmModel';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {
  checkDateValidity,
  saveInstantApprovalProgress,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {ContinueLater} from 'src/components/ContinueLater';
import SvgView from 'src/components/SvgView';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import DefaultButton from 'src/components/DefaultButton';
import {useRoute} from '@react-navigation/native';

const {
  images: {
    screens: {creditech, instantApproval},
  },
} = Assets;

export const ScanNID: React.FC = () => {
  /* Hooks */
  const stores = useStores();
  const {referralType, referralCode, hasPromoCode} =
    (useRoute()?.params as any) || {};
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  /* States */
  const [completeForm, setCompleteForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openNIDConfirmModel, setOpenNIDConfirmModel] =
    useState<boolean>(false);
  const [handWrittenNID, setHandWrittenNID] = useState<string>('');
  const staticCategories = [
    {
      id: 0,
      completed: false,
      title: translate('NID'),
      optional: false,
      message: translate('NID_MSG'),
      captureCardsMsg: translate('NID_CARDS_MSG'),
      frontCard: instantApproval.NIDFront,
      backCard: instantApproval.NIDBack,
      data: [
        {id: 1, photo: null, SYNAPS_id: '1', data: null},
        {id: 2, photo: null, SYNAPS_id: '3', data: null},
      ],
    },
  ];
  const [categories, setCategories] = useState([...staticCategories]);
  /* Declaration */
  let ocr_NID = categories[0].data[0].data?.national_id || '';
  // let ocr_NID_back = categories[0].data[1].data?.national_id || '';

  useEffect(() => {
    // When NID Pics Taken Set Form to be valid
    if (
      categories[0].data[0]?.photo?.uri &&
      categories[0].data[1]?.photo?.uri
    ) {
      if (categories[0].completed === false) {
        setCategories(categories => {
          let newCategories = [...categories];
          // Set NID Category as completed
          newCategories[0].completed = true;
          return newCategories;
        });
      }
      if (
        !isNaN(Number(handWrittenNID)) &&
        isFinite(+handWrittenNID) &&
        handWrittenNID.length === 14
      ) {
        setCompleteForm(true);
      } else {
        setCompleteForm(false);
      }
    } else {
      setCompleteForm(false);
    }
  }, [categories, handWrittenNID]);

  const navigateToNextScreen = async () => {
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'scan_nid_continue',
        type: 'CTA',
        parameters: {
          userInputNationalId: handWrittenNID ?? '',
          ocrNationalId: ocr_NID ?? '',
        },
      },
      stores,
    );
    const progress = {
      name: 'selfie',
      params: {
        userInputNationalId: handWrittenNID,
        nationalId: ocr_NID,
        categoriesData: categories?.flatMap(item => item.data),
        referralType,
        referralCode,
        hasPromoCode,
      },
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    ApplicationAnalytics(
      {eventKey: 'successfulNIDStep', type: 'STATUS'},
      stores,
    );
    setIsLoading(false);
    navigation.navigate(progress);
  };

  // Document Not Clear Alert
  const docNotClear = arr => {
    Alert.alert(translate('ERROR'), translate('SCANNED_DOC_NOT_CLEAR'), [
      {
        text: translate('GENERIC_CONFIRM'),
        onPress: () => {
          let newCategories = [...categories];
          arr?.forEach(item => {
            // Set NID Category as not completed
            newCategories[item.cat].completed = false;
            newCategories[item.cat].data = staticCategories[item.cat].data;
          });
          setCategories([...newCategories]);
          setCompleteForm(false);
        },
      },
    ]);
  };

  // Handles Scanned NID Results
  const handleScannedNID = async () => {
    /* Should Check for National ID then navigate to the next screen */
    // console.log('8- cat is synced', categories);
    ocr_NID = categories[0].data[0].data?.national_id || '';
    // console.log(ocr_NID, ocr_NID.length === 14, !`${ocr_NID}`?.includes(' '));
    if (ocr_NID && ocr_NID.length === 14 && !`${ocr_NID}`?.includes(' ')) {
      // console.log('9- ocr_NID extracted', ocr_NID);
      // OCR National ID is valid NOW
      // we need to check if it is in the database or not
      const popAlert = (bodyTxt, onPress = null) => {
        Alert.alert(
          translate('DEAR_CLIENT'),
          translate(bodyTxt).replace('"', "'"),
          [{text: translate('GENERIC_CONFIRM'), onPress}],
        );
      };
      // console.log('before check date validaty', categories[0].data[1].data);
      if (checkDateValidity(categories[0].data[1].data)) {
        // console.log('after check date validaty', categories[0].data[1].data);
        if (ocr_NID === handWrittenNID) {
          // console.log('10 - ocr_NID == handWrittenNID');
          try {
            const user = stores.backend.users.userData;
            const result =
              await stores.backend.instantApproval.validateNationalIdExistence(
                ocr_NID,
                user?.phone,
              );
            // console.log('11 -result', result);

            if (result?.clientStatus) {
              setIsLoading(false);
              popAlert('ALREADY_HAVE_SHOPPING_LIMIT_DIFF_MOB');
            } else {
              const {
                lowIscore,
                nationalId: status,
                mobile,
                limit,
                isWaiting,
              } = result;
              setTimeout(() => {
                if (lowIscore) {
                  setIsLoading(false);
                  popAlert('LOW_ISCORE');
                } else if (status === false && mobile === false) {
                  // console.log('12- status === false && mobile === false ');
                  // in case user is not registered in instant approval system
                  navigateToNextScreen();
                } else if (status === false && mobile === true) {
                  setIsLoading(false);
                  popAlert('MOB_NUM_HAS_SHOPPING_LIMIT');
                } else if (status === true && mobile === false) {
                  setIsLoading(false);
                  popAlert('ALREADY_HAVE_SHOPPING_LIMIT_DIFF_MOB');
                } else if (status === true && mobile === true) {
                  if (isWaiting) {
                    setIsLoading(false);
                    popAlert('REQUEST_IN_PROGRESS');
                  } else if (limit === 0) {
                    setIsLoading(false);
                    popAlert('REQUEST_NOT_APPROVED');
                  } else {
                    setIsLoading(false);
                    popAlert('ALREADY_HAVE_SHOPPING_LIMIT'); // Should go to credit manage screen to add his national id after this
                  }
                } else {
                  setIsLoading(false);
                  popAlert('TRY_AGAIN');
                }
              }, 1000);
            }
          } catch ({response}) {
            setIsLoading(false);
            await stores.backend.instantApproval.saveErrors({
              config: response.config,
              data: response.data,
            });
            popAlert('TRY_AGAIN');
          }
        } else {
          // IF OCR_NID != handWrittenNID
          setIsLoading(false);
          // console.log('ocr_NID!= handWrittenNID');
          setOpenNIDConfirmModel(true);
        }
      } else {
        setIsLoading(false);
        popAlert('NIDExpired');
      }
    } else {
      // console.log("don't clear at handeled scan ");
      setIsLoading(false);
      docNotClear([{cat: 0, catData: 0}]);
    }
  };

  // First Send Photos to Synapse OCR To get Results
  const submitPhotos = async () => {
    if (completeForm) {
      // console.log('1- submit photos is called ');
      try {
        setIsLoading(true);
        // console.log('try entered!!', isLoading);
        // console.log('2- upload selfie successful ', isLoading);

        const token = stores.backend.auth.getAccessToken();
        let newCategories = [...categories];
        // console.log('3- called before ocr api ', isLoading);

        if (categories[0].completed) {
          let ocrResult = await getNidOCR({
            token,
            fileType: 'image/jpeg',
            frontNIDId:
              categories[0].data[0].id.toString() + '_' + handWrittenNID,
            backNIDId:
              categories[0].data[1].id.toString() + '_' + handWrittenNID,
            frontPhotoURI: categories[0].data[0].photo?.uri,
            backPhotoURI: categories[0].data[1].photo?.uri,
          });
          // console.log('4- called after ocr api ', isLoading);
          // console.log('5- ocr result is ', ocrResult);

          newCategories[0].data[0].data = ocrResult?.front_side?.data;
          // console.log(
          //   'newCategories[0].data[0].data is ',
          //   newCategories[0].data[0].data,
          // );

          newCategories[0].data[1].data = ocrResult?.back_side?.data;
          // console.log(
          //   'newCategories[0].data[1].data is ',
          //   newCategories[0].data[1].data,
          // );

          setCategories([...newCategories]);
          // console.log('6- called before handled scanned nid ', isLoading);

          // Pass the selfieLink to handleScannedNID
          await handleScannedNID();
          // console.log('- called after handled scanned nid ', isLoading);
        }
      } catch (error) {
        setIsLoading(false);
        // console.log('submit error is ', error);
        docNotClear([{cat: 0, catData: 0}]);
      }
    }
  };
  // On Confirm ocr_NID_frontHandle The New ocr_NID_frontand Check The System
  const onConfirmNIDConfirmModel = async () => {
    await Keyboard.dismiss();
    setOpenNIDConfirmModel(false);
    setIsLoading(true);
    const popAlert = (bodyTxt, onPress = null) => {
      Alert.alert(
        translate('DEAR_CLIENT'),
        translate(bodyTxt).replace('"', "'"),
        [{text: translate('GENERIC_CONFIRM'), onPress}],
      );
    };
    try {
      setIsLoading(true);
      const user = stores.backend.users.userData;
      const result =
        await stores.backend.instantApproval.validateNationalIdExistence(
          ocr_NID,
          user?.phone,
        );
      const {lowIscore, nationalId: status, mobile, limit, isWaiting} = result;
      setTimeout(() => {
        if (lowIscore) {
          setIsLoading(false);
          popAlert('LOW_ISCORE');
        } else if (status === false && mobile === false) {
          navigateToNextScreen();
        } else if (status === false && mobile === true) {
          setIsLoading(false);
          popAlert('MOB_NUM_HAS_SHOPPING_LIMIT');
        } else if (status === true && mobile === false) {
          setIsLoading(false);
          popAlert('ALREADY_HAVE_SHOPPING_LIMIT_DIFF_MOB');
        } else if (status === true && mobile === true) {
          if (isWaiting) {
            setIsLoading(false);
            popAlert('REQUEST_IN_PROGRESS');
          } else if (limit === 0) {
            setIsLoading(false);
            popAlert('REQUEST_NOT_APPROVED');
          } else {
            setIsLoading(false);
            popAlert('ALREADY_HAVE_SHOPPING_LIMIT');
          }
        } else {
          setIsLoading(false);
          popAlert('TRY_AGAIN');
        }
      }, 1000);
    } catch ({response}) {
      setIsLoading(false);
      await stores.backend.instantApproval.saveErrors({
        config: response.config,
        data: response.data,
      });
      popAlert('TRY_AGAIN');
    }
  };

  // On Photos Picked in Camera Screen
  const setPhoto = (data, url, index) => {
    let newCategories = [];
    setCategories(categories => {
      newCategories = [...categories];
      newCategories[0].data[index].photo = {
        ...data,
        uri: url?.uri,
      };
      return newCategories;
    });
  };

  // Navigate To Camera and Set The Photo
  const onScanDoc = async (index, title) => {
    navigation.navigate('camera', {
      category: categories[0],
      categoryDataId: index,
      setCategories: setPhoto,
      title: title,
    });
  };

  // Modal Closed
  const onCloseNIDConfirmModel = async () => {
    await Keyboard.dismiss();
    setCategories([...staticCategories]);
    setOpenNIDConfirmModel(false);
  };

  // Validate Written NID
  const validateNID = NID => {
    if (/^[0-9]+$/.test(NID) || NID.length === 0) {
      setHandWrittenNID(NID);
    }
  };

  const renderNIDWritten = () => {
    return (
      <DefaultTextInput
        title={translate('NATIONAL_ID')}
        value={handWrittenNID}
        placeholder={translate('WRITE_ID_FIRST')}
        onchangeText={text => validateNID(text)}
        keyboardType="numeric"
      />
    );
  };

  const renderNIDCard = ({cardImage, cardText, index}) => {
    const photoPicked = categories[0].data[index]?.photo?.uri ? true : false;

    if (photoPicked) {
      let analyticsName = index === 0 ? 'c_scan_nid_front' : 'c_scan_nid_back';
      ApplicationAnalytics({eventKey: analyticsName, type: 'CTA'}, stores);
      return (
        <DropShadow style={selectStyle('shadowBox')}>
          <ImageBackground
            imageStyle={selectStyle('NIDCardContainerScanned')}
            style={selectStyle('NIDCardContainerScanned')}
            source={{uri: categories[0].data[index]?.photo?.uri}}>
            <DefaultButton
              variant="secondaryBackground"
              width={297}
              onPress={() => onScanDoc(index, cardText)}
              title={translate('RESCAN_IMAGE')}
              mt={100}
            />
          </ImageBackground>
        </DropShadow>
      );
    }
    return (
      <DropShadow style={selectStyle('shadowBox')}>
        <View style={selectStyle('NIDCardContainer')}>
          <View style={selectStyle('NIDCardImageContainer')}>
            <SvgView svgFile={cardImage} />
          </View>
          <Typography customStyles={() => ({text: selectStyle('NIDCardText')})}>
            {cardText}
          </Typography>

          <DefaultButton
            variant="secondaryBackground"
            width={297}
            onPress={() => onScanDoc(index)}
            title={translate('SCAN')}
          />
        </View>
      </DropShadow>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader
        hideBack
        shapeVariant="orange"
        showLogo
        removeCapitalization>
        <ContinueLater fromScreen="scanNID" />
        <PageTitle title={translate('FIRST_WE_NEED_ID')} />

        {renderNIDWritten()}

        {renderNIDCard({
          cardImage: creditech.NIDFrontEmpty,
          cardText: translate('FRONT_ID'),
          index: 0,
        })}

        {renderNIDCard({
          cardImage: creditech.NIDBackEmpty,
          cardText: translate('BACK_ID'),
          index: 1,
        })}
        <NIDConfirmModel
          isOpen={openNIDConfirmModel && !isLoading}
          nationalId={handWrittenNID}
          ocr_NID={ocr_NID}
          onCancel={onCloseNIDConfirmModel}
          onConfirm={onConfirmNIDConfirmModel}
        />
        {!isLoading && !openNIDConfirmModel && (
          <ContinueButton
            back
            onContinuePressed={submitPhotos}
            completeForm={completeForm}
            loading={isLoading}
            containerStyle={selectStyle('continueContainerButton')}
          />
        )}
      </ScrollContainerWithNavHeader>
      {isLoading && (
        <DefaultOverLayLoading
          message={
            translate('PLEASE_WAIT') +
            ` ${tempTranslate(
              'This can take a while',
              'سوف يأخذ هذا بعض الوقت',
            )}`
          }
        />
      )}
    </>
  );
};
