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
  isFlex,
  Position,
  Props,
} from './types';

export const BackHeader: React.FC<
Props
> = (props) => {
  const {
    headerContainerStyle,
    textContainerStyle,
    dimensions,
    left,
    center,
    right,
    height,
  } = props;
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<Styles>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  const getDimensions = (pos: Position) => {
    if (dimensions) {
      if (isFlex(dimensions)) {
        return {
          flex: dimensions.flex[pos],
        };
      }
      return {
        width: dimensions.width[pos],
        height,
      };
    }
    if (pos === Position.CENTER) {
      return {
        flex: 1,
        height,
      };
    }
    return {
      width: height,
      height,
    };
  };

  return (
    <View
      style={[
        styles.headerContainer,
        headerContainerStyle,
      ]}
    >
      <View
        style={[
          getDimensions(Position.LEFT),
        ]}
      >
        {
          left && left()
        }
      </View>
      <View
        style={[
          styles.textContainerStyle,
          getDimensions(Position.CENTER),
          textContainerStyle,
        ]}
      >
        {
          center && center()
        }
      </View>
      <View
        style={[
          getDimensions(Position.RIGHT),
        ]}
      >
        {
          right && right()
        }
      </View>
    </View>
  );
};
