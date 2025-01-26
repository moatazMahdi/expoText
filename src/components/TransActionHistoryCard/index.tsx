import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import {
  combineMoneyCurrency,
  formatDueDateText,
  returnMonthYear,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import { Contract } from 'shared';
import styles from './styles';

interface TransactionHistoryInterface {
  item: Contract;
  cardStyle?: any;
  fromItemInfo?: boolean;
}
const PurchaseHistoryCard: React.FC<TransactionHistoryInterface> = (props) => {
  const { item, fromItemInfo, cardStyle } = props;

  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const itemPrice = combineMoneyCurrency(+item?.totalAmount);

  return (
    <>
      {fromItemInfo ? (
        <View style={selectStyle('historyContainer')}>
          <View>
            <Typography
              customStyles={() => ({
                text: selectStyle('dateStyle'),
              })}
            >{`${formatDueDateText(item?.dueDate)} ${tempTranslate(
              'of',
              'من',
            )} ${returnMonthYear(item?.dueDate, false, true)}`}</Typography>
            <Typography
              customStyles={() => ({
                text: selectStyle('amountStyle'),
              })}
            >
              {combineMoneyCurrency(item?.amount)}
            </Typography>
          </View>
          <View style={selectStyle('paidContainer')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('paidText'),
              })}
            >
              {translate('PAID')}
            </Typography>
          </View>
        </View>
      ) : (
        <View style={[selectStyle('transactionHistoryCard'), cardStyle]}>
          <View style={selectStyle('priceArrowContainer')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('priceText'),
              })}
            >
              {itemPrice}
            </Typography>
          </View>
          <Typography
            customStyles={() => ({
              text: selectStyle('nameText'),
            })}
          >
            {item.loanItem}
          </Typography>
          <Typography
            customStyles={() => ({
              text: selectStyle('storeNameText'),
            })}
          >
            {item?.merchant ?? ''}
          </Typography>
          <Typography
            customStyles={() => ({
              text: selectStyle('dateText'),
            })}
          >
            {item?.contractDate ?? ''}
          </Typography>
        </View>
      )}
    </>
  );
};

export default observer(PurchaseHistoryCard);
