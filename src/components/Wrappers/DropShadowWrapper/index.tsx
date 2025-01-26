import { View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface DropShadow {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  shadowColor?: string;
  mb?: number;
  mt?: number;
  me?: number;
  ms?: number;
  mv?: number;
  mh?: number;
  m?: number;
  x?: number;
  y?: number;
  elevation?: number;
}

const DropShadowWrapper: React.FC<DropShadow> = (props) => {
  const { children, style, mb, mt, me, ms, mv, m, mh, elevation } = props;
  const { selectStyle } = useStyles(styles);

  return (
    // <Shadow
    //   startColor={shadowColor ? shadowColor : common.azureishWhite + '77'}
    //   offset={[x ?? 0, y ?? hp(12)]}
    //   distance={10}
    //   viewStyle={[style]}
    //   containerViewStyle={[
    //     { backgroundColor: 'transparent' },
    //     selectStyle('dropShadowContainer'),
    //     mb && { marginBottom: hp(mb) },
    //     mt && { marginTop: hp(mt) },
    //     me && { marginEnd: wp(me) },
    //     mv && { marginVertical: hp(mv) },
    //     m && { margin: hp(m) },
    //     containerStyle
    //   ]}
    // >
    //   <View style={{ borderRadius: hp(20) }}>{children}</View>
    // </Shadow>

    <View
      style={[
        { backgroundColor: 'transparent' },
        selectStyle('dropShadowContainer'),
        mb && { marginBottom: hp(mb) },
        mt && { marginTop: hp(mt) },
        me && { marginEnd: wp(me) },
        me && { marginStart: wp(me) },
        mv && { marginVertical: hp(mv) },
        m && { margin: hp(m) },
        mh && { marginHorizontal: wp(mh) },
        elevation && { elevation: elevation },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default DropShadowWrapper;
