import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  ViewStyle,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  FormRowItemProps,
} from './types';

export const FormRowItem: React.FC<
FormRowItemProps
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
  const selectStyle = () => {
    const {
      style,
      isLast,
    } = props;
    let selectedStyle!: ViewStyle | ViewStyle[];
    if (style && isLast) {
      selectedStyle = [styles.lastRowItem, style];
    } else if (style && !isLast) {
      selectedStyle = [styles.rowItem, style];
    } else if (!style && isLast) {
      selectedStyle = [styles.rowItem, styles.lastRowItem];
    } else if (!style && !isLast) {
      selectedStyle = styles.rowItem;
    }
    return selectedStyle;
  };

  const {
    children,
  } = props;
  return <View style={selectStyle()}>{children}</View>;
};
