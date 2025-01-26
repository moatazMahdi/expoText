import React from 'react';
import { useStyles } from 'elephanz-rn-ui';
import styles from './styles';
import { bottomContainerInterface } from 'src/Types';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';

export const BottomContainer: React.FC<bottomContainerInterface> = (props) => {
  const { children, style } = props;
  const { selectStyle } = useStyles(styles);

  return <DropShadowWrapper style={[selectStyle('container'), style]}>{children}</DropShadowWrapper>;
};
