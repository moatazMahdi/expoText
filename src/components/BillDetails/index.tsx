import { Typography, useStyles } from 'elephanz-rn-ui';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styles from './styles';
import { useLocalization } from 'hooks';
import { combineMoneyCurrency } from 'src/utils/HelpersFunctions';
interface BillDetailsProps {
  style?: any;
  Amount: string | number;
  feesAmount: string;
  isLoading?: boolean;
  screenName?: string;
}

//screenName={'DigitalFatortyOptions'}
const BillDetails: React.FC<BillDetailsProps> = ({
  Amount,
  feesAmount,
  isLoading,
  style,
  screenName,
}) => {
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  return (
    <View style={[selectStyle('billContainer'), { ...style }]}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FD8326" />
      ) : (
        <>
          <Typography style={selectStyle('amountLabel')}>
            {screenName === 'DigitalFatortyOptions'
              ? translate('FATORTY_INVOICE_AMOUNT')
              : translate('FATORTY_INSTALLMENT_AMOUNT')}
          </Typography>
          <Typography style={selectStyle('amount')}>
            {combineMoneyCurrency(+Amount)}
          </Typography>
          <Typography style={selectStyle('amountLabel')}>
            {translate('FEES_AMOUNT')}
          </Typography>
          <Typography style={selectStyle('amount')}>
            {combineMoneyCurrency(+feesAmount)}
          </Typography>
        </>
      )}
    </View>
  );
};

export default BillDetails;
