import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { combineMoneyCurrency } from 'src/utils/HelpersFunctions';
import { hp } from 'src/utils/Dimensions/dimen';
import DefaultButton from '../DefaultButton';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';

interface AppliedCardInterface {}

const AppliedCard: React.FC<AppliedCardInterface> = () => {
  const stores = useStores();

  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const instantApprovalStatus =
    stores.backend.instantApproval.instantApprovalStatus;
  const userId = stores.backend.users.userData?.id;

  return (
    <DropShadowWrapper style={selectStyle('container')}>
      <View>
        <Typography fontSize={12} fontWeight={'bold'}>
          {translate('APPROVED_FOR')}
        </Typography>

        <Typography
          marginTop={10}
          marginBottom={12}
          fontSize={32}
          fontWeight="bold"
        >
          {instantApprovalStatus?.limit &&
            combineMoneyCurrency(instantApprovalStatus?.limit)}
        </Typography>

        <Typography
          customStyles={() => ({
            text: { lineHeight: hp(20) },
          })}
          marginTop={20}
          fontSize={14}
        >
          {translate('ONE_STEP_LEFT')}
        </Typography>
        <View style={{ marginTop: hp(20) }}>
          <DefaultButton
            title={translate('ACTIVATE_CREDIT')}
            width={305}
            onPress={() => {
              ApplicationAnalytics(
                { eventKey: 'home_activate_credit_cta',
              type:'CTA' },
                stores,
              );
              // stores.backend.general.logEvent({
              //   key: 'home_activate_credit_cta',
              //   userId,
              // });
              navigation.navigate('creditActivationEnquiry');
            }}
          />
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default AppliedCard;
