import React, { useEffect } from 'react';
import { View, Pressable, Image } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { PageTitle } from 'components';
import { Assets } from 'assets';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { hp } from 'src/utils/Dimensions/dimen';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

const {
  images: {
    screens: { creditech },
  },
} = Assets;

export const NoCreditApproval: React.FC = () => {
  const navigation = useNavigationUtils();
  const stores = useStores();
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  useEffect(() => {
    ApplicationAnalytics(
      {
        type: 'STATUS',
        eventKey: 'unemployedRejectedUser',
      },
      stores,
    );
  }, []);

  const renderNoCreditApprovalSVG = () => (
    <View style={selectStyle('NoCreditApprovalSVGWrapper')}>
      <Image
        source={creditech.applicationApprovalRejected}
        style={{ width: hp(248), height: hp(248), alignSelf: 'center' }}
      />
    </View>
  );

  const renderNoCreditApprovalDescription = () => (
    <Typography
      customStyles={() => ({
        text: selectStyle('NoCreditApprovalDescription'),
      })}
    >
      {translate('WE_APPRECIATE_YOUR_TIME').replace('"', "'")}
    </Typography>
  );

  const renderContinueButton = () => {
    return (
      <Pressable
        style={selectStyle('filledButtonContainer')}
        onPress={() => navigation.resetTo({ name: 'home' })}
      >
        <Typography
          customStyles={() => ({ text: selectStyle('filledButtonText') })}
        >
          {translate('GO_BACK')}
        </Typography>
      </Pressable>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader hideBack showLogo shapeVariant="orange">
        <PageTitle title={translate('WE_SORRY').replace('"', "'")} />

        {renderNoCreditApprovalSVG()}

        {renderNoCreditApprovalDescription()}

        {renderContinueButton()}
      </ScrollContainerWithNavHeader>
    </>
  );
};
