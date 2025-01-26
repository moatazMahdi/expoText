import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  FormRowProps,
} from './types';

export const FormRow: React.FC<
FormRowProps
> = (props) => {
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<Styles>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  const {
    style,
    children,
  } = props;
  return <View style={style || styles.pickerContainer}>{children}</View>;
};
