import React, {useEffect, useState} from 'react';
import {I18nManager, Pressable, ScrollView} from 'react-native';
import {View} from 'native-base';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import FloatingActionButton from 'src/components/FloatingActionButton';
import {combineMoneyCurrency, formatMoney} from 'src/utils/HelpersFunctions';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import DefaultTextInput from 'src/components/DefaultTextInput';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {ContinueButton} from 'components';
import {baseScreen} from 'hoc';
import styles from './styles';

const calculator: React.FC = () => {
  const [installmentValue, setInstallmentValue] = React.useState<string>(null);
  const [adminFees, setAdminFees] = React.useState<string>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [months, setMonths] = React.useState<string>();
  const [amount, setAmount] = useState<string>();

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (months && amount) {
        try {
          setLoading(true);
          const response =
            await stores.backend.products.getGenericCalculatorResult({
              amount: +amount,
              tenors: +months,
            });
          setInstallmentValue(response?.installmentValue);
          setAdminFees('' + ((+amount * 5) / 100).toFixed(1));
        } catch (error) {
          setMonths(null);
        } finally {
          setLoading(false);
        }
      }
      if (!amount) setInstallmentValue(null);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [months, amount]);

  const renderPriceInput = () => {
    return (
      <View style={selectStyle('priceContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('inputTitleText'),
          })}>
          {translate('PRODUCT_PRICE')}
        </Typography>

        <DefaultTextInput
          keyboardType="decimal-pad"
          value={amount}
          textInputStyle={selectStyle('inputStyle')}
          placeholder={translate('PRICE_PLACEHOLDER')}
          onchangeText={setAmount}
          inputContainer={selectStyle('inputContainer')}
        />

        {adminFees && installmentValue && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: wp(22),
            }}>
            <Typography
              customStyles={() => ({
                text: selectStyle('calculatedAdminFees'),
              })}>
              {!I18nManager.isRTL
                ? `${translate('THERE_ARE')} ${translate(
                    'POUND',
                  )} ${formatMoney(+adminFees)} ${translate(
                    'APPLIED_ADMIN_FEES',
                  )} `
                : `${translate('APPLIED_ADMIN_FEES')} ${formatMoney(
                    +adminFees,
                  )} ${translate('POUND')}`}
            </Typography>

            <Typography
              customStyles={() => ({
                text: selectStyle('adminFeesDisclaimer'),
              })}>
              {' ('}
              {translate('CALC_ADMIN_FEES')}
              {')'}
            </Typography>
          </View>
        )}
      </View>
    );
  };

  const renderList = (data, renderItem) => {
    return (
      <View>
        <Typography
          marginBottom={10}
          customStyles={() => ({
            text: selectStyle('inputTitleText'),
          })}>
          {translate('CALC_DURATION')}
        </Typography>

        <DefaultFlatList
          isFetchingData={false}
          horizontal
          style={{paddingHorizontal: wp(20)}}
          flatListProps={{
            horizontal: true,
            showsHorizontalScrollIndicator: false,
            data: data ? data : [],
            renderItem: renderItem,
          }}
        />
      </View>
    );
  };

  const renderMonths = ({item}) => {
    const id = months;

    return (
      <View style={{paddingVertical: 1, marginEnd: hp(10)}}>
        <Pressable
          onPress={() => {
            setMonths(item + '');
          }}
          style={[
            selectStyle('itemContainer'),
            id === item?.toString() && {
              backgroundColor: common.darkBlue,
            },
          ]}>
          <Typography
            customStyles={() => ({
              text: {
                ...selectStyle('itemText'),
                color: id === item?.toString() ? common.white : common.darkBlue,
              },
            })}>
            {`${item} ${translate('MONTHS')}`}
          </Typography>
        </Pressable>
      </View>
    );
  };

  const renderMonthsList = () => {
    return renderList([12, 24, 36, 48, 60], renderMonths);
  };

  const renderInstallmentAmount = () => {
    return (
      <View style={selectStyle('amountContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('amountTitle'),
          })}>
          {translate('PRODUCT_INSTALLMENT')}
        </Typography>

        <Typography
          customStyles={() => ({
            text: selectStyle('amountValue'),
          })}>
          {combineMoneyCurrency(+installmentValue)} {translate('PER_MONTH')}
        </Typography>
      </View>
    );
  };

  const renderBackButton = () => {
    return (
      <View
        style={{
          transform: [{scaleX: -1}],
          height: hp(100),
        }}>
        <ContinueButton
          onContinuePressed={() => {
            navigation.navigate('manageCredit');
          }}
          completeForm={false}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FloatingActionButton bot={hp(60)} />

      <ScrollView>
        <NavigationHeader showLogo shapeVariant="orange" hideBack />

        {renderPriceInput()}

        {renderMonthsList()}

        {amount && months && installmentValue
          ? renderInstallmentAmount()
          : null}
      </ScrollView>

      {renderBackButton()}

      {loading && <DefaultOverLayLoading />}
    </View>
  );
};

export const Calculator = baseScreen(calculator, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
