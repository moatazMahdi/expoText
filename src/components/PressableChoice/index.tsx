import { Pressable, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface PressableChoiceInterface {
  style?: ViewStyle;
  width?: number;
  height?: number;
  br?: number;
  ms?: number;
  me?: number;
  onPress?: () => void;
  item: {};
  itemId: number | string;
  selectedId: number | string;
  title: string;
  bordered?: boolean;
}

const PressableChoice: React.FC<PressableChoiceInterface> = (props) => {
  const {
    width,
    height,
    bordered,
    br,
    ms,
    me,
    style,
    selectedId,
    itemId,
    title,
    onPress,
  } = props;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const { selectStyle } = useStyles(styles);

  return (
    <Pressable
      onPress={onPress && onPress}
      style={[
        selectStyle('categoryCard'),
        width && { width: hp(width) },
        height && { height: hp(height) },
        br && { borderRadius: br },
        ms && { marginStart: wp(ms) },
        me && { marginEnd: wp(me) },
        selectedId === itemId && { backgroundColor: common.darkOrange },
        bordered &&
          selectedId !== itemId && {
            borderWidth: 1,
            borderColor: common.darkBlue,
          },
        style,
      ]}
    >
      <Typography
        customStyles={() => ({
          text: {
            ...selectStyle('categoryText'),
            color: selectedId === itemId ? common.white : '#98A2B3',
            // backgroundColor: selectedId === itemId ? common.darkOrange : '#F0F4F8',
          },
        })}
      >
        {title}
      </Typography>
    </Pressable>
  );
};

export default PressableChoice;
