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
  Button,
} from '../../inputs/Button';
import {
  styles as themedStyles,
  StylesInterface,
} from './styles';
import {
  BottomScreenButtonProps,
} from './types';

export const BottomScreenButton: React.FC<
BottomScreenButtonProps
> = (props) => {
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<StylesInterface>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  // const selectContainerStyle = () => {
  //   const {
  //     buttonType,
  //   } = props;
  //   switch (buttonType) {
  //     case 'text':
  //       return styles.textButton;
  //     case 'outlined':
  //       return styles.outlinedButton;
  //     case 'contained':
  //       return styles.containedButton;
  //     default:
  //       return styles.containedButton;
  //   }
  // };
  // const selectTextStyle = () => {
  //   const {
  //     buttonType,
  //   } = props;
  //   switch (buttonType) {
  //     case 'text':
  //       return styles.textButtonText;
  //     case 'outlined':
  //       return styles.outlinedButtonText;
  //     case 'contained':
  //       return styles.containedButtonText;
  //     default:
  //       return styles.containedButtonText;
  //   }
  // };
  const {
    isLoading,
    upperMinHeight,
    text,
    disabled,
    onPress,
    bottomMinHeight,
    bottomMaxHeight,
    // style,
    // activeTextStyle,
  } = props;
  return (
    <View
      style={styles.mainContainer}
    >
      <View
        style={{
          flex: 1,
          minHeight: upperMinHeight,
        }}
      />
      <Button
        disabled={disabled}
        onPress={onPress}
        isLoading={isLoading}
      >
        {text}
      </Button>
      <View
        style={{
          flex: 1,
          minHeight: bottomMinHeight,
          maxHeight: bottomMaxHeight,
        }}
      />
    </View>
  );
};
