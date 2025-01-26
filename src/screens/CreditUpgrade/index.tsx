import React, {useEffect, useState} from 'react';
import {View, Alert, Image} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {
  checkUserInstantApprovalStatus,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {uploadDocs} from 'utils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import CardWithCheckMark from 'src/components/CardWithCheckMark';
import RowView from 'src/components/Wrappers/RowView';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {baseScreen} from 'hoc';
import SvgView from 'src/components/SvgView';
import DefaultButton from 'src/components/DefaultButton';
import DefaultModal from 'src/components/DefaultModal';
import DocumentPicker from 'react-native-document-picker';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {useRoute} from '@react-navigation/native';

const {
  images: {
    screens: {creditech, instantApproval},
  },
} = Assets;

const creditUpgrade = ({route}) => {
  // const { title } = route?.params;

  const {params} = useRoute();
  const title = params?.title || '';

  const stores = useStores();

  const navigation = useNavigationUtils();

  const {translate} = useLocalization();

  const {selectStyle} = useStyles(styles);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number>();
  const [completeForm, setCompleteForm] = useState<boolean>(false);
  const [clientStatus, setClientStatus] = useState(null);

  const userData = stores.backend.users.userData;

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
        {
          id: 1,
          photo: null,
          SYNAPS_id: '1',
          data: null,
          fileType: '' || 'image/jpeg',
        },
        {
          id: 2,
          photo: null,
          SYNAPS_id: '3',
          data: null,
          fileType: '' || 'image/jpeg',
        },
        {
          id: 3,
          photo: null,
          SYNAPS_id: '1',
          data: null,
          fileType: '' || 'image/jpeg',
        },
      ],
    },
  ];

  const [categories, setCategories] = useState([...staticCategories]);
  const [toView, setToView] = useState<
    | 'creditActivated'
    | 'creditNotActivated'
    | 'noCredit'
    | 'loading'
    | null
    | string
  >(null);

  const checkInstantStatus = async () => {
    const status = await checkUserInstantApprovalStatus(stores, setToView);
    if (status !== 'creditActivated') {
      Alert.alert('', translate('MUST_HAVE_CREDIT'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (title === 'Normal') {
      ApplicationAnalytics(
        {
          eventKey: 'Normal_assessment_screen',
          type: 'CTA',
        },
        stores,
      );
    } else {
      checkInstantStatus();
    }
  }, []);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await stores.backend.instantApproval.hybridStatus(
        userData?.nationalId,
      );
      setClientStatus(data);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (title === 'Normal') {
      fetchStatus();
    }
  }, []);

  useEffect(() => {
    if (title != 'Increase limit') {
      const isPayslipApproved = clientStatus?.payslipApprove === 'Y';
      const isUtilityBillApproved = clientStatus?.utilityBillApprove === 'Y';
      const isHrLetterApproved = clientStatus?.hrLetterApprove === 'Y';

      const hasScannedPhoto = isPayslipApproved
        ? categories[0].data[0]?.photo?.uri ||
          categories[0].data[1]?.photo?.uri ||
          categories[0].data[2]?.photo?.uri
        : categories[0].data[0]?.photo?.uri &&
          (categories[0].data[1]?.photo?.uri ||
            categories[0].data[2]?.photo?.uri);

      if (
        (isPayslipApproved && (isUtilityBillApproved || isHrLetterApproved)) ||
        hasScannedPhoto
      ) {
        setCompleteForm(true);
      } else {
        setCompleteForm(false);
      }
    } else {
      if (
        categories[0].data[0]?.photo?.uri &&
        (categories[0].data[1]?.photo?.uri || categories[0].data[2]?.photo?.uri)
      ) {
        if (categories[0].completed === false) {
          setCategories(categories => {
            let newCategories = [...categories];
            newCategories[0].completed = true;
            return newCategories;
          });
        }
        setCompleteForm(true);
      } else {
        setCompleteForm(false);
      }
    }
  }, [clientStatus, categories]);

  const setPhoto = (data, uri, index) => {
    let newCategories = [];
    setCategories(categories => {
      newCategories = [...categories];
      newCategories[0].data[index].photo = {...data, uri: data?.uri};
      return newCategories;
    });
  };

  const submitPhotos = async () => {
    if (title === 'Increase limit') {
      if (!categories[0]?.data[0]?.photo?.uri) {
        Alert.alert(
          '',
          translate('PROOF_OF_ADDRESS') +
            ' ' +
            tempTranslate('required', 'مطلوب'),
        );
        return;
      } else if (
        !categories[0]?.data[1]?.photo?.uri &&
        !categories[0]?.data[2]?.photo?.uri
      ) {
        Alert.alert(
          '',
          translate('PROOF_OF_PAYMENT') +
            ' ' +
            tempTranslate('or', 'أو') +
            translate('BANK_STATEMENT') +
            ' ' +
            tempTranslate('Required', 'مطلوب'),
        );
        return;
      }
    }

    try {
      setIsLoading(true);
      const token = stores.backend.auth.getAccessToken();
      /********************************************************************************/
      let electricityBill =
        categories[0].data[0]?.photo?.uri &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[0].fileType,
          id: `${userData.id}_${new Date().getTime()}_electricityBill`, //id unique for each user photo
          photoURI: categories[0].data[0].photo.uri,
        }));
      /********************************************************************************/
      let ProofLetter =
        categories[0].data[1]?.photo?.uri &&
        categories[0].data[1].photo.uri &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[1].fileType,
          id: `${userData.id}_${new Date().getTime()}_PROOF_OF_PAYMENT`, //id unique for each user photo
          photoURI: categories[0].data[1].photo.uri,
        }));
      /********************************************************************************/
      let salaryProof =
        categories[0].data[2]?.photo?.uri &&
        categories[0].data[2].photo.uri &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[2].fileType,
          id: `${userData.id}_${new Date().getTime()}_BANK_STATEMENT`, //id unique for each user photo
          photoURI: categories[0].data[2].photo.uri,
        }));
      /********************************************************************************/
      const res =
        title === 'Normal'
          ? await stores.backend.instantApproval.hybridApply(
              userData?.nationalId,
              salaryProof,
              electricityBill,
              ProofLetter,
            )
          : await stores.backend.users.increaseLimit(
              userData?.phone,
              salaryProof,
              electricityBill,
              ProofLetter,
            );
      if (res?.status) {
        switch (res?.status) {
          case 'true':
            navigation.navigate('creditOptionalData', {
              salaryProof: salaryProof,
              electricityBill: electricityBill,
              ProofLetter: ProofLetter,
              title,
            });
            break;

          case 'false':
            Alert.alert('', translate('NO_LIMIT_UPGRADE'), [
              {text: translate('GENERIC_CONFIRM')},
            ]);
            break;

          case 'duplicated':
            Alert.alert('', translate('ALREADY_LIMIT_UPGRADED'), [
              {
                text: translate('GENERIC_CONFIRM'),
                onPress: () => navigation.navigate('home'),
              },
            ]);

            break;

          default:
            break;
        }
      }
      /********************************************************************************/
    } catch (error) {
      console.error(error);
      Alert.alert('', translate('ERROR'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onScanDoc = async (index, title) => {
    setShowModal(false);
    navigation.navigate('camera', {
      category: categories[0],
      categoryDataId: index,
      hideCameraContainer: index !== 0,
      setCategories: setPhoto,
      title: title,
      controlQuality: 0.2,
    });
  };

  const onUploadFromGallery = async (index, title) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setShowModal(false);
      const uri = res[0].uri;
      const fileType = res[0].type;

      const newPhoto = {uri: uri, fileType: fileType};
      setCategories(categories => {
        let newCategories = [...categories];
        let newCategoriesType = [...categories];
        (newCategories[0].data[index].photo = newPhoto),
          (newCategoriesType[0].data[index] = {
            fileType: fileType,
          });

        title = title;
        setPhoto(newPhoto, uri, index);
        return newCategories;
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
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

  const renderAdditionalDocsImage = () => {
    return (
      <View style={selectStyle('imageStyle')}>
        <SvgView svgFile={creditech.IncreaseLimit} width={65} height={76} />
      </View>
    );
  };
  const renderModel = () => {
    return (
      <DefaultModal
        bottom
        onCloseModal={() => setShowModal(false)}
        isVisible={showModal}
        animationInTiming={200}
        ViewContainerStyle={{backgroundColor: '#FAFAFA'}}>
        <View style={selectStyle('ModalSeparator')} />
        <CardWithCheckMark
          height={hp(54)}
          svgFile={creditech.CameraLimit}
          onPress={() => onScanDoc(selectedId, selectedTitle)}
          title={'Camera'}
          ImageStyle={{width: 34, height: 34, borderRadius: 8}}
          rowImage
          textColor="#020B19"
        />
        <CardWithCheckMark
          height={hp(54)}
          svgFile={creditech.uploadLimit}
          onPress={() => onUploadFromGallery(selectedId, selectedTitle)}
          title={'Upload'}
          ImageStyle={{width: 34, height: 34, borderRadius: 8}}
          rowImage
          textColor="#020B19"
        />
      </DefaultModal>
    );
  };
  const renderDocuments = () => {
    const documents = [
      {
        id: 0,
        title: translate('PROOF_OF_ADDRESS'),
        icon: creditech.locationConfirm,
        headLine: translate('RT_PROOF_OF_ADDRESS'),
        Mandatory: true,
        approveStatus: clientStatus?.utilityBillApprove,
      },
      {
        id: 1,
        title: translate('BANK_STATEMENT'),
        icon: creditech.HRLConfirm,
        headLine: translate('RT_PROOF_OF_INCOME'),
        Mandatory: false,
        approveStatus: clientStatus?.hrLetterApprove,
      },
      {
        id: 2,
        title: translate('RT_PROOF_OF_PAYMENT'),
        icon: creditech.bankAccConfirm,
        approveStatus: clientStatus?.payslipApprove,
      },
    ];

    return (
      <View
        style={{
          flex: 1,
          paddingBottom: hp(20),
          paddingHorizontal: hp(16),
          justifyContent: 'space-between',
        }}>
        <View>
          {documents.map((doc, index) => (
            <CardWithCheckMark
              key={index}
              height={hp(72)}
              checked={
                doc.approveStatus === 'Y' ||
                categories[0].data[index]?.photo?.uri
              }
              // checked={categories[0].data[index]?.photo?.uri}
              svgFile={doc.icon}
              onPress={() => {
                setSelectedId(doc.id);
                setSelectedTitle(doc.title);
                setShowModal(true);
              }}
              title={doc.title}
              Mandatory={doc.Mandatory == true}
              headLine={doc.headLine}
            />
          ))}
        </View>
        <DefaultButton
          title={translate('NEXT')}
          titleStyles={selectStyle('TextButtonNextSty')}
          disabled={!completeForm}
          onPress={submitPhotos}
          buttonStyle={[
            selectStyle('ButtonNextSty'),
            {opacity: !completeForm ? 0.5 : 1},
          ]}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        title={translate('RT_UPLOAD_DECUMENTS')}
        shapeVariant="orange"
        removeCapitalization
        scrollViewStyle={{backgroundColor: 'white'}}>
        {renderAdditionalDocsImage()}
        {/* {renderAddtionalDocsDescription()} */}
        {renderDocuments()}

        {/* <ContinueButton
          onContinuePressed={submitPhotos}
          completeForm={completeForm}
        /> */}
      </ScrollContainerWithNavHeader>
      {renderModel()}
      {isLoading || toView === 'loading' ? (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      ) : null}
    </View>
  );
};

export const CreditUpgrade = baseScreen(creditUpgrade, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
