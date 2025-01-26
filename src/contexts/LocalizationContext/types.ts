import {
  Language,
} from 'shared';

export interface LocalizationContextModel {
  translate: (key: string) => string;
  setLanguage: (language: Language, translations: Record<string, string>) => void;
  currentLanguage: Language;
  updateTranslations: (language: Language) => Promise<void>;
}
