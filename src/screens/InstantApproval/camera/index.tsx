import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Image, Pressable} from 'react-native';
import ImageEditor from '@react-native-community/image-editor';
import {useRoute} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import {
  useStyles,
  useTheme,
  ExtendedSVG,
  Button,
  Typography,
} from 'elephanz-rn-ui';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import NavigationHeader from 'src/components/NavigationHeader';
import {useNavigationUtils, useStores} from 'hooks';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import FatortyCamera from 'src/components/FatortyCamera';

const camera: React.FC = (props: any) => {
  const route = useRoute() || {};
  const {params} = props.route;

  const title = props.route?.params?.title;
  const {
    categoryDataId,
    setCategories,
    justPicData,
    setPhoto,
    controlQuality,
    fatortyScan,
  } = params || {};

  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [isLoading, setIsLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const navigation = useNavigationUtils();

  const {selectStyle} = useStyles(styles);
  const stores = useStores();
  const cameraRef = useRef<RNCamera | null>(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

  const {
    theme: {
      palette: {success, error, common},
    },
  } = useTheme();

  const {
    images: {
      screens: {instantApproval, creditech},
    },
  } = Assets;

  const goBack = () => navigation.goBack();

  const recapture = () => {
    setCaptured(false);
    cameraRef?.current?.resumePreview();
  };

  const capture = async () => {
    try {
      if (cameraRef) {
        ApplicationAnalytics(
          {
            type: 'CTA',
            eventKey: 'captureImage',
            parameters: {ScreenName: route?.name},
          },
          stores,
        );

        setIsLoading(true);
        const data = await cameraRef.current.takePictureAsync({
          quality: controlQuality ?? 1,
          // orientation: 'portrait',
          pauseAfterCapture: true,
        });

        const ratio: boolean = data.width > data.height;
        const url = await ImageEditor.cropImage(data.uri, {
          offset: {x: 0, y: 0},
          size: {width: data.width, height: data.height},
          // displaySize: ratio
          //   ? {
          //       width: data.width * 0.1,
          //       height: data.height * 0.25,
          //     }
          //   : {
          //       width: data.width * 0.25,
          //       height: data.height * 0.1,
          //     },
          resizeMode: 'cover',
          quality: 0.5,
        });
        justPicData ? setPhoto(data) : setCategories(data, url, categoryDataId);
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (err) {
      setIsLoading(false);
    }
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
            onPress={goBack}>
            <ExtendedSVG svgFile={instantApproval.correct} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              ...selectStyle('confirmPhotoButton'),
              backgroundColor: error.value,
            }}
            onPress={recapture}>
            <ExtendedSVG svgFile={instantApproval.wrong} />
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
  const flashToggle = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.on
        : RNCamera.Constants.FlashMode.off,
    );
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
    // setCameraType(cameraType)
  };

  const renderFlashMode = () => {
    return (
      <Pressable
        onPress={flashToggle}
        style={{position: 'absolute', top: hp(20), left: wp(20)}}>
        <SvgView
          svgFile={
            flashMode === RNCamera.Constants.FlashMode.off
              ? creditech.flashOff
              : creditech.flashOn
          }
          width={30}
          height={30}
        />
      </Pressable>
    );
  };

  return fatortyScan ? (
    <FatortyCamera
      title={title}
      cameraRef={cameraRef}
      cameraType={cameraType}
      flashMode={flashMode}
      switchCamera={switchCamera}
      capture={capture}
      flashToggle={flashToggle}
    />
  ) : (
    <View style={selectStyle('cameraContainer')}>
      <NavigationHeader shapeVariant="yellow" title={title ?? ''} />

      <RNCamera
        ref={cameraRef}
        style={selectStyle('cameraContainer')}
        flashMode={flashMode}>
        {renderFlashMode()}
        {!params?.hideCameraContainer && (
          <>
            <View
              style={{
                position: 'absolute',
                top: 0,
                width: wp(500),
                height: hp(212),
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            />
            <View style={selectStyle('cameraBoxContainer')}>
              <Image
                style={selectStyle('cameraFrame')}
                source={instantApproval.cameraFrame}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: wp(500),
                height: 190,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            />
          </>
        )}
      </RNCamera>
      {renderCaptureButton()}
    </View>
  );
};

export const Camera = baseScreen(camera, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
