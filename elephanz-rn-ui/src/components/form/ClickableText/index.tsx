import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Text,
  TouchableHighlight,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  styles as themedStyles,
  StylesInterface,
} from './styles';
import {
  Props,
} from './types';

export const ClickableText: React.FC<
Props
> = (props) => {
  const {
    style,
    onPress,
    text,
    disabled,
  } = props;
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<StylesInterface>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  return (
    <TouchableHighlight disabled={disabled}>
      <Text
        style={
          style || [styles.forgetPassword]
        }
        onPress={onPress}
      >
        {text}
      </Text>
    </TouchableHighlight>
  );
};
