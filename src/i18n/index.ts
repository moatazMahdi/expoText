import I18n from 'i18n-js';

export const en = require('./en.json');
export const ar = require('./ar.json');
I18n.fallbacks = true;
I18n.translations = {
  ar,
  en
};
export default I18n;
