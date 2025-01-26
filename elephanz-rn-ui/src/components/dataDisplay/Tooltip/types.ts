import {
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';

// eslint-disable-next-line no-shadow
export enum TooltipPosition {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export interface GeneralTooltipProps {
  text: string;
  onClose: () => void;
  children: React.ReactElement<ViewProps>;
  isVisible: boolean;
  duration?: number;
  transitionDuration?: number;
  contentContainer?: ViewStyle;
  tooltipPosition?: TooltipPosition;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface StylesInterface {
  container: ViewStyle;
  triangleTop: ViewStyle;
  triangleBottom: ViewStyle;
  triangleRight: ViewStyle;
  triangleLeft: ViewStyle;
  textBody: TextStyle;
  textStyle: ViewStyle;
  triangle: ViewStyle;
  tip: TextStyle;
}
