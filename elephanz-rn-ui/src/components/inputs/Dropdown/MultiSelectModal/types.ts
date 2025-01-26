import {
  DropdownOption,
} from '../types';

export interface MultiSelectModalProps {
  options: DropdownOption[];
  onSelect: (result: string[]) => void;
  values: string[];
}
