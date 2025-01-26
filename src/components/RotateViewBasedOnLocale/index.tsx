import { View, Pressable, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface RotateViewBasedOnLocaleInterface {
  style?: ViewStyle;
  children: React.ReactNode;
  width?: number;
  height?: number;
  br?: number;
  ms?: number;
  me?: number;
  onPress?: () => void;
  inverted?: boolean;
}

const RotateViewBasedOnLocale: React.FC<RotateViewBasedOnLocaleInterface> = (props) => {
  const { children, inverted, width, height, br, ms, me, onPress, style } = props;

  const { selectStyle } = useStyles(styles);

  return onPress ? (
    <Pressable
      onPress={onPress && onPress}
      style={[
        !inverted ? selectStyle('rotate') : selectStyle('inverseRotate'),
        width && { width: hp(width) },
        height && { height: hp(height) },
        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        style
      ]}
    >
      {children}
    </Pressable>
  ) : (
    <View
      style={[
        !inverted ? selectStyle('rotate') : selectStyle('inverseRotate'),
        width && { width: hp(width) },
        height && { height: hp(height) },
        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default RotateViewBasedOnLocale;
