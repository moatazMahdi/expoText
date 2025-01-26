import { View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface VerticalFlatListItemWrapperInterface {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  mb?: number;
  mt?: number;
  me?: number;
  mv?: number;
  m?: number;
  col: number;
}

const VerticalFlatListItemWrapper: React.FC<
  VerticalFlatListItemWrapperInterface
> = (props) => {
  const { children, style, mb, mt, me, mv, m, col } = props;

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
        col && { width: wp(100 / col) },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default VerticalFlatListItemWrapper;
