import React, { useEffect } from 'react';
import { useLocalization, useStores } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { View } from 'native-base';
import { Image } from 'react-native';
import RowView from 'src/components/Wrappers/RowView';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

interface CreditActivationEnquiryInterface {}

const creditActivationEnquiry: React.FC<
  CreditActivationEnquiryInterface
> = () => {
  const { translate } = useLocalization();
  const stores = useStores();
  const { selectStyle } = useStyles(styles);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const renderContent = () => {
    return (
      <View style={selectStyle('contentContainer')}>
        <Typography
          fontWeight="700"
          marginTop={40}
          fontSize={26}
          textAlign="center"
        >
          {translate('ACTIVATE_CREDIT_STEPS')}
        </Typography>

        <Image
          resizeMode="contain"
          source={creditech.successImage}
          style={selectStyle('disapprovedImage')}
        />
        <View>
          <RowView style={{ alignItems: 'center' }} mt={50} mb={10}>
            <Typography fontSize={24} fontWeight="bold" marginEnd={7}>
              •
            </Typography>
            <Typography fontSize={14}>
              {translate('VISIT_NEAREST_BRANCH_OR_BOOTH')}
            </Typography>
          </RowView>

          <RowView style={{ alignItems: 'center' }} mb={10}>
            <Typography fontSize={24} fontWeight="bold" marginEnd={7}>
              •
            </Typography>
            <Typography fontSize={14}>{translate('SIGN_CONTRACT')}</Typography>
          </RowView>

          <RowView style={{ alignItems: 'center' }}>
            <Typography fontSize={24} fontWeight="bold" marginEnd={7}>
              •
            </Typography>
            <Typography fontSize={14}>{translate('RECEIVE_OTP')}</Typography>
          </RowView>
        </View>
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader hideBack showLogo shapeVariant="orange">
      {renderContent()}
    </ScrollContainerWithNavHeader>
  );
};
export const CreditActivationEnquiry = baseScreen(creditActivationEnquiry, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
