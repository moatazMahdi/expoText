import React from 'react';
import {I18nManager, ImageBackground} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import {useNavigationUtils} from 'hooks';
import {useStyles} from 'elephanz-rn-ui';
import {BackArrow} from 'components';
import {Question} from 'src/Types';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const afconOnBoarding: React.FC = () => {
  const {todayQuestion} =
    (useRoute().params as {
      todayQuestion?: Question;
    }) || {};

  const {replace, goBack} = useNavigationUtils();
  const {selectStyle} = useStyles(styles);

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  return (
    <ImageBackground
      resizeMode="stretch"
      style={selectStyle('image')}
      source={
        I18nManager?.isRTL ? creditech.onBoarding_AR : creditech.onBoarding_EN
      }>
      <BackArrow onPress={() => goBack()} type="short" />

      <DefaultButton
        buttonStyle={selectStyle('buttonStyle')}
        onPress={() =>
          replace({
            name: 'afconQuestions',
            params: {todayQuestion: todayQuestion},
          })
        }
        title={tempTranslate('Play', 'العب')}
        titleStyle={selectStyle('T16_500')}
      />
    </ImageBackground>
  );
};

export const AfconOnBoarding = baseScreen(afconOnBoarding, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
