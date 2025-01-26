import React from 'react';
import {RNCamera} from 'react-native-camera';
import {useStyles} from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import styles from './styles';
import CameraControls from '../FatortyCameraControl';

const FatortyCamera: React.FC = (props: any) => {
  const {
    title,
    switchCamera,
    capture,
    flashToggle,
    flashMode,
    cameraRef,
    cameraType,
  } = props;
  const {selectStyle} = useStyles(styles);

  return (
    <>
      <NavigationHeader shapeVariant="orange" title={title ?? ''} />
      <RNCamera
        ref={cameraRef}
        style={selectStyle('cameraContainer')}
        type={cameraType}
        key={cameraType}
        flashMode={flashMode}></RNCamera>
      <CameraControls
        onSwitchCamera={switchCamera}
        onCapture={capture}
        flashMode={flashMode}
        onFlashToggle={flashToggle}
      />
    </>
  );
};

export default FatortyCamera;
