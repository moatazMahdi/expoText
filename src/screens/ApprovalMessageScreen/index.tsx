import React from 'react';
import { Image, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { BottomContainer } from 'src/components/BottomContainer';
import { useNavigationUtils, useLocalization } from 'hooks';
import DefaultButton from 'src/components/DefaultButton';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { hp } from 'src/utils/Dimensions/dimen';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import styles from './styles';

const approvalMessageScreen = () => {
  const { Message } = (useRoute().params as any) || {};

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <ScrollContainerWithNavHeader
      floatBot={90}
      showLogo
      shapeVariant="orange"
      hideBack
      showFloatingActionButton
    >
      <View style={{ flex: 1 }}>
        <View style={selectStyle('contentContainer')}>
          <Typography
            fontWeight="700"
            textAlign="center"
            marginBottom={33}
            fontSize={25}
          >
            {Message ?? translate('APPLICATION_SUBMITTED_SUCCESS')}
          </Typography>

          <Image
            source={creditech.successImage}
            style={{ width: hp(233), height: hp(233), alignSelf: 'center' }}
          />

          {!Message ? (
            <Typography textAlign="center" marginTop={63} fontSize={12}>
              {translate('NORMAL_ASSESSMENT_BODY')}
            </Typography>
          ) : null}
        </View>

        <BottomContainer>
          <DefaultButton
            title={translate('CONTINUE')}
            onPress={() => navigation.resetTo({ name: 'home' })}
          />
        </BottomContainer>
      </View>
    </ScrollContainerWithNavHeader>
  );
};

export const ApprovalMessageScreen = baseScreen(approvalMessageScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
