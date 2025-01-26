import {
  ReactNode,
} from 'react';
import {
  FlatListProps,
  ImageStyle,
  ModalProps,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Country,
  CountryCode,
  Region,
  Subregion,
  TranslationLanguageCode,
} from 'react-native-country-picker-modal';
import {
  CountryFilterProps,
} from 'react-native-country-picker-modal/lib/CountryFilter';
import {
  Theme,
} from 'react-native-country-picker-modal/lib/CountryTheme';
import {
  BaseFormItemProps,
  FieldTypes,
} from '../../form/types';

interface NativeCountryPickerProps {
  countryCode: CountryCode;
  region?: Region;
  subregion?: Subregion;
  countryCodes?: CountryCode[];
  excludeCountries?: CountryCode[];
  theme?: Theme;
  translation?: TranslationLanguageCode;
  modalProps?: ModalProps;
  filterProps?: CountryFilterProps;
  flatListProps?: FlatListProps<Country>;
  withAlphaFilter?: boolean;
  withCallingCode?: boolean;
  withCurrency?: boolean;
  withEmoji?: boolean;
  withCountryNameButton?: boolean;
  withCurrencyButton?: boolean;
  withCallingCodeButton?: boolean;
  withCloseButton?: boolean;
  withFilter?: boolean;
  withFlag?: boolean;
  withModal?: boolean;
  visible?: boolean;
  containerButtonStyle?: StyleProp<ViewStyle>;
  renderFlagButton?(props: FlagButtonProps): ReactNode;
  renderCountryFilter?(props: TextInputProps): ReactNode;
  onSelect?(country: Country): void;
  onOpen?(): void;
}
export interface Styles {
  correctPickerStyle: ViewStyle;
  incorrectPickerStyle: ViewStyle;
  inputError: TextStyle;
  inputWithLableStyle: ViewStyle;
  textInputContainer: ViewStyle;
  chevron: ImageStyle;
  labelContainerStyle: TextStyle;
  countryPickerContainer: ViewStyle;
  callingCode: TextStyle;
  container: ViewStyle;
}

interface FlagButtonProps {
  withEmoji?: boolean;
  withCountryNameButton?: boolean;
  withCurrencyButton?: boolean;
  withCallingCodeButton?: boolean;
  withFlagButton?: boolean;
  containerButtonStyle?: StyleProp<ViewStyle>;
  countryCode?: CountryCode;
  placeholder: string;
  onOpen?(): void;
}

interface BaseCountryPickerProps {
  onPress: () => void;
  onClose?: () => void;
  correctPickerStyle?: ViewStyle;
  incorrectPickerStyle?: ViewStyle;
  type: FieldTypes.COUNTRY_PICKER_FIELD;
}

export type CountryPickerProps = BaseCountryPickerProps
& NativeCountryPickerProps
& BaseFormItemProps<Country>;
