export interface BaseFieldProps<T> {
  value: T;
  onFocus?: () => any;
  onBlur?: () => any;
  isFocused?: boolean;
  disabled?: boolean;
  label?: string;
}
