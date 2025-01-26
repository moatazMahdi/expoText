import React from 'react';
import { Alert } from 'react-native';
import { observer } from 'mobx-react';
import { combineMoneyCurrency, returnCredit } from 'src/utils/HelpersFunctions';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import DefaultSeparator from '../DefaultSeparator';
import DefaultButton from '../DefaultButton';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';

const BalanceCard: React.FC<any> = () => {
  const { selectStyle } = useStyles(styles);
  const { navigate } = useNavigationUtils();
  const { translate } = useLocalization();

  const stores = useStores();
  const userCredit = stores.backend.users.userCredits.data;

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

  let credit = returnCredit(userCredit);

  const limit = `${translate('OUT_OF')} ${combineMoneyCurrency(
    credit?.limit,
  )} ${translate('BALANCE_CARD_LIMIT')}`;

  const onNavigateCreditUpgrade = () => {
    if (credit?.limit) {
      navigate('creditUpgrade');
    } else {
      Alert.alert('', translate('MUST_HAVE_CREDIT'), [
        { text: translate('GENERIC_CONFIRM') },
      ]);
    }
  };

  return (
    <DropShadowWrapper mb={24} style={selectStyle('balanceCard')}>
      <Typography
        customStyles={() => ({
          text: selectStyle('totalBalanceText'),
        })}
      >
        {translate('AVAILABLE_CREDIT_LIMIT')}
      </Typography>

      <Typography
        customStyles={() => ({
          text: selectStyle('BalanceText'),
        })}
      >
        {combineMoneyCurrency(credit?.amount ?? 0)}
      </Typography>

      <Typography
        customStyles={() => ({
          text: selectStyle('limitText'),
        })}
      >
        {limit}
      </Typography>

      <DefaultSeparator mb={16} mt={16} color={'#F0F0F0'} />

      <DefaultButton
        width={305}
        variant="secondaryBackground"
        titleStyle={selectStyle('buttonText')}
        icon={() => (
          <SvgView svgFile={creditech.upgrade} height={16} width={16} me={10} />
        )}
        buttonStyle={{ backgroundColor: common.lightGray }}
        onPress={onNavigateCreditUpgrade}
        title={translate('APPLY_FOR_CREDIT_UPGRADE')}
      />
    </DropShadowWrapper>
  );
};

export default observer(BalanceCard);
