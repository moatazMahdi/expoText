import React from 'react';
import { useNavigationUtils, useLocalization } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { View } from 'native-base';
import DefaultButton from 'src/components/DefaultButton';
import { hp } from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';

interface SendMessageDoneInterface {}

const sendMessageDone: React.FC<SendMessageDoneInterface> = () => {
  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const { translate } = useLocalization();

  const renderButtons = () => {
    return (
      <View style={{ justifyContent: 'flex-end', marginBottom: hp(20) }}>
        <DefaultButton
          title={translate('LOGIN_CONTINUE')}
          onPress={() => navigation.resetTo({ name: 'home' })}
        />
      </View>
    );
  };
  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <Typography fontSize={36}>{translate('SEND_MESSAGE_DONE')}</Typography>

        <SvgView width={392} height={492} svgFile={creditech.Documents} />
        <Typography fontSize={16}>
          {translate('SEND_MESSAGE_RESPONSE')}
        </Typography>
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader hideBack shapeVariant="yellow" showLogo>
      {renderContent()}
      {renderButtons()}
    </ScrollContainerWithNavHeader>
  );
};
export const SendMessageDone = baseScreen(sendMessageDone, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
