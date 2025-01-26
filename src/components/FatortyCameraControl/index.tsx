import React, {useRef, useState} from 'react';
import {Dimensions, TouchableOpacity, View, StyleSheet} from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import Icon from '@react-native-vector-icons/fontAwesome';
import SvgView from 'src/components/SvgView';
import {Assets} from 'assets';

type CameraControlsProps = {
  onSwitchCamera: () => void;
  onCapture: () => void;
  onFlashToggle: () => void;
  flashMode: any;
};

const {
  images: {
    screens: {creditech},
  },
} = Assets;

const {width} = Dimensions.get('window');
const buttonSize = Math.floor(width * 0.15);

const CameraControls: React.FC<CameraControlsProps> = ({
  onSwitchCamera,
  onFlashToggle,
  onCapture,
}) => {
  return (
    <View style={stylesa.container}>
      <View style={stylesa.innerContainer}>
        <TouchableOpacity style={stylesa.button} onPress={onSwitchCamera}>
          <SvgView svgFile={creditech.reverseCamera} width={30} height={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[stylesa.button, stylesa.captureButton]}
          onPress={onCapture}>
          {/* <Icon name="check" size={buttonSize / 2} color="white" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={stylesa.button} onPress={onFlashToggle}>
          <SvgView svgFile={creditech.FatortyFlashOff} width={30} height={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CameraControls;
const stylesa = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    // backgroundColor: 'blue',
    // position: 'absolute',
    // bottom: 40,
    // width: '100%',
    // flexDirection: 'row',
    // // justifyContent: 'space-around',
    // alignItems: '
  },

  button: {
    width: 56,
    height: 56,
    borderRadius: buttonSize / 2,
    backgroundColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#FF9933',
    width: 80,
    height: 80,
    borderRadius: buttonSize,
  },
});
