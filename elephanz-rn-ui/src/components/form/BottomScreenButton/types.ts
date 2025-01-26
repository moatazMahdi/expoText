import {
  BaseFormItemProps,
  FieldTypes,
} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BottomScreenButtonProps extends BaseFormItemProps<any> {
  isLoading?: boolean;
  upperMinHeight: number;
  text: string;
  disabled: boolean;
  onPress: () => void;
  bottomMinHeight: number;
  bottomMaxHeight: number;
  type: FieldTypes.BOTTOM_BUTTON_FIELD;
  buttonType: 'contained' | 'text' | 'outlined';
}
