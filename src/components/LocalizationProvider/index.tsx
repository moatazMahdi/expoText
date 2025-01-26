import React, { useState } from 'react';
import { LocalizationContext, LocalizationContextModel } from 'contexts';
import { Language } from 'shared';
import { I18nManager } from 'react-native';
import { memoize } from 'lodash';
import i18n from 'i18n-js';
import RNRestart from 'react-native-restart';
import { useConnections, useStores } from 'hooks';
import { observer } from 'mobx-react';

const localizationProvider: React.FC = (props) => {
  const stores = useStores();
  const connections = useConnections();
  const [translate, setTranslate] = useState<Pick<LocalizationContextModel, 'translate'>>({
    translate: () => ''
  });
  const setLanguage = async (language: Language, translations: Record<string, string>) => {
    const newTranslate = memoize(
      (key, config?) => i18n.t(key, config),
      (key, config) => (config ? key + JSON.stringify(config) : key)
    );
    newTranslate.cache.clear!();
    i18n.translations = {
      [language.key]: translations
    };
    i18n.locale = language.key;
    setTranslate({
      translate: newTranslate
    });
    stores.ui.localization.setCurrentLanguage(language);
    if (I18nManager.isRTL !== language.isRTL) {
      I18nManager.allowRTL(language.isRTL);
      I18nManager.forceRTL(language.isRTL);
      await stores.hydrate();
      RNRestart.Restart();
    }
  };
  const updateTranslations = async (language: Language) => {
    connections.backend.updateDefaultHeaders({
      'Accept-Language': language.key
    });
    await stores.backend.staticTexts.staticTexts.updateOptions(language.key);
    const translationMap = stores.backend.staticTexts.staticTexts.data?.reduce(
      (acc, val) => ({
        ...acc,
        [val.textKey]: val.value
      }),
      {}
    );
    await setLanguage(language, translationMap);
  };
  const { children } = props;
  return (
    <LocalizationContext.Provider
      value={{
        setLanguage,
        translate: translate.translate,
        currentLanguage: stores.ui.localization.currentLanguage,
        updateTranslations
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const LocalizationProvider = observer(localizationProvider);
