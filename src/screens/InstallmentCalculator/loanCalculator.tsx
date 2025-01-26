import React, {useState, useEffect} from 'react';
import {Animated, TextInput, View, Pressable} from 'react-native';
import {observer} from 'mobx-react';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {ProductType} from 'src/stores/backend/products';
import {combineMoneyCurrency} from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import DefaultModal from 'src/components/DefaultModal';
import RowView from 'src/components/Wrappers/RowView';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {LoanCalculatorProps} from 'src/Types';
import {LoadingState} from 'utils';
import styles from './styles';
import numbro from 'numbro';

// const numbro = require('numbro');

export const ProductLoanCalculator: React.FC<LoanCalculatorProps> = observer(
  (props: LoanCalculatorProps) => {
    const [amountValue, setAmountValue] = useState<number | null>(null);
    const [allowDownPayment, setAllowDownPayment] = useState<boolean>(false);
    const [availableMonths, setAvailableMonths] = useState<number[]>([]);
    const [keyboardAnimationProgress] = useState(new Animated.Value(0));
    const [loanPackageData, setLoanPackageData] = useState<{}>(null);
    const [downPaymentPercentage, setdownPaymentPercentage] =
      useState<number>();
    const [downPaymentValue, setDownPaymentValue] = useState<number | null>(
      null,
    );
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loanPackage, setPackage] = useState<string>('');
    const [months, setMonths] = useState<string>('');

    const amount =
      amountValue && !Number.isNaN(amountValue)
        ? numbro(amountValue).format({
            thousandSeparated: true,
          })
        : '';

    const {selectStyle} = useStyles(styles);
    const navigation = useNavigationUtils();
    const {translate} = useLocalization();
    const stores = useStores();

    const loanPackagesLoading =
      stores.backend.products.loanPackages.loadingState ===
      LoadingState.LOADING;
    const valueLoading =
      stores.backend.products.loanResult.loadingState === LoadingState.LOADING;
    const productPath = stores.backend.products.currentProduct;
    const {controlLoginModalView} = stores.backend.users;
    const isAutoOrTrucks = ['Auto', 'Trucks']?.includes(
      stores.backend.products.currentProduct,
    );

    const downPayment =
      downPaymentValue && !Number.isNaN(downPaymentValue)
        ? numbro(downPaymentValue).format({
            thousandSeparated: true,
          })
        : '';

    const {
      theme: {
        palette: {common},
      },
    } = useTheme();

    useEffect(() => {
      const initData = async () => {
        try {
          await stores.backend.products.loanPackages.updateOptions({
            productId: props.productId,
          });
        } catch (error) {
          console.error('Err is : : : ', error.errorMessage);
        }
      };

      initData();

      ApplicationAnalytics(
        {
          eventKey: 'installment_calculator',
          type: 'CTA',
          parameters: {name: stores.backend.products?.currentProduct},
        },
        stores,
      );
    }, [props.productId]);

    const getLoanDownPayment = (loan: string | number | string[]) => {
      const currentLoanPackage = stores.backend.products.loanPackages.data.find(
        item => item.packageId === Number(loan),
      );
      if (currentLoanPackage) {
        setdownPaymentPercentage(Number(currentLoanPackage.downPayment));
      }
    };

    const getLoanDownPaymentAllowness = (loan: string | number | string[]) => {
      const currentLoanPackage = stores.backend.products.loanPackages.data.find(
        item => item.packageId === Number(loan),
      );
      if (currentLoanPackage) {
        if (currentLoanPackage.allowDownPayment === 1) {
          setAllowDownPayment(true);
        }
        if (currentLoanPackage.allowDownPayment === 0) {
          setAllowDownPayment(false);
        }
      }
    };

    const changePackageMonths = (value: string | number | string[]) => {
      stores.backend.products.loanPackages.data?.forEach(item => {
        if (value === item.packageId?.toString()) {
          const monthsArray = [];
          for (let x = item.minTenor; x <= item.maxTenor; x += 12) {
            monthsArray.push(x);
          }
          setAvailableMonths(monthsArray);
        }
      });
    };

    useEffect(() => {
      if (stores.backend.products.currentProduct === 'Finishing') {
        setPackage(
          stores.backend.products.loanPackages.data[0]?.packageId.toString(),
        );
        setLoanPackageData(stores.backend.products.loanPackages.data[0]);
        setAvailableMonths([6, 12, 24, 36, 48, 60]);
        getLoanDownPaymentAllowness(loanPackage);
        getLoanDownPayment(loanPackage);
      } else if (stores.backend.products.currentProduct === 'Shopping') {
        setPackage(
          stores.backend.products.loanPackages.data[0]?.packageId?.toString(),
        );
        setLoanPackageData(stores.backend.products.loanPackages.data[0]);
        setAvailableMonths([6, 12, 18, 24, 36]);
        getLoanDownPaymentAllowness(loanPackage);
        getLoanDownPayment(loanPackage);
      }
    }, [stores.backend.products.loanPackages.data]);

    const getLoanResult = async (
      m: number,
      p: number,
      a: number,
      d?: number,
    ) => {
      if (p <= 0) {
        p = stores.backend.products.loanPackages.data[0]?.packageId;
      }
      await stores.backend.products.loanResult.updateOptions({
        tenors: m,
        packageId: p,
        amount: a,
        downPayment: d,
      });
    };

    const handleChangeAmount = (text: string) => {
      if (text.length === 0) {
        setAmountValue(null);
      } else if (!Number.isNaN(Number(text.replace(/,/g, '')))) {
        setAmountValue(Number(text.replace(/,/g, '')));
      }
    };

    const loanAmountPlaceholder = (product: ProductType) => {
      if (product === 'Auto') {
        return translate('AUTO_LOAN_AMOUNT_PLACE_HOLDER');
      }
      if (product === 'Trucks') {
        return translate('TRUCKS_LOAN_AMOUNT_PLACE_HOLDER');
      }
      if (product === 'Mortgage') {
        return translate('MORTGAGE_LOAN_AMOUNT_PLACE_HOLDER');
      }
      return translate('LOAN_AMOUNT_PLACEHOLDER');
    };

    const handleChangeDownPayment = (text: string) => {
      if (text.length === 0) {
        setDownPaymentValue(null);
      } else if (!Number.isNaN(Number(text.replace(/,/g, '')))) {
        setDownPaymentValue(Number(text.replace(/,/g, '')));
      }
    };

    const isFormValid = () =>
      months.length > 0 && amountValue && amountValue > 0;

    useEffect(() => {
      let debounceTimeoutId: any;
      const handleDebouncedGetLoanResult = async () => {
        if (isFormValid()) {
          await getLoanResult(
            parseInt(months),
            parseInt(loanPackage),
            amountValue || 0,
            downPaymentValue || 0,
          );
        }
      };
      const debounce = (func: () => {}, delay: number) => {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(func, delay);
      };
      amountValue != downPaymentValue
        ? debounce(handleDebouncedGetLoanResult, 700)
        : null;
      return () => {
        clearTimeout(debounceTimeoutId);
      };
    }, [months, loanPackage, amountValue, downPaymentValue]);

    const resultAmountValue =
      stores.backend.products.loanResult.data?.amount ?? null;

    const resultAmount =
      resultAmountValue && !Number.isNaN(resultAmountValue)
        ? numbro(resultAmountValue).format({
            thousandSeparated: true,
          })
        : '';

    useEffect(() => {
      if (resultAmountValue && resultAmountValue > 0 && downPayment !== null) {
      } else {
        if (amountValue < downPaymentValue) {
          setShowModal(true);
        }
      }
    }, [resultAmountValue, downPayment, amountValue]);

    const renderloanResultDisclaimer = () => {
      return (
        <View style={selectStyle('loanResultDisclaimerContainer')}>
          <Typography>{translate('CALC_DISCLAIMER')}</Typography>
        </View>
      );
    };

    const onApply = () => {
      navigation.navigate('requestMoreInfoScreen', {
        programId:
          props?.product?.type !== 'product' ? props.product?.id : null,
        calculatorData: {
          plan: loanPackageData,
          duration: +months,
          amount: amountValue,
          installmentValue: resultAmountValue,
          downPayment: downPaymentValue ?? null,
        },
      });
    };

    const validateDownPayment = () => {
      return (
        downPaymentValue !== null &&
        amountValue &&
        downPaymentPercentage &&
        downPaymentValue >= amountValue * (downPaymentPercentage / 100) &&
        downPaymentValue < amountValue
      );
    };

    const renderApplyButton = () => {
      const {product} = props;
      if (product?.title !== 'Shopping' && product?.title !== 'Finishing') {
        if (isFormValid() && resultAmountValue) {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: hp(20),
              }}>
              <DefaultButton
                loading={loanPackagesLoading || valueLoading}
                disabled={
                  allowDownPayment && downPaymentValue !== null
                    ? !validateDownPayment()
                    : false
                }
                onPress={() =>
                  controlLoginModalView(true, () => {
                    ApplicationAnalytics(
                      {
                        eventKey: 'installment_calculator_apply',
                        type: 'CTA',
                        parameters: {
                          name: stores.backend.products?.currentProduct,
                        },
                      },
                      stores,
                    );
                    onApply();
                  })
                }
                title={translate('APPLY_NOW_C')}
              />
            </View>
          );
        }
      } else {
        return null;
      }
    };

    const renderInstallmentValue = () => (
      <View>
        <Typography
          customStyles={() => ({
            text: selectStyle('installmentText'),
          })}>
          {translate('INSTALLMENT_AMOUNT')}
        </Typography>

        <Typography
          customStyles={() => ({
            text: selectStyle('installmentAmountText'),
          })}>
          {`${
            amountValue === downPaymentValue
              ? 0
              : combineMoneyCurrency(resultAmount)
          }`}
        </Typography>
      </View>
    );

    const handlePackageChange = (value: string | number | string[]) => {
      getLoanDownPayment(value);

      changePackageMonths(value);

      getLoanDownPaymentAllowness(value);

      setPackage(value);
    };

    const renderMonths = ({item}) => {
      const id = months;

      return (
        <DropShadowWrapper me={10} style={{paddingVertical: 1}}>
          <Pressable
            onPress={() => {
              ApplicationAnalytics(
                {
                  eventKey: 'installment_calculator_chosen_tenor',
                  type: 'CTA',
                  parameters: {
                    name: stores.backend.products?.currentProduct,
                    tenor: item,
                  },
                },
                stores,
              );

              setMonths(item + '');
            }}
            style={[
              selectStyle('itemContainer'),
              id === item?.toString() && {
                backgroundColor: common.darkOrange,
              },
            ]}>
            <Typography
              customStyles={() => ({
                text: {
                  ...selectStyle('itemText'),
                  color:
                    id === item?.toString() ? common.white : common.darkBlue,
                },
              })}>
              {`${item} ${translate('MONTHS')}`}
            </Typography>
          </Pressable>
        </DropShadowWrapper>
      );
    };

    const renderPackages = ({item}) => {
      return (
        <DropShadowWrapper me={10} style={{paddingVertical: 1}}>
          <Pressable
            onPress={() => {
              ApplicationAnalytics(
                {
                  eventKey: 'installment_calculator_chosen_plan',
                  type: 'CTA',
                  parameters: {
                    name: stores.backend.products?.currentProduct,
                    ...item,
                  },
                },
                stores,
              );
              handlePackageChange(item.packageId?.toString());
              setLoanPackageData(item);
            }}
            style={[
              selectStyle('itemContainer'),
              loanPackage === item.packageId?.toString() && {
                backgroundColor: common.darkOrange,
              },
            ]}>
            <Typography
              customStyles={() => ({
                text: {
                  ...selectStyle('itemText'),
                  color:
                    loanPackage === item.packageId?.toString()
                      ? common.white
                      : common.darkBlue,
                },
              })}>
              {item?.title}
            </Typography>
          </Pressable>
        </DropShadowWrapper>
      );
    };

    const renderList = (data, renderItem, title, mt: number) => {
      return (
        <View style={{marginTop: hp(mt)}}>
          <Typography
            marginBottom={10}
            customStyles={() => ({
              text: selectStyle('titleText'),
            })}>
            {title}
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
              extraData: [loanPackage, months],
            }}
          />
        </View>
      );
    };

    const renderMonthsList = () => {
      return renderList(
        availableMonths,
        renderMonths,
        translate('LOAN_MONTHS_PLACEHOLDER'),
        21,
      );
    };

    const renderPackagesList = () => {
      return renderList(
        stores.backend.products.loanPackages.data,
        renderPackages,
        translate('LOAN_PACKAGE_PLACEHOLDER'),
        42,
      );
    };

    const renderPriceField = () => (
      <View
        style={[
          selectStyle('inputTitleContainer'),
          !allowDownPayment && {justifyContent: 'flex-start', flex: 1},
          {marginStart: wp(20)},
        ]}>
        <Typography
          customStyles={() => ({
            text: selectStyle('inputTitleText'),
          })}>
          {translate('TOTAL_AMOUNT')}
        </Typography>

        <TextInput
          placeholder={loanAmountPlaceholder(productPath)}
          value={amount}
          keyboardType="numeric"
          onChangeText={handleChangeAmount}
          style={[selectStyle('inputStyle')]}
        />
      </View>
    );

    const renderDownPaymentField = () => (
      <>
        <View style={[selectStyle('inputTitleContainer')]}>
          <Typography
            customStyles={() => ({
              text: selectStyle('inputTitleText'),
            })}>
            {translate('DOWN_PAYMENT')}
          </Typography>

          <TextInput
            placeholder={translate('DOWN_PAYMENT_AMOUNT_PLACEHOLDER')}
            value={downPayment}
            keyboardType="numeric"
            onChangeText={handleChangeDownPayment}
            style={selectStyle(
              !!amountValue ? 'inputStyle' : 'inputStyleDisabled',
            )}
            editable={!!amountValue}
          />
        </View>
      </>
    );

    const renderAlertModal = () => {
      return (
        <DefaultModal
          hideModalViewStyle
          isVisible={showModal}
          onCloseModal={() => setShowModal(false)}>
          <View style={selectStyle('modalContainer')}>
            <Typography>{translate('LOAN_CALCULATOR_ERROR_3')}</Typography>

            <DefaultButton
              mt={20}
              onPress={() => {
                setShowModal(false);
                setDownPaymentValue(null);
              }}
              title={translate('GENERIC_CONFIRM')}
              width={200}
              fromModal="loanCalculatorModal"
            />
          </View>
        </DefaultModal>
      );
    };

    const contentCard = () => (
      <View style={selectStyle('loanCardContainer')}>
        <View style={selectStyle('loanBodyContainer')}>
          {stores.backend.products.loanPackages.data?.length >= 1 &&
            renderPackagesList()}

          {availableMonths.length > 0 && renderMonthsList()}

          <RowView style={{alignItems: 'baseline'}} jc="space-around">
            {renderPriceField()}

            {allowDownPayment ? renderDownPaymentField() : null}
          </RowView>

          {!validateDownPayment() && downPaymentPercentage ? (
            <Typography
              variant="body1"
              color="black"
              customStyles={() => ({
                text: selectStyle('loanCalculatorErrorDownPayment'),
              })}>
              {resultAmountValue &&
              resultAmountValue > 0 &&
              downPayment !== null
                ? `${translate(
                    'LOAN_CALCULATOR_ERROR_1',
                  )} ${downPaymentPercentage}% ${translate(
                    'LOAN_CALCULATOR_ERROR_2',
                  )}*`
                : ''}
            </Typography>
          ) : (
            <View />
          )}
          {isFormValid() && resultAmountValue ? renderInstallmentValue() : null}

          {isAutoOrTrucks && isFormValid() && resultAmountValue
            ? renderloanResultDisclaimer()
            : null}
        </View>

        {renderApplyButton()}
      </View>
    );

    return (
      <View>
        {loanPackagesLoading && <DefaultOverLayLoading />}

        {contentCard()}

        {renderAlertModal()}
      </View>
    );
  },
);
