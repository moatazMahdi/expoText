import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useLocalization, useStores } from 'hooks';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { Form } from 'native-base';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ContactUsForm } from 'shared';
import { hp } from 'src/utils/Dimensions/dimen';
import DefaultButton from 'src/components/DefaultButton';

const sendMessage: React.FC = () => {
  const stores = useStores();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = Yup.object().shape({
    fullName: Yup.string().required(translate('NAME_FIELD_REQUIRED_ERROR')),
    mobileNumber: Yup.string()
      .required(translate('MOBILE_FIELD_REQUIRED_ERROR'))
      .test(
        'len',
        translate('MOBILE_FIELD_LENGTH_ERROR'),
        (val) => Boolean(val) && val!.length === 11,
      ),
    email: Yup.string()
      .email(translate('EMAIL_FIELD_VALID_ERROR'))
      .required(translate('EMAIL_FIELD_REQUIRED_ERROR')),
    message: Yup.string().required(translate('MESSAGE_FIELD_VALID_ERROR')),
  });

  const onSubmit = async (values: ContactUsForm) => {
    try {
      setIsLoading(true);
      await stores.backend.users.sendContactUsForm(values);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      formik.resetForm();
      Alert.alert('Thank you for your message, we will contact you soon.');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const user = stores.backend.users.userData;

  // remove +2 from mobile number
  const formik = useFormik({
    initialValues: {
      fullName: user ? user?.name : '',
      mobileNumber: user ? user?.phone?.slice(2) : '',
      email: '',
      message: '',
    },
    onSubmit,
    validationSchema: formSchema,
    enableReinitialize: true,
    validateOnMount: true,
    initialErrors: {
      fullName: '',
    },
  });

  const handleError = (key: keyof ContactUsForm) => {
    if (formik.touched[key]) {
      return formik.errors[key];
    }
    return null;
  };

  const renderContent = () => {
    return (
      <Form style={selectStyle('formContainer')}>
        <View style={selectStyle('descFieldContainer')}>
          <TextInput
            placeholder={`${translate('REGISTER_NAME_PLACEHOLDER')} *`}
            value={formik.values.fullName}
            onChangeText={formik.handleChange('fullName')}
            onBlur={formik.handleBlur('fullName')}
            keyboardType="default"
            style={[selectStyle('fieldInput'), selectStyle('emailField')]}
            onTouchStart={() => formik.setFieldTouched('fullName')}
          />
        </View>
        {formik.touched.fullName && formik.errors.fullName ? (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {handleError('fullName')}
          </Typography>
        ) : null}
        <View style={selectStyle('descFieldContainer')}>
          <TextInput
            placeholder={`${translate('LOGIN_PHONE_PLACEHOLDER')} *`}
            value={formik.values.mobileNumber}
            onChangeText={formik.handleChange('mobileNumber')}
            onBlur={formik.handleBlur('mobileNumber')}
            keyboardType="default"
            style={[selectStyle('fieldInput'), selectStyle('emailField')]}
            onTouchStart={() => formik.setFieldTouched('mobileNumber')}
          />
        </View>
        {handleError('mobileNumber') && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {handleError('mobileNumber')}
          </Typography>
        )}
        <View style={selectStyle('descFieldContainer')}>
          <TextInput
            placeholder={`${translate('REGISTER_EMAIL_PLACEHOLDER')} *`}
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            keyboardType="default"
            style={[selectStyle('fieldInput'), selectStyle('emailField')]}
            onTouchStart={() => formik.setFieldTouched('email')}
          />
        </View>
        {handleError('email') && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {handleError('email')}
          </Typography>
        )}
        <View
          style={[
            selectStyle('descFieldContainer'),
            {
              height: hp(296),
            },
          ]}
        >
          <TextInput
            placeholder={`${translate('MESSAGE')} *`}
            multiline
            value={formik.values.message}
            onChangeText={formik.handleChange('message')}
            onBlur={formik.handleBlur('message')}
            keyboardType="default"
            style={[selectStyle('descFiled')]}
            onTouchStart={() => formik.setFieldTouched('message')}
          />
        </View>
        {handleError('message') && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {handleError('message')}
          </Typography>
        )}
        <DefaultButton
          title={translate('REQUEST_INFO_FORM_BUTTON_TEXT')}
          onPress={formik.handleSubmit}
          loading={isLoading}
          disabled={!formik.isValid}
          mt={20}
        />
      </Form>
    );
  };

  return (
    <ScrollContainerWithNavHeader title={translate('SEND_UD_MESSAGE')}>
      {renderContent()}
    </ScrollContainerWithNavHeader>
  );
};
export const SendMessage = baseScreen(sendMessage, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
