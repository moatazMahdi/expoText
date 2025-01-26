import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect} from 'react';
import styles from './styles';
import {useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import DocumentPicker from 'react-native-document-picker';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import IconCard from '../IconCard';
import CameraModalContent from './cameraModalContent';
import {useRoute} from '@react-navigation/native';
import CustomCheckbox from '../CustomCheckBox';

interface CameraModelInterface {
  closeModal: () => void;
  showModal: boolean;
  setPhoto: (any) => void;
  setGallery: (boolean) => void;
  setThumbnail: (any) => void;
  approvementPoints?: any;
  isInvoiceError?: boolean;
  isAgreed?: boolean;
}

const CameraModal: React.FC<CameraModelInterface> = props => {
  const {
    closeModal,
    showModal,
    setPhoto,
    setGallery,
    setThumbnail,
    approvementPoints,
    isInvoiceError,
    isAgreed,
  } = props;

  const navigation = useNavigationUtils();

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  const [isTermsAgreed, setIsAgreed] = React.useState(isAgreed);

  const stores = useStores();

  const params = useRoute()?.params as {
    isInvoice: any;
    openCameraModal: any;
    // approvementPointsData: any,
    photo: any;
    thumbnail: any;
  };

  const [isInvoice, setIsInvoice] = React.useState(params?.isInvoice);

  useEffect(() => {
    isInvoiceError && setIsAgreed(true);
  }, [approvementPoints]);

  const onUpload = async () => {
    setGallery(true);
    setIsAgreed(true);

    ApplicationAnalytics(
      {eventKey: 'fatorty_get_started', type: 'CTA'},
      stores,
    );
    ApplicationAnalytics({eventKey: 'fatorty_upload', type: 'CTA'}, stores);
    Platform.OS === 'android' && closeModal();
    try {
      const pick = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (pick?.type !== 'image/jpeg') {
        const result = await PdfThumbnail.generate(pick.uri, 0);
        setThumbnail(result);
      }

      setPhoto({uri: pick, ...pick});
    } catch (error) {
      if (DocumentPicker.isCancel(error)) console.log('User canceled', error);
      else console.log(error);
    }
    Platform.OS === 'ios' && closeModal();
  };

  const onScan = () => {
    closeModal();
    setIsAgreed(true);
    setGallery(false);
    ApplicationAnalytics(
      {eventKey: 'fatorty_get_started', type: 'CTA'},
      stores,
    );
    ApplicationAnalytics({eventKey: 'fatorty_scan', type: 'CTA'}, stores);
    navigation.navigate('camera', {
      hideCameraContainer: true,
      setPhoto: data => setPhoto(data),
      justPicData: true,
      title: translate('SCANNED_RECEIPT'),
      controlQuality: 0.2,
      fatortyScan: true,
    });
  };

  const onCloseModel = () => {
    setIsInvoice(true);
    closeModal();
  };

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const animationTiming = 750;

  const renderCameraOptions = () => {
    const cameraOptions = [
      {
        id: 0,
        name: translate('SCAN'),
        icon: creditech.Scan,
        onPress: onScan,
      },
      {
        id: 1,
        name: translate('FATORTY_UPLOAD'),
        icon: creditech.Gallery,
        onPress: onUpload,
      },
    ];
    return (
      <ScrollView style={{...selectStyle('cameraContainer')}}>
        {cameraOptions?.map(({name, icon, onPress}, index) => {
          return (
            <IconCard
              key={name}
              leftIcon={icon}
              title={name}
              index={index}
              onPress={onPress}
              disabled={!isTermsAgreed}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View>
      <Modal
        style={selectStyle('modalStyle')}
        animationIn={'slideInUp'}
        animationInTiming={animationTiming}
        animationOut={'slideOutDown'}
        animationOutTiming={animationTiming}
        onBackdropPress={onCloseModel}
        onBackButtonPress={onCloseModel}
        isVisible={showModal}
        backdropTransitionInTiming={animationTiming}
        backdropTransitionOutTiming={animationTiming}>
        <View style={selectStyle('modalViewContainer')}>
          {isInvoice === false ? (
            <CameraModalContent {...params} />
          ) : (
            <>
              <CameraModalContent approvementPointsData={approvementPoints} />
              {approvementPoints.isEligible ? (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginHorizontal: wp(14),
                    // backgroundColor: 'red',
                    paddingVertical: hp(8),
                    marginBottom: hp(-18),
                  }}
                  onPress={() => setIsAgreed(!isTermsAgreed)}>
                  <CustomCheckbox
                    style={{marginStart: hp(12)}}
                    text={translate('I_AGREE')}
                    isChecked={isTermsAgreed}
                    onPress={() => {
                      setIsAgreed(!isTermsAgreed);
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </>
          )}
          {approvementPoints.isEligible ? renderCameraOptions() : null}
        </View>
      </Modal>
    </View>
  );
};

export default CameraModal;
