import React from 'react';
import { useNavigationUtils, useLocalization, useStores } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { View } from 'native-base';
import DefaultButton from 'src/components/DefaultButton';
import { Image } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { BottomContainer } from 'src/components/BottomContainer';

interface FatortyApprovalMessageInterface {}

const digitalFatortyApprovalMessage: React.FC<
  FatortyApprovalMessageInterface
> = () => {
  const navigation = useNavigationUtils();
  const stores = useStores();
  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const renderSCanAnother = () => {
    return (
      <DefaultButton
        variant="secondaryBackground"
        mt={20}
        title={translate('SCAN_ANOTHER_RECEIPT')}
        onPress={() => {
          ApplicationAnalytics(
            { eventKey: 'fatorty_scan_another_reciept', type: 'CTA' },
            stores,
          );
          navigation.navigate('digitalFatorty');
        }}
      />
    );
  };

  const renderButtons = () => {
    return (
      <View style={{ justifyContent: 'flex-end', marginBottom: 0 }}>
        <BottomContainer>
          <DefaultButton
            title={translate('GO_HOME')}
            onPress={() => {
              ApplicationAnalytics(
                { eventKey: 'fatorty_go_to_home', type: 'CTA' },
                stores,
              );
              navigation.resetTo({ name: 'home' });
            }}
          />
          {renderSCanAnother()}
        </BottomContainer>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <Typography
          marginBottom={87}
          textAlign="center"
          marginTop={20}
          fontWeight="700"
          fontSize={26}
        >
          {translate('FATORTY_REQUEST_SUBMITTED')}
        </Typography>
        <Image
          source={creditech.successImage}
          style={{ width: hp(233), height: hp(233), alignSelf: 'center' }}
        />
        {/* <Typography
          marginTop={76}
          marginBottom={49}
          marginLeft={40}
          marginRight={40}
          textAlign="center"
          fontSize={12}
        >
          {translate('FATORTY_REQUEST_DESC')}
        </Typography> */}
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader showLogo hideBack shapeVariant="orange">
      {renderContent()}
      {renderButtons()}
    </ScrollContainerWithNavHeader>
  );
};
export const DigitalFatortyApprovalMessage = baseScreen(
  digitalFatortyApprovalMessage,
  {
    allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
  },
);
