import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
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
import { BottomContainer } from 'src/components/BottomContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const sendMessage: React.FC = () => {
  const stores = useStores();
  const navigation = useNavigationUtils();

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
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        translate('EMAIL_FIELD_VALID_ERROR'),
      )
      .trim()
      .required(translate('EMAIL_FIELD_REQUIRED_ERROR')),
    message: Yup.string().required(translate('MESSAGE_FIELD_VALID_ERROR')),
  });

  const onSubmit = async (values: ContactUsForm) => {
    try {
      setIsLoading(true);
      await stores.backend.users.sendContactUsForm(values);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      formik.resetForm();
      navigation.navigate('sendMessageDone');
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
            placeholder={`${translate('WRITE_EMAIL_TO_GET_ANSWER')} *`}
            value={formik.values.email?.trim()}
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
            placeholder={`${translate('WRITE_YOUR_MESSAGE')} *`}
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
        <BottomContainer>
          <DefaultButton
            title={translate('SEND_MESSAGE')}
            onPress={formik.handleSubmit}
            loading={isLoading}
            disabled={!formik.isValid}
            mt={20}
          />
        </BottomContainer>
      </Form>
    );
  };

  return (
    <ScrollContainerWithNavHeader view title={translate('SEND_UD_MESSAGE')}>
      <KeyboardAwareScrollView>{renderContent()}</KeyboardAwareScrollView>
    </ScrollContainerWithNavHeader>
  );
};
export const SendMessage = baseScreen(sendMessage, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
