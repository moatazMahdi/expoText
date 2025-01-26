import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Form } from 'native-base';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DefaultButton from 'src/components/DefaultButton';
import FormInputField from '../../components/FormComponents/formInputField';
import FormDropdown from '../../components/FormComponents/formDropdown';
import { useStyles } from 'elephanz-rn-ui';
import { RequestForm } from 'src/Types';
import { baseScreen } from 'hoc';
import styles from './styles';

const supplementaryRequestForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const navigation = useNavigationUtils();
  const stores = useStores();

  const { controlLoginModalView } = stores.backend.users;
  const branches = stores.backend.general.branches.data;
  const { userData, controlSessionExpiredModalView } = stores.backend.users;

  const formSchema = Yup.object().shape({
    name: Yup.string()
      ?.trim()
      .required(translate('NAME_FIELD_REQUIRED_ERROR'))
      .min(5, translate('5_MIN_LEN')),
    mobilePhone: Yup.string()
      .required(translate('MOBILE_FIELD_REQUIRED_ERROR'))
      .matches(/^01[0125][0-9]{8}$/, translate('MOBILE_FIELD_LENGTH_ERROR')),
    email: Yup.string()
      .required(translate('EMAIL_FIELD_REQUIRED_ERROR'))
      .email(translate('EMAIL_FIELD_VALID_ERROR')),
    branch: Yup.string()
      .required(translate('BRANCH_FIELD_REQUIRED_ERROR'))
      .test('len', translate('BRANCH_FIELD_ERROR'), (val) => val !== ''),
  });

  const onSubmit = async (values: RequestForm) => {
    const onArrowBackPressed = () => {
      ApplicationAnalytics(
        {
          type: 'CTA',
          eventKey: 'ok_supplementary_request_form',
        },
        stores,
      );

      navigation.goBack();
    };

    try {
      setIsLoading(true);

      await stores.backend.programs.submitSupplementForm({
        ...values,
        mobile: `+2${values.mobilePhone}`,
      });

      if (formik.isSubmitting) {
        formik.resetForm();
      }

      Alert.alert(
        translate('LEAD_FORM_SUCCESS_TITLE'),
        translate('SUPPLEMENTARY_FORM_SUCCESS_BODY'),
        [
          {
            text: translate('LOGIN_CONFIRM'),
            onPress: onArrowBackPressed,
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      formik.resetForm();
      if (error?.response?.data?.statusCode !== 401) {
        Alert.alert(
          translate('LEAD_FORM_FAILED_TITLE'),
          error?.response?.data?.message &&
            typeof error?.response?.data?.message === 'object'
            ? error?.response?.data?.message[0]
            : error?.response?.data?.message == 'Internal server error'
            ? translate('ERROR')
            : error?.response?.data?.message,
        );
      }
      controlSessionExpiredModalView(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: userData?.name,
      mobilePhone: userData?.phone.substring(2),
      email: userData?.email ?? '',
      branch: '',
    },
    onSubmit,
    validationSchema: formSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <DefaultOverLayLoading />}

      <ScrollContainerWithNavHeader
        title={translate('REQUEST_INFO_SCREEN_HEADER')}
      >
        <View style={selectStyle('formContainer')}>
          <Form style={{ width: '100%' }}>
            <FormInputField
              data={{
                placeholder: `${translate('LEAD_FORM_FULL_NAME')}`,
                value: formik.values.name,
                onChangeText: formik.handleChange('name'),
                onTouchStart: () => formik.setFieldTouched('name'),
                errorCondition: formik.errors.name && formik.touched.name,
                error: formik.errors.name,
              }}
            />

            <FormInputField
              data={{
                placeholder: `${translate('LOGIN_PHONE_PLACEHOLDER')}`,
                value: formik.values.mobilePhone,
                onChangeText: formik.handleChange('mobilePhone'),
                keyboardType: 'number-pad',
                onTouchStart: () => formik.setFieldTouched('mobilePhone'),
                errorCondition:
                  formik.errors.mobilePhone && formik.touched.mobilePhone,
                error: formik.errors.mobilePhone,
                maxLength: 11,
              }}
            />

            <FormInputField
              data={{
                placeholder: `${translate('EMAIL')}`,
                value: formik.values.email,
                onChangeText: formik.handleChange('email'),
                keyboardType: 'email-address',
                onTouchStart: () => formik.setFieldTouched('email'),
                errorCondition: formik.errors.email && formik.touched.email,
                error: formik.errors.email,
              }}
            />

            <FormDropdown
              data={{
                data: branches?.map((item) => ({
                  label: item?.title?.trim(),
                  value: item?.title?.trim(),
                })),
                value: formik.values.branch,
                placeholder: translate('SUPPLEMENTARY_BRANCHES'),
                onChange: formik.handleChange('branch'),
                withoutView: true,
                defaultStyle: true,
                isRequired: true,
                errorCondition: formik.errors.branch && formik.touched.branch,
                error: formik.errors.branch,
              }}
            />
          </Form>

          <View style={selectStyle('formContinueButton')}>
            <DefaultButton
              title={translate('REQUEST_INFO_FORM_BUTTON_TEXT')}
              onPress={() =>
                controlLoginModalView(true, () => formik.handleSubmit())
              }
              disabled={!formik.isValid}
              loading={isLoading}
            />
          </View>
        </View>
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const SupplementaryRequestForm = baseScreen(supplementaryRequestForm, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
