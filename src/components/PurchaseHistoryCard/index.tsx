import { Pressable, TouchableOpacity, View, ViewStyle } from 'react-native';
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
import { purchaseHistoryCardItem } from 'src/Types';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import { Assets } from 'assets';

interface PurchaseHistoryCardInterface {
  item: purchaseHistoryCardItem;
  cardStyle?: ViewStyle;
  onPress?: any;
  viewAll?: boolean;
  selectable?: boolean;
  selectedIds?: purchaseHistoryCardItem[] | [];
  shadowStyle?: ViewStyle;
  removeMinHeight?: boolean;
  nameLines?: number;
  forInfoScreen?: boolean;
}

const PurchaseHistoryCard: React.FC<PurchaseHistoryCardInterface> = (props) => {
  const {
    item,
    cardStyle,
    forInfoScreen,
    onPress,
    viewAll,
    selectable,
    removeMinHeight,
    nameLines,
    selectedIds,
    shadowStyle,
  } = props;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

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
      <Typography
        customStyles={() => ({
          text: item?.latePaymentFees
            ? { ...selectStyle('dueDateText'), color: '#E54444' }
            : selectStyle('dueDateText'),
        })}
      >
        {item?.latePaymentFees
          ? `${combineMoneyCurrency(item?.latePaymentFees)} ${translate(
              'LATE_FEES',
            )}`
          : `${translate('NEXT_DUE_DATE')}: ${formatDueDateText(
              item?.nextDueDate,
            )} ${tempTranslate('of', 'من')} ${getMonthName(item?.nextDueDate)}`}
      </Typography>
    );
  };

  const renderAmount = () => {
    if (forInfoScreen) {
      return (
        <>
          <Typography
            customStyles={() => ({
              text: selectStyle('priceText'),
            })}
          >
            {translate('TOTAL')} {combineMoneyCurrency(item.totalAmount)}
          </Typography>
          {item?.nextInstallmentAmount ? (
            <Typography
              fontWeight="300"
              fontSize={16}
              colorHex={common.blackesh}
            >
              {translate('MONTHLY')}{' '}
              {combineMoneyCurrency(item?.nextInstallmentAmount)}
            </Typography>
          ) : null}
        </>
      );
    } else {
      return (
        <Typography
          customStyles={() => ({
            text: selectStyle('priceText'),
          })}
        >
          {combineMoneyCurrency(item.totalAmount)}
        </Typography>
      );
    }
  };

  const renderSelectable = () => {
    return (
      <DropShadowWrapper style={[shadowStyle, selectStyle('shadowWrapper')]}>
        <Pressable
          // onPress={onPress ? () => onPress(item) : () => {}}
          style={[
            selectStyle('purchaseHistoryCard'),
            cardStyle,
            viewAll && { width: wp(328) },
            cardStyle,
          ]}
        >
          <View style={selectStyle('rowStyle')}>
            <View style={selectStyle('iconStyle')}>
              <SvgView
                svgFile={creditech.shoppingItem}
                height={16}
                width={16}
              />
            </View>

            <View style={{ width: '50%' }}>
              <Typography
                numberOfLines={1}
                customStyles={() => ({
                  text: selectStyle('merchantText'),
                })}
              >
                {item?.merchant}
              </Typography>
              <Typography
                numberOfLines={1}
                customStyles={() => ({
                  text: {
                    ...selectStyle('loanItemText'),
                    minHeight: removeMinHeight ? 0 : hp(55),
                  },
                })}
              >
                {item?.loanItem}
              </Typography>
            </View>
            {onPress ? (
              <View style={selectStyle('detailsBtn')}>
                <TouchableOpacity onPress={() => onPress(item)}>
                  <Typography
                    customStyles={() => ({
                      text: { color: common.black },
                    })}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {translate('VIEW_DETAILS')}
                  </Typography>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <RowView jc="space-around">
            {selectable && (
              <View
                style={[
                  selectStyle('circleStyle'),
                  checkId() && selectStyle('circleFill'),
                ]}
              />
            )}
          </RowView>

          {renderAmount()}

          <ProgressBar
            showMonthNumber={item?.totalPaidMonths}
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
          {item?.nextDueDate ? (
            renderDueDate()
          ) : (
            <View style={{ marginTop: hp(18) }} />
          )}
        </Pressable>
      </DropShadowWrapper>
    );
  };

  return <>{renderSelectable()}</>;
};

export default observer(PurchaseHistoryCard);
