import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  View,
  ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  Props,
} from './types';

const BOTTOM_CARD_BORDER_RADIUS = 24;

export const ScreenContainer: React.FC<
Props
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
    headerRender,
    children,
    bottomCard,
    contentContainerStyle,
    keyboardExtraHeight,
  } = props;
  const scrollViewPadding: ViewStyle = {
    paddingBottom: bottomCard ? bottomCard.height + BOTTOM_CARD_BORDER_RADIUS : 0,
  };
  const fixedKeyboardExtraHeight = keyboardExtraHeight || 0;
  return (
    <View
      style={
        [styles.screenContainer]
      }
    >
      {
        headerRender
      }
      <View
        style={styles.bodyContainer}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <KeyboardAwareScrollView
            extraHeight={
              bottomCard ? bottomCard.height + BOTTOM_CARD_BORDER_RADIUS + fixedKeyboardExtraHeight
                : fixedKeyboardExtraHeight
            }
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={[
              styles.scrollViewContentContainer,
              scrollViewPadding,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            keyboardShouldPersistTaps
          >
            {
              children
            }
          </KeyboardAwareScrollView>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bottom: theme.spacing.spacing(0),
            left: theme.spacing.spacing(0),
          }}
          pointerEvents="box-none"
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
            }}
            pointerEvents="box-none"
          />
        </View>
      </View>
    </View>
  );
};
