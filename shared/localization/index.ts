import {
  Language,
} from './types';

export const LANGUAGES = [
  new Language(
    'en',
    'English',
    false,
  ),
  new Language(
    'ar',
    'العربية',
    true,
  ),
] as const;

export * from './types';
