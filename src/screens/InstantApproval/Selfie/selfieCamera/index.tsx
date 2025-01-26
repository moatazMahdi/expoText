import React, {useRef, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import ImageEditor from '@react-native-community/image-editor';
import {useRoute} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import NavigationHeader from 'src/components/NavigationHeader';
import {useStyles, useTheme, Button} from 'elephanz-rn-ui';
import {useNavigationUtils, useStores} from 'hooks';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const selfieCamera: React.FC = (props: any) => {
  const route = useRoute() || {};
  const {params} = props.route;
  const title = props.route?.params?.title;
  const {setSelfiePic} = params || {};

  const [isLoading, setIsLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const cameraRef = useRef<RNCamera | null>(null);

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const stores = useStores();

  const {
    theme: {
      palette: {success, error, common},
    },
  } = useTheme();

  const {
    images: {
      screens: {instantApproval},
    },
  } = Assets;

  const capture = async () => {
    try {
      if (cameraRef) {
        ApplicationAnalytics(
          {
            eventKey: 'selfieCaptureImage',
            type: 'CTA',
            parameters: {ScreenName: route?.name},
          },
          stores,
        );

        setIsLoading(true);

        const data = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          orientation: 'portrait',
          pauseAfterCapture: true,
        });

        const ratio: boolean = data.width > data.height;
        const url = await ImageEditor.cropImage(data.uri, {
          offset: {x: 0, y: 0},
          size: {width: data.width, height: data.height},
          // displaySize: ratio
          //   ? {
          //       width: data.width * 0.15,
          //       height: data.height * 0.255,
          //     }
          //   : {
          //       width: data.width * 0.255,
          //       height: data.height * 0.15,
          //     },
          resizeMode: 'cover',
          quality: 0.5,
        });
        setSelfiePic({...data, url: url?.uri});
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const recapture = () => {
    setCaptured(false);
    cameraRef?.current?.resumePreview();
  };

  const renderCaptureButton = () => {
    if (captured) {
      return (
        <View style={selectStyle('confirmPhotoContainer')}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              ...selectStyle('confirmPhotoButton'),
              backgroundColor: success.value,
            }}
            onPress={() => navigation.goBack()}>
            <SvgView svgFile={instantApproval.correct} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              ...selectStyle('confirmPhotoButton'),
              backgroundColor: error.value,
            }}
            onPress={recapture}>
            <SvgView svgFile={instantApproval.wrong} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Button
          color="primary"
          customStyles={() => ({
            button: (disabled: boolean) =>
              disabled
                ? {
                    ...selectStyle('button'),
                    backgroundColor: common.lightgrey,
                  }
                : {
                    ...selectStyle('button'),
                    backgroundColor: common.white,
                  },
          })}
          isLoading={isLoading}
          disabled={isLoading}
          onPress={capture}>
          <View style={selectStyle('captureButtonInner')}>
            <View style={selectStyle('innerHorizontal')} />

            <View style={selectStyle('innerVertical')} />
          </View>
        </Button>
      );
    }
  };

  return (
    <View style={selectStyle('cameraContainer')}>
      <NavigationHeader shapeVariant="yellow" title={title ?? ''} />

      <RNCamera
        ref={cameraRef}
        style={selectStyle('cameraContainer')}
        flashMode={RNCamera.Constants.FlashMode.auto}
        type={RNCamera.Constants.Type.front}></RNCamera>

      {renderCaptureButton()}
    </View>
  );
};

export const SelfieCamera = baseScreen(selfieCamera, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
