import React, {useCallback, useState} from 'react';
import {View, TextInput, I18nManager, Pressable, Alert} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Form} from 'native-base';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useNavigationUtils, useLocalization, useStores} from 'hooks';
import FormDropdown from 'src/components/FormComponents/formDropdown';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {
  BankForm,
  DigitalFatortyOptionTypes,
  WalletForm,
  WalletTypeOptions,
} from 'src/Types';
import {isAnyValueNull, tempTranslate} from 'src/utils/HelpersFunctions';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import {ContinueButton} from 'components';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import DefaultButton from 'src/components/DefaultButton';
import {set} from 'lodash';

const digitalFatortyBankTransfer = () => {
  const {
    fatortyAmount,
    invoiceNo,
    invoiceUrl,
    invoiceId,
    fatortyAdminFees,
    adminFeesValue,
  } =
    (useRoute().params as {
      fatortyAmount: string;
      invoiceNo: string;
      invoiceUrl: string;
      invoiceId: number;
      fatortyAdminFees;
      adminFeesValue;
    }) || {};

  const [isLoading, setIsLoading] = useState(false);
  const [accountHolder] = useState<string>(null);
  const [bankIban] = useState<string>(null);

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();

  const stores = useStores();
  const {controlLoginModalView, userData} = stores.backend.users;
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await stores.backend.general.branches.fetch();
          await stores.backend.general.bankCodes.fetch();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [stores]),
  );

  const bankCodes = stores?.backend?.general?.bankCodes?.data || [];
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const {
    theme: {palette},
  } = useTheme();

  const formSchema = Yup.object().shape({
    bankName: Yup.string()
      .required()
      .test('len', '', val => val !== ''),
    accountHolder: Yup.string().required(),
    bankIban: Yup.string().required(),
    // .matches(/^EG\d{2}\d{4}\d{4}[A-Z0-9]{13}/)
    // .test('len', 'length', (val) => Boolean(val) && val!.length === 29),
  });

  const onSubmit = async (values: BankForm) => {
    setIsLoading(true);
    try {
      const bankCode = listBanks()?.filter(
        option => option.value === formik.values.bankName,
      )[0]?.bankCode;

      async function verifyPhone(values: WalletForm) {
        try {
          const verifyPhoneCodeRes =
            await stores.backend.auth.verifyPhoneNumber(
              userData.phone.replace(/^\+2/, ''),
              "digitalFatorty",
              "digitalFatorty"
            );
          navigation.navigate('verification', {
            phoneNumber: userData.phone.replace(/^\+2/, ''),
            fromScreen: 'digitalFatortyBankTransfer',
            otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
            fatortyAmount,
            invoiceNo,
            invoiceUrl,
            name: formik.values.accountHolder,
            bankName: formik.values.bankName,
            bankCode,
            accountNumber: formik.values.bankIban,
            invoiceId,
            fatortyAdminFees,
            adminFeesValue,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Error in verification:', error);
          error.response.data.statusCode === 400 &&
            Alert.alert(
              tempTranslate('Error', 'خطأ'),
              tempTranslate(
                'You sent to much, Try Again later',
                'لقد حاولت العديد من المرات الرجاء المحاوله في وقت لاحق',
              ),
              [{text: translate('GENERIC_CONFIRM')}],
            );
        }
      }
      verifyPhone({
        nID: userData?.nationalId,
        mobileNumber: userData.phone.replace(/^\+2/, ''),
      });
      formik.isSubmitting === false && setIsLoading(false);

      if (formik.isSubmitting) {
        formik.resetForm();
      }
    } catch (e) {
      setIsLoading(false);
      Alert.alert('', translate('ERROR'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    }
  };

  const formik = useFormik({
    initialValues: {
      bankName: null,
      accountHolder: accountHolder,
      bankIban: bankIban,
    },
    onSubmit,
    validationSchema: formSchema,
    enableReinitialize: true,
    validateOnMount: true,
    initialErrors: {},
  });

  const listBanks = () => {
    return bankCodes?.map(
      (bank: {
        bankName: {ar: string; en: string};
        swiftCode: string;
        bankCode: string;
      }) => {
        return {
          label: I18nManager?.isRTL ? bank?.bankName?.ar : bank?.bankName?.en,
          value: bank?.swiftCode,
          bankCode: bank?.bankCode,
        };
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      {isLoading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        title={translate('BANK_INFO_SCREEN')}>
        <Typography customStyles={() => ({text: selectStyle('titleStyle')})}>
          {translate('BANK_TRANSFER_MESSAGE')}
        </Typography>

        {/* <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
        <View style={{paddingHorizontal: wp(20), marginTop: hp(20)}}>
          <FormDropdown
            padding={0}
            customStyle={selectStyle('dropdownStyle')}
            textColor={
              formik.values.bankName
                ? palette.common.darkBlue
                : palette.common.placeHolderText
            }
            buttonTextStyle={{fontSize: hp(16)}}
            borderRadius={94}
            data={{
              data: listBanks(),
              value: formik.values.bankName,
              placeholder: translate('BANK_NAME'),
              onChange: formik.handleChange('bankName'),
              withoutView: true,
              errorCondition: formik.errors.bankName && formik.touched.bankName,
              error: formik.errors.bankName,
              buttonTextStyle: {fontSize: hp(12), color: '#98A2B3'},
            }}
          />
        </View>

        <Form style={{width: '100%', flex: 1}}>
          <View style={selectStyle('fieldContainer')}>
            <TextInput
              placeholder={`${translate('ACCOUNT_HOLDER_NAME')}`}
              value={formik.values.accountHolder}
              onChangeText={formik.handleChange('accountHolder')}
              keyboardType="default"
              style={[
                selectStyle('inputField'),
                {minHeight: 48, maxHeight: 48},
              ]}
              onTouchStart={() => formik.setFieldTouched('accountHolder')}
            />
          </View>

          <View style={selectStyle('fieldContainer')}>
            <TextInput
              placeholder={`${translate('BANK_IBAN_NUMBER')}`}
              value={formik.values.bankIban}
              onChangeText={formik.handleChange('bankIban')}
              keyboardType="default"
              style={selectStyle('inputField')}
              onTouchStart={() => formik.setFieldTouched('bankIban')}

              // maxLength={29}
            />
          </View>
        </Form>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: hp(20),
          }}>
          {/* <Pressable
              onPress={() => navigation.goBack()}
              style={selectStyle('goBackStyle')}
            >
              <SvgView
                svgFile={creditech.AttentionIcon}
                height={16}
                width={32}
                me={10}
                style={{ alignSelf: 'flex-end' }}
              />

              <Typography fontSize={16}>{translate('BACK')}</Typography>
            </Pressable> */}

          <DefaultButton
            title={translate('CONFIRM')}
            onPress={() => {
              setIsLoading(true);
              controlLoginModalView(true, () => formik.handleSubmit());
            }}
            disabled={!isAnyValueNull(formik.values)}
            loading={isLoading}
            mb={hp(20)}
          />
          {/* 
            <ContinueButton
              onContinuePressed={() =>
                controlLoginModalView(true, () => formik.handleSubmit())
              }
              completeForm={
                isAnyValueNull(formik.values) || formik.isSubmitting
              }
              loading={isLoading}
            /> */}
        </View>
        {/* </KeyboardAwareScrollView> */}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const DigitalFatortyBankTransfer = baseScreen(
  digitalFatortyBankTransfer,
  {
    allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
  },
);
