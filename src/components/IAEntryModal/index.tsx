import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { AppliedCardInterface } from 'src/Types';
import DefaultButton from '../DefaultButton';
import DefaultModal from '../DefaultModal';
import { Assets } from 'assets';
import styles from './styles';

const IAEntryModal: React.FC<AppliedCardInterface> = (props) => {
  const { setAlertVisible, isVisible, fromScreen } = props;

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  useEffect(() => {
    if (isVisible) {
      ApplicationAnalytics(
        {
          eventKey: 'IAEntryModelOpened',
          type: 'CTA',
          parameters: { fromScreen },
        },
        stores,
      );
    }
  }, [isVisible]);

  const renderContent = () => (
    <DefaultModal
      hideModalViewStyle
      isVisible={isVisible}
      onCloseModal={() => setAlertVisible(false)}
    >
      <DropShadowWrapper style={selectStyle('modalContainer')}>
        <Image
          resizeMode="contain"
          source={creditech.IAEntry}
          style={{
            width: hp(118),
            height: hp(117),
            alignSelf: 'center',
          }}
        />

        <Typography
          fontSize={16}
          fontWeight="500"
          customStyles={() => ({
            text: {
              lineHeight: 23,
              marginTop: hp(18),
              color: 'black',
              marginBottom: hp(35),
              textAlign: 'center',
            },
          })}
        >
          {translate('GET_INSTANT_APPROVAL')}
          {', '}
          {translate('INSTANT_APPROVAL_DESC')}
        </Typography>

        <DefaultButton
          fromModal="IAEntryModal"
          title={translate('APPLY_NOW')}
          onPress={() => {
            if (stores.backend.users.role === 'GUEST')
              navigation.navigate('signUp');
            else {
              ApplicationAnalytics(
                {
                  eventKey: 'IAEntryModel-CTA-APPLY-NOW',
                  type: 'CTA',
                },
                stores,
              );
              navigation.navigate('permissionsDisclaimer');
            }
            setAlertVisible(false);
          }}
          buttonStyle={{
            width: wp(250),
            height: hp(45),
          }}
          titleStyle={{
            fontWeight: 'bold',
            fontSize: wp(15),
          }}
        />

        <DefaultButton
          fromModal="IAEntryModal"
          title={translate('ONBOARDING_SKIP_BUTTON')}
          onPress={() => {
            setAlertVisible(false);
            ApplicationAnalytics(
              {
                eventKey: 'IAEntryModel-CTA-SKIP',
                type: 'CTA',
              },
              stores,
            );
            navigation.navigate('welcome');
          }}
          titleStyle={{
            color: common.darkBlue,
          }}
          buttonStyle={{
            width: wp(250),
            height: hp(45),
            backgroundColor: common.transparent,
          }}
        />
      </DropShadowWrapper>
    </DefaultModal>
  );

  return <>{renderContent()}</>;
};

export default IAEntryModal;
