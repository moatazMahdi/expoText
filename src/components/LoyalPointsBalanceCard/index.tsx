import { I18nManager, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { useLocalization } from 'hooks';
import {
  combineMoneyCurrency,
  formatExpiryDate,
  getCurrency,
} from 'src/utils/HelpersFunctions';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import SvgView from '../SvgView';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import DefaultSeparator from '../DefaultSeparator';

interface LoyalPointsBalanceCardInterface {
  totalPointsValue: number;
  pointsToExpire: number;
  expiryDate: string;
  havePoints: string;
  noDateFormat?: Boolean;
}

const LoyalPointsBalanceCard: React.FC<LoyalPointsBalanceCardInterface> = (
  props,
) => {
  const { totalPointsValue, pointsToExpire, expiryDate, havePoints, noDateFormat } = props;

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: {
        common: { darkBlue },
      },
    },
  } = useTheme();

  const renderCardText = () => {
    const marginTop = I18nManager.isRTL ? -5 : 12;
    return (
      <View style={{ marginTop: marginTop }}>
        <Typography
          customStyles={() => ({
            text: selectStyle('YouHave'),
          })}
        >
          {`${tempTranslate('Worth', 'بقيمه')} `}
          <Typography
            customStyles={() => ({
              text: { fontSize: hp(18), fontWeight: '600', color: 'white' },
            })}
          >
            {`${totalPointsValue}`}

            <Typography
              style={{
                color: 'white',
                fontSize: hp(14),
                fontWeight: '600',
              }}
            >
              {` ${getCurrency()}`}
            </Typography>
          </Typography>
        </Typography>
      </View>
    );
  };

  const renderEGP = () => {
    return (
      <Typography
        customStyles={() => ({
          text: selectStyle('TextEGp'),
        })}
      >
        <Typography
          customStyles={() => ({
            text: selectStyle('BalanceText'),
          })}
        >
          {` ${combineMoneyCurrency(pointsToExpire, '')}`}
        </Typography>
      </Typography>
    );
  };

  const renderCardFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: hp(12),
        }}
      >
        {renderEGP()}
        <Typography
          numberOfLines={3}
          customStyles={() => ({
            text: selectStyle('ExpandedOn'),
          })}
        >
          {` ${translate('POINTS')} ${translate(
            'POINTS_EXPIRE_IN',
          )} ${noDateFormat ? expiryDate : formatExpiryDate(expiryDate)}`}
        </Typography>
      </View>
    );
  };

  return (
    <DropShadowWrapper style={selectStyle('balanceCard')}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <View
          style={{
            width: '70%',
            justifyContent: 'space-evenly',
          }}
        >
          <Typography
            numberOfLines={3}
            customStyles={() => ({
              text: selectStyle('PointText'),
            })}
          >
            {havePoints}
            <Typography
              customStyles={() => ({
                text: selectStyle('YouHave'),
              })}
            >
              {tempTranslate('Loyalty Points', 'نقاط')}
            </Typography>
          </Typography>

          {renderCardText()}

          {renderCardFooter()}
        </View>

        <View
          style={{
            width: '15%',
            justifyContent: 'center',
          }}
        >
          <SvgView svgFile={creditech.gift} width={wp(56)} height={wp(56)} />
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default observer(LoyalPointsBalanceCard);
