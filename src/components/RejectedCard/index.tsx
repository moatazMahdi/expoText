import { View, Image } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { hp } from 'src/utils/Dimensions/dimen';
import DefaultButton from '../DefaultButton';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

interface RejectedCardInterface {}

const RejectedCard: React.FC<RejectedCardInterface> = () => {
  const stores = useStores();

  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const userId = stores.backend.users.userData?.id;

  return (
    <DropShadowWrapper style={selectStyle('container')}>
      <View>
        <Image
          resizeMode="contain"
          source={creditech.creditDisApprove}
          style={selectStyle('disapprovedImage')}
        />
        <Typography
          customStyles={() => ({
            text: { lineHeight: hp(25) },
          })}
          marginTop={0}
          fontSize={14}
        >
          {translate('USER_REJECTED_CREDIT')}
        </Typography>
        <View style={{ marginTop: hp(10) }}>
          <DefaultButton
            variant="secondaryBackground"
            title={translate('VISIT_BRANCH')}
            width={305}
            onPress={() => {
              // ApplicationAnalytics(
              //   { eventKey: 'home_activate_credit_cta' },
              //   stores,
              // );
              // stores.backend.general.logEvent({
              //   key: 'home_activate_credit_cta',
              //   userId,
              // });
              navigation.navigate('branches', {
                data: stores.backend.general.branches.data,
              });
            }}
          />
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default RejectedCard;
