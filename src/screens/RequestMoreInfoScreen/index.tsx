import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Form } from 'native-base';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import FormInputField from 'src/components/FormComponents/formInputField';
import FormDropdown from 'src/components/FormComponents/formDropdown';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DefaultButton from 'src/components/DefaultButton';
import { Programs } from 'shared/DTOs/programs';
import { useStyles } from 'elephanz-rn-ui';
import { calculatorData } from 'src/Types';
import { RequestForm } from 'shared';
import {
  arabicBrands,
  areas,
  areasEn,
  CarConditionEn,
  CarConditionAr,
  englishBrands,
  governorates,
  governoratesEn,
  TruckConditionEn,
  TruckConditionAr,
  ProductsEn,
  ProductsAr,
} from './types';
import styles from './styles';

export const RequestMoreInfoScreen: React.FC = () => {
  const route: any = useRoute();
  const programId =
    route.params && route.params.programId ? route.params.programId : null;
  const { calculatorData } = route.params as {
    calculatorData: calculatorData;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { translate, currentLanguage } = useLocalization();
  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const stores = useStores();

  const userStatus = stores.backend.users.userData;
  const userName = userStatus ? stores.backend.users.userData.name : '';
  const userEmail = userStatus ? stores.backend.users.userData.email : '';
  const userPhoneNumber = userStatus ? stores.backend.users.userData.phone : '';
  const govData = currentLanguage.isRTL ? governorates : governoratesEn;
  const currentProgram = stores.backend.products.currentProduct;
  const Insurances = stores.backend.products.subproducts;
  const { controlLoginModalView } = stores.backend.users;

  const brands = currentLanguage.isRTL ? arabicBrands : englishBrands;
  const isEmailRequired =
    programId === Programs.HOMES ||
    !['Trucks', 'Brokerage']?.includes(currentProgram);
  const emailYup = Yup.string().email(translate('EMAIL_FIELD_VALID_ERROR'));

  useEffect(() => {
    (async () => {
      const logAnalytics = async (name) => {
        ApplicationAnalytics(
          { type: 'CTA', eventKey: 'request_form', parameters: { name } },
          stores,
        );
      };
      if (route?.params?.programId || route?.params?.subproductId) {
        await logAnalytics(
          route?.params?.programId || route?.params?.subproductId,
        );
      } else {
        await logAnalytics(currentProgram);
      }
    })();
  }, []);

  const getYup = (msg) =>
    Yup.string().test('len', translate(msg), (val) => val !== '');

  const formSchema = Yup.object().shape({
    name: Yup.string()
      ?.trim()
      .required(translate('NAME_FIELD_REQUIRED_ERROR'))
      .min(5, translate('5_MIN_LEN')),
    mobilePhone: Yup.string()
      .required(translate('MOBILE_FIELD_REQUIRED_ERROR'))
      .matches(/^01[0125][0-9]{8}$/, translate('MOBILE_FIELD_LENGTH_ERROR')),
    email: isEmailRequired
      ? emailYup.required(translate('EMAIL_FIELD_REQUIRED_ERROR'))
      : emailYup,

    governance:
      programId === Programs.TRADE_IN
        ? getYup('GOVERNANCE_FIELD_VALID_ERROR')
        : getYup('GOVERNANCE_FIELD_VALID_ERROR').required(),
    area:
      programId === Programs.TRADE_IN
        ? getYup('AREA_FIELD_VALID_ERROR')
        : getYup('AREA_FIELD_VALID_ERROR').required(),
    brand:
      programId === Programs.TRADE_IN ? Yup.string().required() : Yup.string(),
    model: Yup.string(),
    modelYear: Yup.number(),
    buyerName: Yup.string(),
    buyerPhone: Yup.string().matches(
      /^01[0125][0-9]{8}$/,
      translate('MOBILE_FIELD_LENGTH_ERROR'),
    ),
    buyerEmail: emailYup,

    refName: Yup.string(),
    refIdNo: Yup.number(),
    refPhoneNumber: Yup.string().matches(
      /^01[0125][0-9]{8}$/,
      translate('MOBILE_FIELD_LENGTH_ERROR'),
    ),
    refProduct: Yup.string(),

    carCondition: Yup.string(),

    insuranceType: Yup.string(),
  });

  const onSubmit = async (values: RequestForm) => {
    const subproductId =
      route.params && route.params.subproductId
        ? route.params.subproductId
        : null;

    const valuesData = {
      ...values,
      mobilePhone:
        values.mobilePhone?.indexOf('+2') < 0
          ? `+2${values.mobilePhone}`
          : values.mobilePhone,
      brand: values.brand === '' ? ' ' : values.brand, //brand should not be empty
      plan: '',
      tenor: '0',
      amount: '0',
      downPayment: '0',
      installmentValue: '0',
      hrLetter: '',
      electricityBill: '',
      needHelp: false,
    };

    if (calculatorData) {
      const { plan, duration, amount, installmentValue, downPayment } =
        calculatorData;

      navigation.navigate('reviewApplication', {
        data: {
          plan,
          duration,
          amount,
          downPayment,
          installmentValue,
        },
        submitFormValues: valuesData,
        programId: programId,
      });
    } else {
      try {
        setIsLoading(true);
        if (programId) {
          await stores.backend.programs.submitProgramForm(
            programId,
            valuesData,
          );
        } else {
          await stores.backend.products.sendRequestInfoForm(
            valuesData,
            `${subproductId}`,
          );
        }
        Alert.alert(
          translate('LEAD_FORM_SUCCESS_TITLE'),
          translate('LEAD_FORM_SUCCESS_BODY'),
          [
            {
              text: translate('LOGIN_CONFIRM'),
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } catch (error) {
        let errorBody;
        if (
          error?.response?.data?.message &&
          typeof error?.response?.data?.message === 'object'
        ) {
          errorBody = error?.response?.data?.message[0];
        } else if (error?.response?.data?.message) {
          errorBody = error?.response?.data?.message;
        }
        Alert.alert(translate('LEAD_FORM_FAILED_TITLE'), errorBody);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formikInitialValues = {
    //ALL
    name: userName,
    mobilePhone: userPhoneNumber?.split('+2')?.join(''),
    email: userEmail,

    //TRADE_IN
    governance: '',
    area: '',
    brand: '',
    model: '',
    modelYear: '',
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',

    //REFERRAL
    refName: '',
    refIdNo: '',
    refPhoneNumber: '',
    refProduct: '',

    //'AUTO, 'TRUCKES
    carCondition: '',

    //BROKERAGE
    insuranceType: '',
  };

  const formik = useFormik({
    initialValues: formikInitialValues,
    onSubmit,
    validationSchema: formSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  const listAreas = (areaType: any) => {
    if (areaType[`${formik.values.governance}`]) {
      const cities = areaType[`${formik.values.governance}`]?.map(
        (item: any) => ({
          label: item,
          value: item,
        }),
      );
      return cities;
    }
    return [];
  };

  const mainDropDownProps = {
    withoutView: true,
    defaultStyle: true,
  };

  return (
    <ScrollContainerWithNavHeader
      title={translate('REQUEST_INFO_SCREEN_HEADER')}
    >
      <View style={selectStyle('formContainer')}>
        <Form style={selectStyle('form')}>
          <FormInputField
            data={{
              placeholder: `${translate('LEAD_FORM_FULL_NAME')}*`,
              value: formik.values.name,
              onChangeText: formik.handleChange('name'),
              onTouchStart: () => formik.setFieldTouched('name'),
              errorCondition: formik.errors.name && formik.touched.name,
              error: formik.errors.name,
            }}
          />

          <FormInputField
            data={{
              placeholder: `${translate('LOGIN_PHONE_PLACEHOLDER')}*`,
              value: formik.values.mobilePhone,
              onChangeText: formik.handleChange('mobilePhone'),
              onTouchStart: () => formik.setFieldTouched('mobilePhone'),
              errorCondition:
                formik.errors.mobilePhone && formik.touched.mobilePhone,
              error: formik.errors.mobilePhone,
              keyboardType: 'number-pad',
              maxLength: 11,
            }}
          />

          {programId === Programs.TRADE_IN ? null : (
            <>
              <FormDropdown
                data={{
                  ...mainDropDownProps,
                  data: govData?.map((item) => ({
                    label: item?.trim(),
                    value: item?.trim(),
                  })),
                  value: formik.values.governance,
                  placeholder: translate('GOVERNORATES'),
                  onChange: (selectedItem) => {
                    formik.handleChange('governance')(selectedItem);
                    formik.setFieldValue('area', undefined);
                    formik.values.area = '';
                  },
                  isRequired: true,
                  errorCondition:
                    formik.errors.governance && formik.touched.governance,
                  error: formik.errors.governance,
                }}
              />

              <FormDropdown
                data={{
                  ...mainDropDownProps,
                  data: currentLanguage.isRTL
                    ? listAreas(areas)
                    : listAreas(areasEn),
                  value: formik.values.area,
                  placeholder: translate('AREAS'),
                  onChange: formik.handleChange('area'),
                  isRequired: formik.values.governance ? true : false,
                  disabled: !formik.values.governance,
                  errorCondition: formik.errors.area && formik.touched.area,
                  error: formik.errors.area,
                }}
              />
            </>
          )}

          <FormInputField
            data={{
              placeholder: `${translate('LEAD_FORM_EMAIL_ADDRESS')}${
                isEmailRequired ? '*' : ''
              }`,
              value: formik.values.email,
              keyboardType: 'email-address',
              onChangeText: formik.handleChange('email'),
              onTouchStart: () => formik.setFieldTouched('email'),
              errorCondition: formik.errors.email && formik.touched.email,
              error: formik.errors.email,
            }}
          />

          {programId === Programs.REFERRAL ? (
            <>
              <FormInputField
                data={{
                  placeholder: translate('LEAD_FORM_REFERRAL_NAME'),
                  value: formik.values.refName,
                  onChangeText: formik.handleChange('refName'),
                }}
              />

              <FormInputField
                data={{
                  placeholder: translate('LEAD_FORM_REFERRAL_ID'),
                  value: formik.values.refIdNo,
                  onChangeText: formik.handleChange('refIdNo'),
                  keyboardType: 'number-pad',
                }}
              />

              <FormInputField
                data={{
                  placeholder: translate('LEAD_FORM_REFERRAL_PHONE_NUMBER'),
                  value: formik.values.refPhoneNumber,
                  onChangeText: formik.handleChange('refPhoneNumber'),
                  keyboardType: 'number-pad',
                  maxLength: 11,
                }}
              />

              <FormDropdown
                data={{
                  ...mainDropDownProps,
                  data: Object.values(
                    currentLanguage.isRTL ? ProductsAr : ProductsEn,
                  )?.map((item) => ({
                    label: item?.trim(),
                    value: item?.trim(),
                  })),
                  value: formik.values.refProduct,
                  placeholder: translate('LEAD_FORM_REFERRAL_PRODUCT'),
                  onChange: formik.handleChange('refProduct'),
                }}
              />
            </>
          ) : null}

          {programId === Programs.TRADE_IN ? (
            <>
              <FormDropdown
                data={{
                  ...mainDropDownProps,
                  data: brands?.map((item) => ({
                    label: item?.trim(),
                    value: item?.trim(),
                  })),
                  value: formik.values.brand,
                  placeholder: `${translate('BRANDS')}`,
                  onChange: formik.handleChange('brand'),
                  isRequired: programId === Programs.TRADE_IN,
                }}
              />

              <FormInputField
                data={{
                  placeholder: `${translate('LEAD_FORM_CAR_MODEL')}`,
                  value: formik.values.model,
                  onChangeText: formik.handleChange('model'),
                }}
              />

              <FormInputField
                data={{
                  placeholder: `${translate('LEAD_FORM_MODEL_YEAR')}`,
                  value: formik.values.modelYear,
                  onChangeText: formik.handleChange('modelYear'),
                  keyboardType: 'number-pad',
                }}
              />

              <FormInputField
                data={{
                  placeholder: `${translate('LEAD_FORM_BUYER_NAME')}`,
                  value: formik.values.buyerName,
                  onChangeText: formik.handleChange('buyerName'),
                }}
              />

              <FormInputField
                data={{
                  placeholder: `${translate('LEAD_FORM_BUYER_PHONE')}`,
                  value: formik.values.buyerPhone,
                  onChangeText: formik.handleChange('buyerPhone'),
                  keyboardType: 'number-pad',
                  maxLength: 11,
                }}
              />

              <FormInputField
                data={{
                  placeholder: `${translate('LEAD_FORM_BUYER_EMAIL')}`,
                  value: formik.values.buyerEmail,
                  onChangeText: formik.handleChange('buyerEmail'),
                  keyboardType: 'email-address',
                }}
              />
            </>
          ) : null}

          {['Auto', 'Trucks']?.includes(currentProgram) && !programId ? (
            <FormDropdown
              data={{
                ...mainDropDownProps,
                data: Object.values(
                  currentLanguage.isRTL
                    ? currentProgram === 'Trucks'
                      ? TruckConditionAr
                      : CarConditionAr
                    : currentProgram === 'Trucks'
                    ? TruckConditionEn
                    : CarConditionEn,
                )?.map((item) => ({
                  label: item?.trim(),
                  value: item?.trim(),
                })),
                value: formik.values.carCondition,
                placeholder: translate('LOAN_CONDITION_PLACEHOLDER'),
                onChange: (selectedItem) => {
                  formik.handleChange('carCondition')(selectedItem);
                },
              }}
            />
          ) : null}

          {['Brokerage']?.includes(currentProgram) && !programId ? (
            <FormDropdown
              data={{
                ...mainDropDownProps,
                data: Insurances.data?.map((item) => ({
                  label: item.name?.trim(),
                  value: item.name?.trim(),
                })),
                value: formik.values.insuranceType,
                placeholder: translate('INSURNACE_TYPE'),
                onChange: formik.handleChange('insuranceType'),
              }}
            />
          ) : null}
        </Form>

        <View style={selectStyle('formContinueButton')}>
          <DefaultButton
            title={translate('REQUEST_INFO_FORM_BUTTON_TEXT')}
            onPress={() =>
              controlLoginModalView(true, () => formik.handleSubmit())
            }
            disabled={!formik.isValid || formik.isSubmitting}
            loading={isLoading}
          />
        </View>
      </View>
    </ScrollContainerWithNavHeader>
  );
};
