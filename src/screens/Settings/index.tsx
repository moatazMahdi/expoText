import React, { FC, useState } from 'react';
import { View } from 'react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import PressableChoice from 'src/components/PressableChoice';
import ItemWithArrow from 'src/components/ItemWithArrow';
import RowView from 'src/components/Wrappers/RowView';
import { useStyles } from 'elephanz-rn-ui';
import { LANGUAGES } from 'shared';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import styles from './styles';

const settings: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { translate, currentLanguage, updateTranslations } = useLocalization();
  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const stores = useStores();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const onLanguageChange = (language) => {
    if (currentLanguage.key === language) {
      return;
    }

    setIsLoading(true);

    const targetLanguage =
      currentLanguage.key === 'en' ? LANGUAGES[1] : LANGUAGES[0];
    updateTranslations(targetLanguage)
      .then(() => {
        setIsLoading(false);
        stores.backend.users.checkUserLanguage();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const renderLanguageChange = () => {
    const langs: { title: string; value: string }[] = [
      { title: 'English', value: 'en' },
      { title: 'Arabic', value: 'ar' },
    ];

    return (
      <RowView ms={40} mt={20}>
        <PressableChoice
          onPress={() => onLanguageChange(langs[0].value)}
          item={langs[0]}
          selectedId={currentLanguage.key}
          itemId={langs[0].value}
          title={langs[0].title}
          width={91}
          bordered
        />

        <PressableChoice
          onPress={() => onLanguageChange(langs[1].value)}
          item={langs[1]}
          selectedId={currentLanguage.key}
          itemId={langs[1].value}
          title={langs[1].title}
          width={91}
          bordered
        />
      </RowView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader
        shapeVariant="yellow"
        showFloatingActionButton
        title={translate('SETTINGS')}
      >
        <View style={selectStyle('contentContainer')}>
          <ItemWithArrow
            title={translate('CHANGE_APP_LANGUAGE')}
            icon={creditech.languageIconC}
          >
            {renderLanguageChange()}
          </ItemWithArrow>

          <ItemWithArrow
            title={translate('LEGAL')}
            icon={creditech.AttentionIcon}
            marginTop={26}
            onPress={() => navigation.navigate('termsAndConditions')}
          />
        </View>
      </ScrollContainerWithNavHeader>
      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};

export const Settings = baseScreen(settings, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
