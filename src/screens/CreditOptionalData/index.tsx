import React, { useEffect, useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { useStores, useLocalization, useNavigationUtils } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import styles from './styles';
import { uploadDocs } from 'utils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import CardWithCheckMark from 'src/components/CardWithCheckMark';
import { hp } from 'src/utils/Dimensions/dimen';
import { baseScreen } from 'hoc';
import DefaultButton from 'src/components/DefaultButton';
import DefaultModal from 'src/components/DefaultModal';
import DocumentPicker from 'react-native-document-picker';

const {
  images: {
    screens: { creditech, instantApproval },
  },
} = Assets;

const creditOptionalData: React.FC = ({ route }) => {
  const stores = useStores();
  const {
    salaryProof,
    electricityBill,
    ProofLetter,
    frontPhoto,
    backPhoto,
    title,
  } = route?.params || {};

  const navigation = useNavigationUtils();

  const { translate } = useLocalization();

  const { selectStyle } = useStyles(styles);

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
      title: 'National ID',
      optional: false,
      message:
        'Scanning your national ID is mandatory to obtain a credit limit',
      captureCardsMsg:
        'Final check if all data is clearly visible and matches the information you entered in the previous steps.',
      frontCard: '[Function SvgComponent]',
      backCard: '[Function SvgComponent]',
      data: [
        {
          id: 1,
          photo: null,
          data: null,
          fileType: '' || 'image/jpeg',
        },
        {
          id: 2,
          photo: null,
          data: null,
          fileType: '' || 'image/jpeg',
        },
        {
          id: 3,
          photo: null,
          data: null,
          fileType: '' || 'image/jpeg',
        },
      ],
    },
  ];

  const [categories, setCategories] = useState(staticCategories);

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
      const isCarLicenseFrontApprove =
        clientStatus?.carLicenseFrontApprove === 'Y';
      const isCarLicenseBackApprove =
        clientStatus?.carLicenseBackApprove === 'Y';
      const isClubMembershipApprove =
        clientStatus?.clubMembershipApprove === 'Y';
      const isInsuranceCardApprove = clientStatus?.insuranceCardApprove === 'Y';

      const hasScannedPhoto =
        (frontPhoto && backPhoto) ||
        categories[0].data[1]?.photo?.uri ||
        categories[0].data[2]?.photo?.uri;

      if (
        isCarLicenseFrontApprove ||
        isCarLicenseBackApprove ||
        isClubMembershipApprove ||
        isInsuranceCardApprove ||
        hasScannedPhoto
      ) {
        setCompleteForm(true);
      } else {
        setCompleteForm(false);
      }
    } else {
      if (
        (frontPhoto && backPhoto) ||
        categories[0].data[1]?.photo?.uri ||
        categories[0].data[2]?.photo?.uri
      ) {
        if (categories[0].completed === false) {
          setCategories((categories) => {
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

  const setPhoto = (data, url, index) => {
    let newCategories = [];
    setCategories((categories) => {
      newCategories = [...categories];
      newCategories[0].data[index].photo = { ...data };
      return newCategories;
    });
  };
  const OnSkip = () => {
    navigation.navigate('approvalMessageScreen');
  };
  const submitPhotos = async () => {
    try {
      setIsLoading(true);
      const token = stores.backend.auth.getAccessToken();
      /********************************************************************************/
      let carLicenseFace =
        frontPhoto &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[0].fileType,
          id: `${userData.id}_${new Date().getTime()}_CAR_LICENSE_FACE`, //id unique for each user photo
          photoURI: frontPhoto,
        }));

      /********************************************************************************/
      let carLicenseBack =
        backPhoto &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[0].fileType,
          id: `${userData.id}_${new Date().getTime()}_CAR_LICENSE_BACK`, //id unique for each user photo
          photoURI: backPhoto,
        }));
      /********************************************************************************/
      let insurance =
        categories[0].data[1]?.photo?.uri &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[1].fileType,
          id: `${userData.id}_${new Date().getTime()}_INSURANCE`, //id unique for each user photo
          photoURI: categories[0].data[1].photo.uri,
        }));

      /********************************************************************************/
      let club =
        categories[0].data[2]?.photo?.uri &&
        (await uploadDocs({
          token,
          fileType: categories[0].data[2].fileType,
          id: `${userData.id}_${new Date().getTime()}_CLUB_MEMBERSHIP`, //id unique for each user photo
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
              carLicenseFace,
              carLicenseBack,
              insurance,
              club,
            )
          : await stores.backend.users.increaseLimit(
              userData?.phone,
              salaryProof,
              electricityBill,
              ProofLetter,
              carLicenseFace,
              carLicenseBack,
              insurance,
              club,
            );
      if (res?.status) {
        switch (res?.status) {
          case 'true':
            navigation.navigate('approvalMessageScreen');
            break;

          case 'false':
            Alert.alert('', translate('NO_LIMIT_UPGRADE'), [
              { text: translate('GENERIC_CONFIRM') },
            ]);
            break;

          case 'duplicated':
            Alert.alert('', translate('ALREADY_LIMIT_UPGRADED'), [
              { text: translate('GENERIC_CONFIRM') },
            ]);
            break;

          default:
            break;
        }
      }
      /********************************************************************************/
    } catch (error) {
      Alert.alert('', translate('ERROR'), [
        { text: translate('GENERIC_CONFIRM') },
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

      const newPhoto = { uri: uri, fileType: fileType };
      setCategories((categories) => {
        let newCategories = [...categories];
        newCategories[0].data[index].photo = newPhoto;
        return newCategories;
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const renderAdditionalDocsImage = () => {
    return (
      <Image
        resizeMode="contain"
        source={creditech.creditUpgradeImage}
        style={selectStyle('imageStyle')}
      />
    );
  };

  const renderAddtionalDocsDescription = () => {
    return (
      <View style={selectStyle('renderAddtionalDocsDescriptionContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('addtionalDocsDescription'),
          })}
        >
          {translate('RT_INCREASE_CHANCES_LIMIT')}
        </Typography>
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
        ViewContainerStyle={{ backgroundColor: '#FAFAFA' }}
      >
        <CardWithCheckMark
          height={hp(54)}
          svgFile={creditech.CameraLimit}
          onPress={() => onScanDoc(selectedId, selectedTitle)}
          title={'Camera'}
          ImageStyle={{ width: 34, height: 34, borderRadius: 8 }}
          textColor="#020B19"
          rowImage
        />
        <CardWithCheckMark
          height={hp(54)}
          svgFile={creditech.uploadLimit}
          onPress={() => onUploadFromGallery(selectedId, selectedTitle)}
          title={'Upload'}
          ImageStyle={{ width: 34, height: 34, borderRadius: 8 }}
          textColor="#020B19"
          rowImage
        />
      </DefaultModal>
    );
  };
  const renderDocuments = () => {
    const documents = [
      {
        id: 0,
        title: translate('CAR_LICENSE'),
        icon: creditech.carLicenseLimit,
        approveStatus:
          clientStatus?.carLicenseFrontApprove &&
          clientStatus?.carLicenseBackApprove,
      },
      {
        id: 1,
        title: translate('CLUB_ID'),
        icon: creditech.clubMembership,
        approveStatus: clientStatus?.clubMembershipApprove,
      },
      {
        id: 2,
        title: translate('INSURANCE_ID'),
        icon: creditech.unionMembership,
        approveStatus: clientStatus?.insuranceCardApprove,
      },
    ];

    return (
      <View style={{ paddingBottom: hp(20), paddingHorizontal: hp(16) }}>
        {documents.map((doc, index) => (
          <CardWithCheckMark
            key={index}
            height={hp(72)}
            checked={
              doc.approveStatus === 'Y' ||
              (doc.id === 0 && frontPhoto && backPhoto) ||
              categories[0].data[index]?.photo?.uri
            }
            svgFile={doc.icon}
            onPress={() => {
              if (doc.id === 0) {
                navigation.navigate('ScanCarLicense');
              } else {
                setSelectedId(doc.id);
                setSelectedTitle(doc.title);
                setShowModal(true);
              }
            }}
            title={doc.title}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        title={translate('APPLY_FOR_CREDIT_UPGRADE')}
        shapeVariant="orange"
        removeCapitalization
        scrollViewStyle={{ backgroundColor: 'white' }}
      >
        <DefaultButton
          onPress={OnSkip}
          title={translate('ONBOARDING_SKIP_BUTTON')}
          titleStyles={{ color: 'black', fontSize: 14, fontWeight: '500' }}
          width={92}
          buttonStyle={{
            alignSelf: 'flex-end',
            height: 40,
            borderRadius: 48,
            backgroundColor: '#F0F4F8',
            marginTop: 13,
            marginEnd: 14,
          }}
        />

        {renderAdditionalDocsImage()}
        {renderAddtionalDocsDescription()}
        {renderDocuments()}
        <DefaultButton
          title={translate('CONFIRM_VOUCHER')}
          titleStyles={{ color: 'white', fontSize: 16, fontWeight: '700' }}
          disabled={!completeForm}
          onPress={submitPhotos}
          buttonStyle={{
            marginTop: hp(30),
            height: 48,
            borderRadius: 48,
            backgroundColor: '#FD8326',
            opacity: completeForm ? 1 : 0.5,
          }}
        />
      </ScrollContainerWithNavHeader>
      {renderModel()}
      {isLoading ? (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      ) : null}
    </View>
  );
};

export const CreditOptionalData = baseScreen(creditOptionalData, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
