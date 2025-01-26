import React from 'react';
import { Pressable, View } from 'react-native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import styles from './styles';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import SvgView from '../SvgView';
import { hp } from 'src/utils/Dimensions/dimen';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

interface BillOptionsCardInterface {
  compact?: boolean;
  link?: string;
  icon?: any;
  title: string;
  desc?: string;
  first?: boolean;
  comingSoon?: boolean;
  from?: string;
  action?: string;
}

const BillOptionsCard: React.FC<BillOptionsCardInterface> = (props) => {
  const {
    theme: {
      palette: { common },
    },
  } = useTheme();
  const stores = useStores();

  const { translate } = useLocalization();

  const { compact, link, icon, title, first, desc, comingSoon } = props;
  const { navigate } = useNavigationUtils();
  const { selectStyle } = useStyles(styles);

  const handleLogEvent = () => {
    switch (title) {
      case `${translate('TELECOM')}`:
      case `${translate('DONATIONS')}`:
      case `${translate('MORE')}`:
        ApplicationAnalytics(
          {
            eventKey: 'bill_payment',
            type: 'CTA',
            parameters: { billOption: title },
          },
          stores,
        );
        break;
      case `${translate('NEW_BILLS')}`:
      case `${translate('BILLS_HISTORY')}`:
      case `${translate('QUICK_PAY')}`:
      case `${translate('MANAGE_MY_CARDS')}`:
        ApplicationAnalytics(
          {
            eventKey: 'manage_my_bills',
            type: 'CTA',
            parameters: { billType: title },
          },
          stores,
        );
        break;
      default:
        break;
    }
  };

  const onNavigate = () => {
    navigate('billPayment', { link: link });
    handleLogEvent();
  };

  const renderCompactCard = () => {
    return (
      <DropShadowWrapper style={selectStyle('compactCardContainer')}>
        <SvgView svgFile={icon} width={32} height={32} />
        <Typography fontSize={12} fontWeight="700" marginTop={13.33}>
          {title}
        </Typography>
      </DropShadowWrapper>
    );
  };

  const renderWideCard = () => {
    return (
      <DropShadowWrapper
        style={[selectStyle('CardContainer'), !first && { marginTop: hp(16) }]}
      >
        <View style={selectStyle('iconNameContainer')}>
          <SvgView svgFile={icon} width={32} height={32} />
          <Typography fontSize={16} fontWeight="700" marginLeft={16}>
            {title}
          </Typography>
        </View>
        <Typography
          fontSize={14}
          fontWeight="400"
          colorHex={common.orange}
          marginTop={12}
        >
          {desc}
        </Typography>
      </DropShadowWrapper>
    );
  };

  return (
    <Pressable onPress={!comingSoon ? onNavigate : () => {}}>
      {compact ? renderCompactCard() : renderWideCard()}
    </Pressable>
  );
};

export default observer(BillOptionsCard);
