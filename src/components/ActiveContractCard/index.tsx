import { Pressable, View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import {
  combineMoneyCurrency,
  formatDueDateText,
  getMonthName,
  returnArabicMonthName,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import ProgressBar from '../ProgressBarCN';
import { activeContractInterface, purchaseHistoryCardItem } from 'src/Types';
import { wp } from 'src/utils/Dimensions/dimen';
import RowView from '../Wrappers/RowView';

interface ActiveContractCardCardInterface {
  item: activeContractInterface;
  cardStyle?: ViewStyle;
  onPress?: any;
  viewAll?: boolean;
  selectable?: boolean;
  selectedIds?: purchaseHistoryCardItem[] | [];
  payToOther?: boolean;
}

const ActiveContractCard: React.FC<ActiveContractCardCardInterface> = (
  props,
) => {
  const {
    item,
    cardStyle,
    onPress,
    viewAll,
    selectable,
    selectedIds,
    payToOther,
  } = props;
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const checkId = () => {
    let checked = false;
    if (selectedIds.length > 0) {
      selectedIds?.forEach((element: purchaseHistoryCardItem) => {
        if (element.contractId === item.contractId) {
          checked = true;
        }
      });
    }
    return checked;
  };

  const renderDueDate = () => {
    return (
      <View>
        <Typography
          customStyles={() => ({
            text: selectStyle('dueDateText'),
          })}
        >
          {`${translate('INSTALLMENT_DUE_DATE')}`}{' '}
          <Typography fontSize={12} colorHex={common.blackesh} fontWeight="700">
            {formatDueDateText(item?.nextDueDate)}
          </Typography>{' '}
          {tempTranslate('of', 'من')} {getMonthName(item?.nextDueDate)}
        </Typography>
      </View>
    );
  };

  const renderSelectable = () => {
    return (
      <DropShadowWrapper>
        <Pressable
          onPress={() => onPress(item)}
          style={[
            selectStyle('purchaseHistoryCard'),
            viewAll && { width: wp(328) },
            cardStyle,
          ]}
        >
          <Typography
            marginBottom={3}
            customStyles={() => ({
              text: selectStyle('storeNameText'),
            })}
          >
            {item?.merchant}
          </Typography>
          <RowView jc="space-around">
            <Typography
              numberOfLines={2}
              customStyles={() => ({
                text: selectStyle('nameText'),
              })}
            >
              {item?.loanItem}
            </Typography>
            {selectable && (
              <View
                style={[
                  selectStyle('circleStyle'),
                  checkId() && selectStyle('circleFill'),
                ]}
              />
            )}
          </RowView>
          <Typography
            customStyles={() => ({
              text: selectStyle('priceText'),
            })}
          >
            {combineMoneyCurrency(item.totalAmount)}
          </Typography>
          <ProgressBar
            containerStyle={selectStyle('progressContainer')}
            total={100}
            part={100 - item?.remainingPercentage}
          />
          <View style={selectStyle('storeNameContainer')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('storeNameText'),
              })}
            >
              {item?.loanType}
            </Typography>
            <Typography
              customStyles={() => ({
                text: selectStyle('storeNameText'),
              })}
            >
              {`${item?.totalInstallmentMonths} ${tempTranslate(
                'Months',
                returnArabicMonthName(item?.totalInstallmentMonths),
              )}`}
            </Typography>
          </View>
          {item?.nextDueDate ? renderDueDate() : null}
        </Pressable>
      </DropShadowWrapper>
    );
  };

  const renderPayToOtherSelectable = () => {
    return (
      <View>
        <Pressable
          onPress={() => onPress(item)}
          style={[
            selectStyle('HistoryCard'),
            viewAll && { width: wp(328) },
            cardStyle,
          ]}
        >
          <View style={selectStyle('purchaseNameStore')}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={
                  checkId() && [
                    selectStyle('circleStyle'),
                    { marginRight: wp(6), borderWidth: 1 },
                    { justifyContent: 'center', alignItems: 'center' },
                  ]
                }
              >
                {
                  <View
                    style={[
                      selectStyle('circleStyle'),
                      { marginRight: wp(6), borderWidth: 1 },
                      checkId() && selectStyle('radioButton'),
                    ]}
                  />
                }
              </View>
              <Typography
                marginBottom={3}
                customStyles={() => ({
                  text: selectStyle('storeNameText'),
                })}
              >
                {item?.merchant}
              </Typography>
            </View>
            <Typography
              marginBottom={3}
              fontSize={12}
              customStyles={() => ({
                text: selectStyle('storeNameText'),
              })}
            >
              {translate('PURCHASE')}
              {item?.contractDate}
            </Typography>
          </View>

          <View style={{ marginHorizontal: wp(16) }}>
            <RowView jc="space-around">
              <Typography
                customStyles={() => ({
                  text: selectStyle('nameLoan'),
                })}
              >
                {item?.loanItem}
              </Typography>
            </RowView>
            <Typography
              customStyles={() => ({
                text: selectStyle('totalInstallment'),
              })}
            >
              {translate('TOTAL')} {combineMoneyCurrency(item.totalAmount)}
            </Typography>

            <Typography
              customStyles={() => ({
                text: selectStyle('monthlyInstallment'),
              })}
            >
              {translate('MONTHLY')}{' '}
              {combineMoneyCurrency(item.nextInstallmentAmount)}
            </Typography>

            <ProgressBar
              containerStyle={selectStyle('progressContainer')}
              total={100}
              part={100 - item?.remainingPercentage}
            />
            <View style={selectStyle('storeNameContainer')}>
              <Typography
                customStyles={() => ({
                  text: selectStyle('storeNameText'),
                })}
              >
                {item?.loanType}
              </Typography>
              <Typography
                customStyles={() => ({
                  text: selectStyle('storeNameText'),
                })}
              >
                {`${item?.totalInstallmentMonths} ${tempTranslate(
                  'Months',
                  returnArabicMonthName(item?.totalInstallmentMonths),
                )}`}
              </Typography>
            </View>
            <Typography
              customStyles={() => ({
                text: selectStyle('monthlyInstallment'),
                fontSize: 12,
              })}
            >
              {translate('INSTALLMENT_DUE_DATE')}
              {': '}
              {item?.nextDueDate}
            </Typography>
          </View>
        </Pressable>
      </View>
    );
  };

  return <>{payToOther ? renderPayToOtherSelectable() : renderSelectable()}</>;
};

export default observer(ActiveContractCard);
