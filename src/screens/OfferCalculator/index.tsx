import React, {useEffect, useState} from 'react';
import {Alert, I18nManager, Pressable, ScrollView} from 'react-native';
import {View} from 'native-base';
import {useRoute} from '@react-navigation/native';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {
  combineMoneyCurrency,
  formatMoney,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import DefaultTextInput from 'src/components/DefaultTextInput';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {ContinueButton} from 'components';
import {baseScreen} from 'hoc';
import styles from './styles';

const offerCalculator: React.FC = () => {
  const {offer} = (useRoute().params as {offer?: any}) || {};

  const [installmentValue, setInstallmentValue] = useState<string>(null);
  const [amountValue, setAmountValue] = useState<string>(null);
  const [adminFees, setAdminFees] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [months, setMonths] = useState<string>('');
  const [productPriceError, setProductPriceError] = useState<string>('');

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
      if (months && amountValue && productPriceError == '') {
        try {
          setLoading(true);
          const response = await stores.backend.products.offerCalculatorResult({
            amount: +amountValue,
            tenors: +months,
            offerId: +offer?.id,
          });
          setInstallmentValue(response?.installmentValue);
          setAdminFees('' + response?.adminFees);
        } catch ({response}) {
          response?.status !== 401
            ? Alert.alert('', translate('ERROR'), [
                {text: translate('GENERIC_CONFIRM')},
              ])
            : null;
        } finally {
          setLoading(false);
        }
      }
      if (!amountValue) {
        setInstallmentValue(null);
        setAdminFees(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [months, amountValue]);

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
          editable={!loading}
          value={amountValue}
          textInputStyle={selectStyle('inputStyle')}
          placeholder={translate('PRICE_PLACEHOLDER')}
          onchangeText={value => {
            setAmountValue(value);
            setProductPriceError(
              isNaN(value) &&
                tempTranslate(
                  'product price must be numbers only',
                  'يجب ان تكون قيمة المنتج ارقام فقط',
                ),
            );
          }}
          inputContainer={selectStyle('inputContainer')}
        />
        {productPriceError?.length > 0 && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}>
            {productPriceError}
          </Typography>
        )}
        {adminFees && installmentValue && (
          <Typography
            customStyles={() => ({
              text: selectStyle('adminFeesDisclaimer'),
            })}>
            {!I18nManager.isRTL
              ? `${translate('APPLIED_ADMIN_FEES')} of ${translate(
                  'POUND',
                )} ${formatMoney(+adminFees)} ${translate('ARE_APPLIED')} `
              : `${translate('ADMIN_FEES_APPLIED')} ${formatMoney(
                  +adminFees,
                )} ${translate('POUND')}`}
          </Typography>
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
            navigation.goBack();
          }}
          completeForm={true}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <NavigationHeader showLogo shapeVariant="orange" hideBack />
        {renderPriceInput()}

        {renderList(offer?.tenors, renderMonths)}

        {amountValue && months && installmentValue
          ? renderInstallmentAmount()
          : null}
      </ScrollView>

      {renderBackButton()}

      {loading && <DefaultOverLayLoading />}
    </View>
  );
};

export const OfferCalculator = baseScreen(offerCalculator, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
