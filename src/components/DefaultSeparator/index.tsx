import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { observer } from 'mobx-react';
import { DefaultSeparatorInterface } from 'src/Types';

const DefaultSeparator: React.FC<DefaultSeparatorInterface> = (props) => {
  const { width, height, color, mt, mb, me, ms } = props;
  const { selectStyle } = useStyles(styles);

  return (
    <View
      style={[
        selectStyle('container'),
        width && { width },
        height && { height },
        color && { backgroundColor: color },
        mt && { marginTop: mt },
        mb && { marginBottom: mb },
        me && { marginStart: me },
        ms && { marginEnd: ms },
      ]}
    />
  );
};

export default observer(DefaultSeparator);
