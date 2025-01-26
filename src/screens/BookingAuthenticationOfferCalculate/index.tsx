import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Pressable,
  Dimensions,
  FlatList,
  Alert,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import DefaultDropdown from 'src/components/DefaultDropdown';
import DefaultButton from 'src/components/DefaultButton';
import {returnCredit, tempTranslate} from 'src/utils/HelpersFunctions';
import {getCurrency} from 'src/utils/HelpersFunctions';
import DefaultModal from 'src/components/DefaultModal';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import {BalanceInterface} from 'src/Types';

const bookingAuthenticationOfferCalculate = ({route}) => {
  const {merchant, type, offer, saved, savedData, recentlyViewedData} =
    route.params || {};
  const navigation = useNavigationUtils();
  const stores = useStores();
  const {translate} = useLocalization();
  const isRTL = I18nManager.isRTL;

  const [branch, setBranch] = useState('');
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    savedData?.tenorId ? savedData?.tenorId : null,
  );
  const [selectedDuration, setSelectedDuration] = useState('');
  const [productName, setProductName] = useState(
    savedData ? savedData?.productName : '',
  );

  const [loanAmount, setLoanAmount] = useState(
    savedData ? savedData.loanAmount.toString() : '',
  );
  const [tenorsData, setTenorsData] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [selectedTenor, setSelectedTenor] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState(null);
  const [feesAmount, setFeesAmount] = useState(null);
  const [error, setError] = useState('');
  const [imageUri, setImageUri] = useState(
    offer?.details?.image ||
      merchant?.image ||
      merchant?.imageUrl ||
      offer?.merchantImage ||
      savedData?.merchantImageURL ||
      offer?.imageUrl ||
      recentlyViewedData?.imageUrl,
  );
  const [editingLoanAmount, setEditingLoanAmount] = useState(false);

  const {selectStyle} = useStyles(styles);

  const {
    images: {
      screens: {creditech, home},
    },
  } = Assets;

  const {
    theme: {
      palette: {common, primary},
    },
  } = useTheme();

  const userCredit = stores.backend.users.userCredits.data;
  const user = stores.backend.users?.userData;
  const offerId = offer?.details?.id || offer?.merchantId || offer?.id;
  const branchDropdownData =
    branchData
      ?.filter(
        branchItem =>
          branchItem && branchItem.branchId && branchItem.branchTitle,
      )
      .map(branchItem => ({
        value: branchItem.branchId,
        label: branchItem.branchTitle,
      })) || [];

  const balance: BalanceInterface = returnCredit(userCredit);
  const selectedBranchName =
    branchDropdownData.find(item => item.value === branch)?.label || '';

  useEffect(() => {
    setSelectedDuration(
      branch
        ? tempTranslate('Select one', 'اختر واحد')
        : savedData
        ? savedData?.tenorTitle
        : tempTranslate('Select one', 'اختر واحد'),
    );
    setSelectedIndex(branch ? null : savedData ? savedData?.tenorTitle : null);
  }, [branch, savedData]);

  useEffect(() => {
    if (
      merchant?.id ||
      savedData?.merchantId ||
      offerId ||
      recentlyViewedData?.code
    ) {
      stores.backend.bookingAuth
        .merchantBranchesData(
          (recentlyViewedData?.type === 'offer'
            ? recentlyViewedData?.details?.id?.toString()
            : recentlyViewedData?.code) ||
            merchant?.id.toString() ||
            savedData?.merchantId.toString() ||
            offerId?.toString(),
        )
        .then(item => {
          setBranchData(item);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      if (branch || savedData?.branchId) {
        setLoading(true);
        stores.backend.bookingAuth
          .merchantTenorsData(
            (recentlyViewedData?.type === 'offer'
              ? recentlyViewedData?.details?.id?.toString()
              : recentlyViewedData?.code) ||
              merchant?.id.toString() ||
              savedData?.merchantId.toString() ||
              offerId?.toString(),
            branch || savedData?.branchId,
          )
          .then(item => {
            setTenorsData(item);
            setLoading(false);
          })
          .catch(() => {});
      }
    } else {
      setLoading(false);
    }
  }, [
    merchant?.id,
    branch,
    savedData?.merchantId,
    offerId,
    recentlyViewedData?.code,
  ]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (loanAmount && (branch || savedData?.branchId || selectedDuration)) {
      const timer = setTimeout(() => {
        handleInstallmentCalculation();
      }, 300);

      setDebounceTimer(timer);
    }

    return () => clearTimeout(debounceTimer);
  }, [loanAmount, branch, savedData?.branchId, selectedDuration]);

  useEffect(() => {
    async function handleRecentlyViewCreate() {
      const recentlyViewCreateType = type;
      try {
        const type = recentlyViewCreateType || 'offer';
        const imageUrl =
          merchant?.image ||
          merchant?.imageUrl ||
          offer?.merchantImage ||
          savedData?.merchantImageURL ||
          offer?.imageUrl ||
          'http://example.com/detail-image.jpg';
        const name =
          merchant?.title ||
          offer?.merchantName ||
          savedData?.merchantTitle ||
          offer?.name ||
          (isRTL ? merchant?.title_Ar : merchant?.title_En);

        const code = (merchant?.id || offer?.id) + '';
        const expiryDate = offer?.expiryDate;
        const details = {
          id: (merchant?.id || savedData?.merchantId || offerId) + '',
          name: name,
          image: imageUrl,
        };

        await stores.backend.bookingAuth.recentlyViewCreate(
          type,
          imageUrl,
          name,
          code,
          expiryDate,
          details,
        );
      } catch (error) {
        console.error('Error in recentlyViewCreate:', error);
      }
    }

    handleRecentlyViewCreate();
  }, []);

  const disabled =
    !branch ||
    !selectedDuration ||
    !productName ||
    !loanAmount ||
    !installmentAmount ||
    !feesAmount ||
    !selectedIndex ||
    error;

  const handleInstallmentCalculation = async () => {
    if (error || !selectedIndex) {
      return;
    } else if (branch || tenorsData) {
      try {
        setLoading(true);

        const response =
          await stores.backend.bookingAuth.merchantCalcInstallment(
            merchant?.id?.toString() ||
              offer?.merchantId?.toString() ||
              savedData?.merchantId?.toString() ||
              offer?.details?.id?.toString() ||
              (recentlyViewedData?.type === 'offer'
                ? recentlyViewedData?.details?.id?.toString()
                : recentlyViewedData?.code),
            branch || savedData?.branchId,
            user?.nationalId,
            loanAmount,
            selectedTenor?.offerId || savedData?.offerId || '0',
            selectedTenor?.tenorId || savedData?.tenorId,
          );
        setInstallmentAmount(response.installmentAmount);
        setFeesAmount(response.serviceTotalFees);
      } catch (error) {
        console.error(error);
        Alert.alert(
          translate('NATIONAL_ID_ERROR_TITLE'),
          error?.message,
          [
            {
              text: translate('GENERIC_CONFIRM'),
              // onPress: () => navigation.goBack(),
            },
          ],
          {cancelable: false},
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const navigateToScreenWithParams = async (screenName, params) => {
    navigation.navigate(screenName, {params});
  };

  const handelBookingSubmit = async statusType => {
    try {
      setLoading(true);
      const merchantId =
        merchant?.id?.toString() ||
        offer?.merchantId?.toString() ||
        savedData?.merchantId?.toString() ||
        offer?.details?.id?.toString() ||
        (recentlyViewedData?.type === 'offer'
          ? recentlyViewedData?.details?.id?.toString()
          : recentlyViewedData?.code);
      const branchId = branch || savedData.branchId;
      const nationalId = user?.nationalId || '22222222222222';
      const offerId = selectedTenor?.offerId || savedData.offerId;
      const tenorId = selectedTenor?.tenorId || savedData.tenorId;
      const status = statusType;

      const merchantTitle =
        merchant?.title ||
        offer?.merchantName ||
        merchant?.title_En ||
        merchant?.title_Ar ||
        merchant?.name ||
        recentlyViewedData?.details?.name ||
        recentlyViewedData?.name ||
        offer?.name;

      const data = saved
        ? await stores.backend.bookingAuth.bookingUpdate(
            merchantId,
            branchId,
            nationalId,
            loanAmount || String(savedData?.loanAmount),
            offerId,
            tenorId,
            installmentAmount || String(savedData?.installmentAmount),
            feesAmount || String(savedData?.serviceTotalFees),
            productName || savedData?.productName,
            status,
            savedData?.bookingRequestId || '22',
          )
        : await stores.backend.bookingAuth.bookingSubmit(
            merchantId,
            branchId,
            nationalId,
            loanAmount,
            offerId,
            tenorId,
            installmentAmount,
            feesAmount,
            productName,
            status,
          );

      const bookingRequestId = data?.bookingRequestId;

      let params = {
        merchantTitle: saved ? savedData?.merchantTitle : merchantTitle,
        branchName: saved ? savedData?.branchName : selectedBranchName,
        branchId: branchId,
        nationalId: nationalId,
        loanAmount: loanAmount,
        offerTitle:
          selectedTenor?.offerTitle.length > 0
            ? selectedTenor?.offerTitle
            : ' ',
        selectedDuration: selectedDuration,
        installmentAmount: installmentAmount,
        feesAmount: feesAmount,
        productName: productName,
        status: status,
        bookingRequestId: saved
          ? savedData?.bookingRequestId
          : bookingRequestId,
      };

      navigateToScreenWithParams('orderSummary', params);
    } catch (error) {
      console.error(error);
      // setShowAlert(true)
      Alert.alert(
        translate('NATIONAL_ID_ERROR_TITLE'),
        tempTranslate(
          'We regret to inform you that the offer you saved is no longer valid. To continue with your purchase, please choose a new installment plan that suits your needs.',
          'نأسف لإبلاغك بأن العرض الذي قمت بحفظه قد انتهى صلاحيته, يرجى اختيار خطة تقسيط جديدة.',
        ),
        [
          {
            text: translate('GENERIC_CONFIRM'),
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: false},
      );
    } finally {
      setLoading(false);
    }
  };

  const openDuration = () => {
    if (branch || savedData?.branchId) {
      setModalVisible(true);
    } else {
      Alert.alert(
        '',
        tempTranslate(
          'Please select a branch first.',
          'يجب عليك اختيار الفرع أولاً',
        ),
        [
          {
            text: translate('GENERIC_CONFIRM'),
          },
        ],
      );
    }
  };

  const handleInputChange = text => {
    const numericValue = parseFloat(text) || 0;

    if (numericValue < 200 && text !== '') {
      setError(translate('AMOUNT_LEAST_LIMIT'));
    } else if (balance?.amount < numericValue) {
      setError(translate('LOAN_AMOUNT_EXCEED'));
    } else {
      setError('');
    }
    setLoanAmount(text);
  };

  const OfferCalculateHeader = () => (
    <View style={{flexDirection: 'row', alignItems: 'center', maxWidth: '90%'}}>
      <FastImage
        source={{
          uri: imageUri,
        }}
        style={{
          width: wp(72),
          height: hp(72),
          borderRadius: 16,
          borderWidth: 1,
          borderColor: common.cardGray,
          backgroundColor: common.white,
        }}
        resizeMode="contain"
      />
      <Typography
        style={{
          fontSize: 18,
          fontWeight: '700',
          lineHeight: 25,
          color: common.black,
          marginStart: hp(12),
        }}>
        {(isRTL ? merchant?.title_Ar : merchant?.title_En) ||
          (merchant?.title ? merchant?.title : merchant?.name) ||
          offer?.merchantName ||
          offer?.name ||
          savedData?.merchantTitle ||
          offer?.details?.name}
        {/* {offer?.details?.name} */}
        {recentlyViewedData?.name}
      </Typography>
    </View>
  );

  const SelectDuration = () => {
    return (
      <Pressable style={{marginTop: 16}} onPress={openDuration}>
        <Typography
          style={{
            alignSelf: 'flex-start',
            fontSize: 14,
            fontWeight: '500',
            color: common.black,
            marginBottom: 4,
            lineHeight: 24,
          }}>
          {translate('SELECT_DURATION')}
        </Typography>
        <View style={[selectStyle('SelectDurationView')]}>
          <Typography style={selectStyle('SelectDurationText')}>
            {selectedDuration}
            {/* {`${selectedDuration} Months`} */}
          </Typography>
          <SvgView
            svgFile={modalVisible ? creditech.UpArrow : creditech.DownArrow}
            width={12}
            height={6}
            fill="grey"
          />
        </View>
      </Pressable>
    );
  };

  const renderCards = ({item, index}) => {
    const isSelected = selectedIndex === item.tenorId;
    return (
      <Pressable
        style={{
          width: '100%',
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
          borderRadius: 8,
        }}
        onPress={() => {
          setSelectedIndex(item.tenorId);
          setSelectedDuration(item.tenorTitle);
          setSelectedTenor(item);
          setModalVisible(false);
        }}>
        <View>
          <Typography
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: common.black,
              lineHeight: 24,
            }}>
            {item.tenorTitle}
          </Typography>
          {item.offerTitle ? (
            <Typography
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: common.blueGray,
                lineHeight: 24,
              }}>
              {item.offerTitle}
            </Typography>
          ) : null}
        </View>
        <View
          style={{
            width: 18,
            height: 18,
            borderWidth: 1,
            borderColor: isSelected ? '#FD8326' : common.cardGray,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: isSelected ? '#FD8326' : null,
              borderRadius: 20,
            }}
          />
        </View>
      </Pressable>
    );
  };

  const AmountCard = ({title, amountNumber}) => {
    return (
      <View
        style={{
          width: '100%',
          padding: 16,
          backgroundColor: common.white,
          marginTop: 16,
          borderRadius: 12,
        }}>
        <Typography
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: common.otherBlue,
            lineHeight: 16,
          }}>
          {title}
        </Typography>
        <Typography
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: common.black,
            lineHeight: 32,
            marginTop: 8,
          }}>
          {amountNumber}
        </Typography>
      </View>
    );
  };

  const FooterBottom = () => {
    if (!editingLoanAmount) {
      return saved ? (
        <View
          style={{
            width: Dimensions.get('window').width,
            backgroundColor: common.white,
            padding: 16,
            paddingBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DefaultButton
            titleStyle={{fontSize: hp(12)}}
            title={translate('PROCEED')}
            onPress={() =>
              !selectedIndex
                ? Alert.alert('please select duration')
                : handelBookingSubmit('pending')
            }
            buttonStyle={[selectStyle('ProceedButtonStyle')]}
          />
        </View>
      ) : (
        <View
          style={{
            width: Dimensions.get('window').width,
            backgroundColor: common.white,
            padding: 16,
            paddingBottom: 20,
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
          }}>
          <DefaultButton
            titleStyle={{fontSize: hp(12)}}
            variant="secondaryBackground"
            title={translate('PROFILE_SAVE')}
            onPress={() => handelBookingSubmit('saved')}
            buttonStyle={[selectStyle('buttonStyle')]}
          />

          <DefaultButton
            titleStyle={{fontSize: hp(12)}}
            // variant="secondaryBackgroundDarkText"
            // title={translate('QUICK_PAY')}
            title={translate('PROCEED')}
            onPress={() => handelBookingSubmit('pending')}
            buttonStyle={[
              selectStyle('buttonStyle'),
              {backgroundColor: disabled ? common.gainsboro : '#FD8326'},
            ]}
            titleStyles={{
              color: disabled ? '#3e454f' : common.white,
            }}
          />
        </View>
      );
    }
  };

  const AlertSection = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: '#FDF6E7',
          marginTop: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 80,
        }}>
        <SvgView
          svgFile={creditech.lampCharge}
          width={20}
          height={20}
          // fill="grey"
          style={{alignSelf: 'flex-start'}}
        />
        <Typography
          style={{
            marginHorizontal: 10,
            fontSize: 12,
            fontWeight: '500',
            color: '#F79009',
            lineHeight: 16,
          }}>
          {translate('ALERT_BOOKING_AUTH')}
        </Typography>
      </View>
    );
  };

  if (balance?.amount < 100) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Typography
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: common.black,
            marginBottom: hp(20),
          }}>
          {tempTranslate(
            'Sorry, the service is not available for you.',
            'نأسف، هذه الخدمة غير متاحة لك.',
          )}
        </Typography>
        <DefaultButton
          title={translate('GENERIC_CONFIRM')}
          onPress={() => navigation.navigate('home')}
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollContainerWithNavHeader
          title={translate('BUY_NOW')}
          shapeVariant="orange"
          removeCapitalization
          scrollViewStyle={{padding: hp(24)}}>
          <OfferCalculateHeader />
          <View style={[selectStyle('dropdownView')]}>
            <Typography
              style={{
                alignSelf: 'flex-start',
                fontSize: 14,
                fontWeight: '500',
                color: common.black,
                marginBottom: 4,
                lineHeight: 24,
              }}>
              {translate('BRANCH')}
            </Typography>
            <DefaultDropdown
              data={branchDropdownData}
              value={branch}
              placeholder={
                savedData
                  ? savedData?.branchName
                  : tempTranslate('Select', 'اختر')
              }
              onChange={item => setBranch(item)}
              dropDownStyle={selectStyle('dropdownSty')}
              style={selectStyle('dropdownSty')}
              // buttonTextStyle
              buttonTextStyle={{maxWidth:"95%"}}
            />
          </View>

          <SelectDuration />
          <View style={{width: '100%', marginTop: 16}}>
            <Typography
              style={{
                fontSize: 14,
                fontWeight: '500',
                lineHeight: 24,
                color: common.black,
              }}>
              {translate('PRODUCT_NAME')}
            </Typography>
            <DefaultTextInput
              placeHolder={translate('PRODUCT_NAME')}
              value={productName}
              // onChangeText={text => setProductName(text)}
              onChangeText={text => {
                const trimmedText = text.replace(/^\s+/, '');
                if (trimmedText.length <= 30) {
                  setProductName(trimmedText);
                }
              }}
              viewStyle={{width: '100%', marginTop: 4, marginHorizontal: 0}}
              inputContainer={{
                borderRadius: 99,
                borderColor: common.cardGray,
                backgroundColor: 'white',
              }}
              textInputStyle={{color: 'black'}}
            />
          </View>
          <View style={{width: '100%', marginTop: 16}}>
            <Typography
              style={{
                fontSize: 14,
                fontWeight: '500',
                lineHeight: 24,
                color: common.black,
              }}>
              {translate('LOAN_AMOUNT')}
            </Typography>
            <DefaultTextInput
              placeHolder={`${translate('POUND')} 0.00`}
              keyboardType="numeric"
              value={loanAmount}
              onFocus={() => setEditingLoanAmount(true)}
              onEndEditing={() => setEditingLoanAmount(false)}
              onChangeText={handleInputChange}
              maxLength={30}
              viewStyle={{width: '100%', marginTop: 4, marginHorizontal: 0}}
              inputContainer={{
                borderRadius: 99,
                borderColor: common.cardGray,
                backgroundColor: 'white',
              }}
              textInputStyle={{color: 'black'}}
              contextMenuHidden={true}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'v' && nativeEvent.ctrlKey) {
                  return false;
                }
              }}
            />
            {error ? (
              <Typography
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 24,
                  color: common.red,
                }}>
                {error}
              </Typography>
            ) : null}
          </View>
          {installmentAmount || savedData?.installmentAmount ? (
            <AmountCard
              title={translate('PRODUCT_INSTALLMENT')}
              amountNumber={`${getCurrency()} ${
                installmentAmount || savedData?.installmentAmount
              }`}
            />
          ) : null}
          {feesAmount || savedData?.serviceTotalFees ? (
            <AmountCard
              title={translate('SERVICE_FEES')}
              amountNumber={`${getCurrency()} ${
                feesAmount || savedData?.serviceTotalFees
              }`}
            />
          ) : null}
          <AlertSection />
          {/* <View style={{marginBottom: hp(80), width: '100%'}} /> */}
        </ScrollContainerWithNavHeader>
        {disabled && !savedData ? null : <FooterBottom />}
      </KeyboardAvoidingView>
      <DefaultModal
        isVisible={modalVisible}
        onCloseModal={() => setModalVisible(false)}
        bottom
        ViewContainerStyle={{backgroundColor: '#F8FAFC', maxHeight: '90%'}}>
        <Typography
          textAlign="center"
          style={{fontSize: 16, fontWeight: '700', color: common.black}}>
          {translate('SELECT_DURATION')}
        </Typography>
        <FlatList
          style={{width: '100%', paddingBottom: 16}}
          data={tenorsData ? tenorsData : []}
          renderItem={renderCards}
          // keyExtractor={(item) => item.id.toString()}
        />
      </DefaultModal>
      {loading && <DefaultOverLayLoading />}
    </View>
  );
};

export const BookingAuthenticationOfferCalculate = baseScreen(
  bookingAuthenticationOfferCalculate,
  {
    allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
  },
);
