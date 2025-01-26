import { View, Pressable, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import AnimatedLottieView from 'lottie-react-native';

interface SvgViewInterface {
  style?: ViewStyle;
  width?: number;
  height?: number;
  br?: number;
  ms?: number;
  me?: number;
  onPress?: () => void;
  message?: string;
}

const DefaultOverLayLoading: React.FC<SvgViewInterface> = (props) => {
  const { width, height, br, ms, me, onPress, style, message } = props;

  const {
    images: {
      screens: { instantApproval },
    },
  } = Assets;

  const { selectStyle } = useStyles(styles);

  return (
    <Pressable
      onPress={onPress && onPress}
      style={[
        selectStyle('container'),
        width && { width: hp(width) },
        height && { height: hp(height) },
        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        style,
      ]}
    >
      <View
        style={[
          selectStyle('loadingContainer'),
          message ? selectStyle('withMessageContainer') : null,
        ]}
      >
        {message ? (
          <Typography
            customStyles={() => ({
              text: { alignSelf: 'center', textAlign: 'center' },
            })}
          >
            {message}
          </Typography>
        ) : null}
        <View style={selectStyle('lottieView')}>
          <AnimatedLottieView
            source={instantApproval.loadingLottie}
            autoPlay
            loop
          />
        </View>
      </View>
    </Pressable>
  );
};

export default DefaultOverLayLoading;
