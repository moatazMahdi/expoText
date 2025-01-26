import React from 'react';
import { useNavigationUtils, useLocalization } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { baseScreen } from 'hoc';
import styles from './styles';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { View } from 'native-base';
import DefaultButton from 'src/components/DefaultButton';
import { hp } from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';

interface SendMessageDoneInterface {}

const sendMessageDone: React.FC<SendMessageDoneInterface> = () => {
  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const renderButtons = () => {
    return (
      <View style={{ justifyContent: 'flex-end', marginBottom: hp(20) }}>
        <DefaultButton
          title={translate('CONTINUE')}
          onPress={() => navigation.resetTo({ name: 'home' })}
        />
      </View>
    );
  };
  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <Typography fontSize={36}>
          {tempTranslate('We received your message', 'لقد تلقينا رسالتك')}
        </Typography>

        <SvgView width={392} height={492} svgFile={creditech.Documents} />
        <Typography fontSize={16}>
          {tempTranslate(
            'We will get back to you as soon as we can. Please check your e-mail for our reply within 1 - 2 business days.',
            'سنعود إليك في أقرب وقت ممكن. يرجى التحقق من بريدك الإلكتروني للحصول على ردنا في غضون يوم إلى يومين عمل.',
          )}
        </Typography>
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader hideHeader>
      {renderContent()}
      {renderButtons()}
    </ScrollContainerWithNavHeader>
  );
};
export const SendMessageDone = baseScreen(sendMessageDone, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
