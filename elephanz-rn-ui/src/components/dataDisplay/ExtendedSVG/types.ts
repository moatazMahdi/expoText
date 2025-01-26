import {
  FunctionComponent,
} from 'react';
import {
  ViewStyle,
} from 'react-native';
import {
  SvgProps,
} from 'react-native-svg';
import {
  Theme,
} from '../../../theming';

export interface ExtendedSVGProps extends SvgProps {
  svgFile: FunctionComponent<SvgProps>;
  customStyles?: (theme: Theme) => ExtendedSVGStyles;
}

export interface ExtendedSVGStyles {
  containerStyle: ViewStyle;
}
