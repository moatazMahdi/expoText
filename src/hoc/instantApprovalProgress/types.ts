import { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export interface InstantApprovalProgressProps {
  children?: ReactNode;
  showProgress?: boolean;
  step: number;
  title: string;
  screen: string;
  animateProgress?: boolean;
}

export interface StylesInterface {
  container: ViewStyle;
  headerContainer: ViewStyle;
  backArrow: ViewStyle;
  headerTitleContainer: ViewStyle;
  headerTitle: TextStyle;
  progressContainer: ViewStyle;
  steps: TextStyle;
  bodyContainer: ViewStyle;
}
