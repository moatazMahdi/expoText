import {
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface Props {
  title?: string;
  headerContainerStyle?: ViewStyle;
  textContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  left: () => JSX.Element;
  center: () => JSX.Element;
  right: () => JSX.Element;
  dimensions?: HeaderWithFlex | HeaderWithWidth;
  height: number;
}

export type HeaderWithFlex = {
  flex: number[];
};
export type HeaderWithWidth = {
  width: number[];
};

// eslint-disable-next-line no-shadow
export enum Position {
  LEFT,
  CENTER,
  RIGHT,
}

export function isFlex(dimensions: HeaderWithWidth | HeaderWithFlex): dimensions is HeaderWithFlex {
  return !!(dimensions as HeaderWithFlex).flex;
}
