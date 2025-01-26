import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Typography } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface CustomCheckboxProps {
  isChecked?: boolean;
  onPress?: () => void;
  text?: string;
  style?: StyleProp<ViewStyle>;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  isChecked = false,
  onPress,
  text = '',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isChecked ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isChecked]);

  const toggleCheckbox = () => {
    if (onPress) {
      onPress();
    }
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#008900'],
  });

  const checkmarkColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#fff'],
  });

  const checkmarkOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={toggleCheckbox}
        style={styles.checkboxContainer}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
      >
        <Animated.View
          style={[
            styles.checkbox,
            { backgroundColor, borderColor: backgroundColor },
          ]}
        >
          <Animated.View
            style={[styles.checkmark, { opacity: checkmarkOpacity }]}
          >
            <Animated.Text
              style={{
                color: checkmarkColor,
              }}
            >
              ✓
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
      <Typography style={{ marginLeft: 8 }}>{text}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(2.4),
    borderColor: 'green',
    borderRadius: hp(2.4),
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    position: 'absolute',
  },
});

export default CustomCheckbox;
