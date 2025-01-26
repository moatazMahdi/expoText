import { View, Pressable, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface RowViewWrapper {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  mt?: number;
  mb?: number;
  ms?: number;
  jc?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  wt?: string | number;
  ai?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

const RowView: React.FC<RowViewWrapper> = (props) => {
  const { children, mt, ms, jc, wt, style, onPress, mb, ai } = props;

  const { selectStyle } = useStyles(styles);

  return onPress ? (
    <Pressable
      onPress={onPress}
      style={[
        selectStyle('container'),
        mt && { marginTop: hp(mt) },
        mb && { marginBottom: hp(mb) },
        ms && { marginStart: wp(ms) },
        jc && { justifyContent: jc },
        wt && { width: wp(wt) },
        ai && { alignItems: ai },
        style
      ]}
    >
      {children}
    </Pressable>
  ) : (
    <View
      style={[
        selectStyle('container'),
        mt && { marginTop: hp(mt) },
        mb && { marginBottom: hp(mb) },
        ms && { marginStart: wp(ms) },
        jc && { justifyContent: jc },
        wt && { width: wp(wt) },
        ai && { alignItems: ai },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default RowView;
