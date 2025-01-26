import { View, Pressable, ViewStyle, I18nManager } from 'react-native';
import React from 'react';
import styles from './styles';
import { ExtendedSVG, useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface SvgViewInterface {
  style?: ViewStyle;
  svgFile?: any;
  width?: number;
  height?: number;
  br?: number;
  ms?: number;
  me?: number;
  mb?: number;
  mt?: number;
  onPress?: () => void;
  noRTL?: boolean;
}

const SvgView: React.FC<SvgViewInterface> = (props) => {
  const { svgFile, mb, mt, width, height, br, ms, me, noRTL, onPress, style } =
    props;

  const { selectStyle } = useStyles(styles);

  return onPress ? (
    <Pressable
      hitSlop={{ bottom: 20, left: 20, right: 20, top: 20 }}
      onPress={onPress && onPress}
      style={[
        selectStyle('container'),
        width && { width: hp(width) },
        height && { height: hp(height) },
        // {
        //   width: '100%',
        //   height: '100%'
        // },
        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        mb && { marginBottom: hp(mb) },
        mt && { marginTop: hp(mt) },
        style,
      ]}
    >
      <ExtendedSVG svgFile={svgFile} {...props} />
    </Pressable>
  ) : (
    <View
      style={[
        selectStyle('container'),
        width && { width: hp(width) },
        height && { height: hp(height) },

        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        mb && { marginBottom: hp(mb) },
        mt && { marginTop: hp(mt) },
        noRTL && {
          transform: [
            {
              rotateY: I18nManager.isRTL ? '180deg' : '0deg',
            },
          ],
        },

        style,
      ]}
    >
      <ExtendedSVG svgFile={svgFile} {...props} />
    </View>
  );
};

export default SvgView;
