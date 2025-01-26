import { View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface HorizontalFlatListItemWrapperInterface {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  mb?: number;
  mt?: number;
  me?: number;
  mv?: number;
  m?: number;
}

const HorizontalFlatListItemWrapper: React.FC<
  HorizontalFlatListItemWrapperInterface
> = (props) => {
  const { children, style, mb, mt, me, mv, m } = props;
  const { selectStyle } = useStyles(styles);

  return (
    <View
      style={[
        selectStyle('container'),
        mb && { marginBottom: hp(mb) },
        mt && { marginTop: hp(mt) },
        me && { marginEnd: wp(me) },
        mv && { marginVertical: hp(mv) },
        m && { margin: hp(m) },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default HorizontalFlatListItemWrapper;
