import { Platform, Pressable, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import DocumentPicker from 'react-native-document-picker';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DynamicDisclaimer from '../DynamicDisclaimer';
import PdfThumbnail from 'react-native-pdf-thumbnail';

interface FatortyCameraModelInterface {
  closeModal: () => void;
  showModal: boolean;
  setPhoto: (any) => void;
  setGallery: (boolean) => void;
  setThumbnail: (any) => void;
}

const FatortyCameraModal: React.FC<FatortyCameraModelInterface> = (props) => {
  const { closeModal, showModal, setPhoto, setGallery, setThumbnail } = props;

  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const stores = useStores();

  const onUpload = async () => {
    setGallery(true);
    ApplicationAnalytics(
      { eventKey: 'fatorty_get_started', type: 'CTA' },
      stores,
    );
    ApplicationAnalytics({ eventKey: 'fatorty_upload', type: 'CTA' }, stores);
    Platform.OS === 'android' && closeModal();
    try {
      const pick = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (pick?.type !== 'image/jpeg') {
        const result = await PdfThumbnail.generate(pick.uri, 0);
        setThumbnail(result);
      }

      setPhoto({ uri: pick, ...pick });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) console.log('User canceled', error);
      else console.log(error);
    }
    Platform.OS === 'ios' && closeModal();
  };
  const onScan = () => {
    closeModal();
    setGallery(false);
    ApplicationAnalytics(
      { eventKey: 'fatorty_get_started', type: 'CTA' },
      stores,
    );
    ApplicationAnalytics({ eventKey: 'fatorty_scan', type: 'CTA' }, stores);
    navigation.navigate('camera', {
      hideCameraContainer: true,
      setPhoto: (data) => setPhoto(data),
      justPicData: true,
      title: translate('SCANNED_RECEIPT'),
      controlQuality: 0.2,
    });
  };

  const onCloseModel = () => {
    closeModal();
  };

  const {
    images: {
      screens: { creditech },
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
      <ScrollView style={selectStyle('cameraContainer')}>
        {cameraOptions?.map(({ name, icon, onPress }, index) => {
          return (
            <Pressable onPress={onPress}>
              <RowView mt={index !== 0 && 24}>
                <SvgView svgFile={icon} width={22} height={22} />
                <Typography
                  customStyles={() => ({
                    text: selectStyle('cameraOption'),
                  })}
                >
                  {name}
                </Typography>
              </RowView>
            </Pressable>
          );
        })}
        <DynamicDisclaimer text={translate('CAMERA_MODEL_ATTENTION')} />
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
        backdropTransitionOutTiming={animationTiming}
      >
        <View style={selectStyle('modalViewContainer')}>
          {renderCameraOptions()}
        </View>
      </Modal>
    </View>
  );
};

export default FatortyCameraModal;
