import React, {useEffect, useState} from 'react';
import {Pressable, View, Text, TouchableOpacity} from 'react-native';
import {useStores, useLocalization} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultButton from 'src/components/DefaultButton';
import RowView from 'src/components/Wrappers/RowView';
// import { selectContactPhone } from 'react-native-select-contact';
import SvgView from 'src/components/SvgView';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadDocs} from 'utils';
import {request, PERMISSIONS} from 'react-native-permissions';
import {PermissionResult} from 'src/utils/Constants';
import {baseScreen} from 'hoc';
import DefaultTextInput from 'src/components/DefaultTextInput';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  PERMISSION_TYPE,
  requestPermission,
} from 'src/utils/PermissionsUtilities';
import DefaultSeparator from 'src/components/DefaultSeparator';
import {hp} from 'src/utils/Dimensions/dimen';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

const userData: React.FC = () => {
  const stores = useStores();
  const user = stores.backend.users.userData;
  const [contactInfo, setContactInfo] = useState({
    touched: false,
    postalAddress: [],
    // emails: [],
    phones: [],
    familyName: '',
    givenName: '',
    name: user?.refContact?.name ?? '',
    selectedPhone: {
      type: 'Mobile',
      number: user?.refContact?.phone?.slice(2) ?? '',
    },
  });
  const [Executed, setExecuted] = useState(false);

  const {translate} = useLocalization();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trustedNameError, setTrustedNameError] = useState<string>('');
  const [trustedPhoneError, setTrustedPhoneError] = useState<string>('');
  const [formInfoValid, SetFormInfoValid] = useState<boolean>(false);

  const [secondNumber, setSecondNumber] = useState<string>(
    user?.secondPhone?.slice(2),
  );
  const [secondNumberTouched, setSecondNumberTouched] =
    useState<boolean>(false);
  const [secondNumberError, setSecondNumberError] = useState<string>('');

  const [name, setName] = useState<string>(user?.name);
  const [nameError, setNameError] = useState<string>('');

  const [email, setEmail] = useState<string>(user?.email);
  const [emailError, setEmailError] = useState<string>('');

  const [image, setImage] = useState<{}>(null);

  const [canUseContactPicker, setCanUseContactPicker] =
    useState<boolean>(false);

  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const {selectStyle} = useStyles(styles);

  // useEffect(() => {
  // const getPer = async () => {
  // Platform.OS === 'ios'
  // ? await request(PERMISSIONS.IOS.CONTACTS).then(() => {
  // if (PermissionResult.granted) setCanUseContactPicker(true);
  //  …
  // })
  // : await request(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
  // if (result === PermissionResult.granted)
  // setCanUseContactPicker(true);
  // });
  // };
  // getPer();
  // }, []);

  useEffect(() => {
    setName(user?.name);
    // setEmail(user?.email);
    setSecondNumber(user?.secondPhone?.slice(2));
    setContactInfo({
      touched: false,
      postalAddress: [],
      // emails: [],
      phones: [],
      familyName: '',
      givenName: '',
      name: user?.refContact?.name ?? '',
      selectedPhone: {
        type: 'Mobile',
        number: user?.refContact?.phone?.slice(2) ?? '',
      },
    });
  }, [user]);

  const validateForm = () => {
    setTrustedNameError('');
    setTrustedPhoneError('');
    setSecondNumberError('');
    setEmailError('');
    setNameError('');

    let dataToUpdate = {};

    let nameValidated = false;
    let phoneValidated = false;

    let secondNumberValidated = false;
    let emailValidated = false;
    let userNameValidated = false;

    if (contactInfo?.name !== '' || contactInfo?.selectedPhone?.number !== '') {
      if (contactInfo?.name !== '') {
        if (contactInfo?.name?.length > 0) {
          nameValidated = true;
        }
        if (contactInfo.selectedPhone.number !== '') {
          if (contactInfo.selectedPhone.number.length === 11) {
            if (
              contactInfo.selectedPhone.number !== user?.phone?.slice(2) &&
              contactInfo.selectedPhone.number !== user?.secondPhone?.slice(2)
            ) {
              phoneValidated = true;
            }
          }
        }
      }
      if (contactInfo?.selectedPhone?.number !== '') {
        if (contactInfo.selectedPhone.number.length === 11) {
          if (
            contactInfo.selectedPhone.number !== user?.phone?.slice(2) &&
            contactInfo.selectedPhone.number !== user?.secondPhone?.slice(2)
          ) {
            phoneValidated = true;
          }
        }

        if (contactInfo.name.length > 0) {
          nameValidated = true;
        }
      }
    } else {
      if (user?.refContact && user?.refContact !== null) {
        dataToUpdate['refContact'] = null;
        phoneValidated = true;
        nameValidated = true;
      } else {
        // dataToUpdate['refContact'] = user?.refContact;
      }
    }

    if (secondNumber !== '') {
      if (secondNumber?.length === 11) {
        if (secondNumber !== user?.phone?.slice(2)) {
          secondNumberValidated = true;
          if ('+2' + secondNumber !== user?.secondPhone)
            dataToUpdate['secondPhone'] = '+2' + secondNumber?.trim();
        }
      }
    } else {
      if (user?.secondPhone && user?.secondPhone !== null) {
        dataToUpdate['secondPhone'] = null;
        secondNumberValidated = true;
      } else {
        //dataToUpdate['secondPhone'] = user?.secondPhone;
      }
    }

    if (name !== '') {
      if (name.length > 0) {
        const reg = /^[A-Za-z\u0600-\u06FF\s]*$/;
        if (reg.test(name)) {
          userNameValidated = true;
          if (name !== user?.name) dataToUpdate['name'] = name?.trim();
        }
      }
    }

    if (email !== '') {
      const reg =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (reg.test(email) === true) {
        emailValidated = true;
        if (email !== user?.email) dataToUpdate['email'] = email?.trim();
      }
    }

    if (contactInfo.touched) {
      if (!nameValidated) {
        if (contactInfo.name?.trim().length === 0)
          setTrustedNameError(translate('NAME_FIELD_REQUIRED_ERROR'));
        else setTrustedNameError(translate('NAME_FIELD_INVALID_ERROR'));
      }
      if (!phoneValidated) {
        if (contactInfo.selectedPhone.number.length === 0)
          setTrustedPhoneError(translate('MOBILE_FIELD_REQUIRED_ERROR'));
        else if (
          contactInfo.selectedPhone.number === user?.phone?.slice(2) ||
          contactInfo.selectedPhone.number === user?.secondPhone?.slice(2)
        ) {
          setTrustedPhoneError(translate('CANT_BE_SAME_AS_PRIMARY_NUMBER'));
        } else setTrustedPhoneError(translate('MOBILE_FIELD_LENGTH_ERROR'));
      }
    }

    if (!secondNumberValidated && secondNumberTouched) {
      setSecondNumberError(translate('MOBILE_FIELD_LENGTH_ERROR'));
    }
    if (!emailValidated && email != '' && email != null) {
      setEmailError(translate('EMAIL_FIELD_VALID_ERROR'));
    }

    if (!userNameValidated) {
      setNameError(translate('NAME_FIELD_REQUIRED_ERROR'));
    }

    if (
      contactInfo.touched &&
      nameValidated &&
      phoneValidated &&
      contactInfo.name !== ''
    ) {
      dataToUpdate['refContact'] = {
        name: contactInfo.name,
        phone: '+2' + contactInfo.selectedPhone.number,
      };
    }
    return dataToUpdate;
  };

  useEffect(() => {
    const valid = validateForm();
    SetFormInfoValid(
      !(
        valid &&
        Object.keys(valid).length === 0 &&
        Object.getPrototypeOf(valid) === Object.prototype
      ) || image !== null,
    );
  }, [
    contactInfo,
    secondNumber,
    name,
    email,
    image,
  ]);

  const onSubmit = async () => {
    let data = validateForm();
    if (!data?.hasOwnProperty('secondPhone'))
      data = {...data, secondPhone: user?.secondPhone};
    if (!data?.hasOwnProperty('refContact'))
      data = {...data, refContact: user?.refContact};
    const token = stores.backend.auth.getAccessToken();
    try {
      setIsLoading(true);
      if (image) {
        if (image === ' ') {
          await stores.backend.users.updateUser({
            avatar: 'delete',
            ...data,
          });
          FastImage.clearMemoryCache();
          FastImage.clearDiskCache();
        } else {
          await uploadDocs({
            token,
            fileType: image.mime,
            base64File: image.data as any,
            callback: async url => {
              await stores.backend.users.updateUser({
                avatar: url,
                ...data,
              });
            },
            isProfile: true,
          });
          FastImage.clearMemoryCache();
          FastImage.clearDiskCache();
        }
      } else {
        await stores?.backend?.users?.updateUser({
          ...data,
        });
      }

      setEnableEdit(false);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setSecondNumberTouched(false);
      setIsLoading(false);
    }
  };

  const onDismiss = () => {
    setEnableEdit(false);
    setImage(null);
    setContactInfo({
      touched: false,
      postalAddress: [],
      // emails: [],
      phones: [],
      familyName: '',
      givenName: '',
      name: user?.refContact?.name ?? '',
      selectedPhone: {
        type: 'Mobile',
        number: user?.refContact?.phone?.slice(2) ?? '',
      },
    });

    setName(user?.name);
    setEmail(user?.email);
    setSecondNumber(user?.secondPhone?.slice(2));
    setSecondNumberTouched(false);
    setTrustedPhoneError('');
    setTrustedNameError('');
  };

  // const getPhoneNumber = () => {
  // selectContactPhone().then((selection) => {
  // if (!selection) {
  // return null;
  // }
  // setContactInfo({ ...contactInfo, touched: true });
  // let { contact, selectedPhone } = selection;
  // setContactInfo({
  // ...contactInfo,
  // ...contact,
  // touched: true,
  // selectedPhone: {
  // ...selectedPhone,
  // number: selectedPhone.number.replace(/\s/g, ''),
  // },
  // });
  // });
  // };

  const renderTrusterPersonInfo = () => {
    return (
      <View style={selectStyle('personalDataInfoContainer')}>
        {renderUserImage()}
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('NAME')}
            textInputStyle={selectStyle('inputTextStyle')}
            // viewStyle={selectStyle('inputViewStyle')}
            noSeparator
            inputContainer={selectStyle('inputViewContainer')}
            textOnly={!enableEdit}
            value={name}
            placeholder={translate('NAME')}
            onchangeText={text => {
              setName(text);
            }}
            // textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}
          />
          {enableEdit && nameError !== '' && (
            <Typography
              customStyles={() => ({
                text: selectStyle('errorMessage'),
              })}>
              {nameError}
            </Typography>
          )}
        </View>
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('REGISTER_EMAIL_PLACEHOLDER')}
            textOnly={!enableEdit}
            textInputStyle={selectStyle('inputTextStyle')}
            value={email}
            inputContainer={selectStyle('inputViewContainer')}
            placeholder={translate('REGISTER_EMAIL_PLACEHOLDER')}
            onchangeText={text => {
              setEmail(text);
            }}
            noSeparator
            textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}
          />
          {enableEdit && emailError !== '' && (
            <Typography
              customStyles={() => ({
                text: selectStyle('errorMessage'),
              })}>
              {emailError}
            </Typography>
          )}
        </View>
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('LEAD_FORM_MOBILE_NUMBER')}
            textInputStyle={selectStyle('inputTextStyle')}
            viewStyle={!enableEdit ? selectStyle('inputViewStyle') : {}}
            textOnly={!enableEdit}
            editable={false}
            value={user?.phone?.slice(2)}
            placeholder={translate('LEAD_FORM_MOBILE_NUMBER')}
            onchangeText={() => {}}
            noSeparator
            inputContainer={selectStyle('inputViewContainer')}
            textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}
          />
        </View>
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('ADDITIONAL_MOBILE_NUMBER')}
            textInputStyle={selectStyle('inputTextStyle')}
            viewStyle={!enableEdit ? selectStyle('inputViewStyle') : {}}
            textOnly={!enableEdit}
            onTouchStart={() => setSecondNumberTouched(true)}
            value={secondNumber}
            placeholder={translate('ADDITIONAL_MOBILE_NUMBER')}
            onchangeText={text => {
              setSecondNumber(text);
            }}
            noSeparator
            inputContainer={selectStyle('inputViewContainer')}
            textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}
          />
          {enableEdit && secondNumberError !== '' && (
            <Typography
              customStyles={() => ({
                text: selectStyle('errorMessage'),
              })}>
              {secondNumberError}
            </Typography>
          )}
        </View>
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('REFERENCE_NAME')}
            textOnly={!enableEdit}
            value={contactInfo.name}
            placeholder={translate('REFERENCE_NAME')}
            textInputStyle={selectStyle('inputTextStyle')}
            viewStyle={!enableEdit ? selectStyle('inputViewStyle') : {}}
            onchangeText={text => {
              setContactInfo({...contactInfo, touched: true, name: text});
            }}
            noSeparator
            inputContainer={selectStyle('inputViewContainer')}
            textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}

            // onPress={getPhoneNumber}
            // icon={enableEdit && creditech.contactUpload}
          />

          {enableEdit && trustedNameError !== '' && (
            <Typography
              customStyles={() => ({
                text: selectStyle('errorMessage'),
              })}>
              {trustedNameError}
            </Typography>
          )}
        </View>
        <View style={{marginTop: hp(16)}}>
          <DefaultTextInput
            title={translate('REFERENCE_NUMBER_SCREEN_TITLE')}
            textOnly={!enableEdit}
            value={contactInfo.selectedPhone.number}
            placeholder={translate('REFERENCE_NUMBER')}
            keyboardType="numeric"
            textInputStyle={selectStyle('inputTextStyle')}
            viewStyle={!enableEdit ? selectStyle('inputViewStyle') : {}}
            onchangeText={text => {
              setContactInfo({
                ...contactInfo,
                touched: true,
                selectedPhone: {type: 'Mobile', number: text},
              });
            }}
            noSeparator
            inputContainer={selectStyle('inputViewContainer')}
            textInputContainer={selectStyle('inputContainer')}
            titleStyle={selectStyle('inputTitle')}
          />
          {enableEdit && trustedPhoneError !== '' && (
            <Typography
              customStyles={() => ({
                text: selectStyle('errorMessage'),
              })}>
              {trustedPhoneError}
            </Typography>
          )}
        </View>
      </View>
    );
  };

  const TrusterPersonInfo = () => {
    return (
      <View style={selectStyle('TrusterPersonInfoContainer')}>
        <View style={selectStyle('TrusterPersonInfo')}>
          {renderUserImage()}
          <DefaultSeparator op={0.3} />
          {email ? <>
            <View style={{padding: 16}}>
            <Typography style={selectStyle('titleValue')}>
              {translate('REGISTER_EMAIL_PLACEHOLDER')}
            </Typography>
            <Typography style={selectStyle('UserValue')}>{email}</Typography>
          </View>
          <DefaultSeparator op={0.3} />
          </> : null}

          <View style={{padding: 16}}>
            <Typography style={selectStyle('titleValue')}>
              {translate('LEAD_FORM_MOBILE_NUMBER')}
            </Typography>
            <Typography style={selectStyle('UserValue')}>
              {user?.phone?.slice(2)}
            </Typography>
          </View>
          <DefaultSeparator op={0.3} />
          {secondNumber ? <>
            <View style={{padding: 16}}>
            <Typography style={selectStyle('titleValue')}>
              {translate('ADDITIONAL_MOBILE_NUMBER')}
            </Typography>
            <Typography style={selectStyle('UserValue')}>
              {secondNumber}
            </Typography>
          </View>
          <DefaultSeparator op={0.3} />
          </> : null}
         {contactInfo.name ? <>
          <View style={{padding: 16}}>
            <Typography style={selectStyle('titleValue')}>
              {translate('REFERENCE_NAME')}
            </Typography>
            <Typography style={selectStyle('UserValue')}>
              {contactInfo.name}
            </Typography>
          </View>
          <DefaultSeparator op={0.3} />
         </>:null}
     
          <View style={{padding: 16}}>
            <Typography style={selectStyle('titleValue')}>
              {translate('REFERENCE_NUMBER_SCREEN_TITLE')}
            </Typography>
            <Typography style={selectStyle('UserValue')}>
              {contactInfo.selectedPhone.number}
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  const TextButton = ({_onPress, _text}) => (
    <Pressable style={selectStyle('textButtonContainer')} onPress={_onPress}>
      <Text style={selectStyle('textButtonTitle')}>{_text}</Text>
    </Pressable>
  );

  const renderEditButtons = () => (
    <View style={selectStyle('editButtonsContainer')}>
      <TextButton
        _onPress={() => {
          // Platform.OS === 'ios'
          // ? request(PERMISSIONS.IOS.CONTACTS).then((result) => {
          // if (result === PermissionResult.granted)
          // setCanUseContactPicker(true);
          //  …
          // })
          // : request(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
          // if (result === PermissionResult.granted)
          // setCanUseContactPicker(true);
          // });
          setEnableEdit(true);
        }}
        _text={translate('EDIT_YOUR_INFO')}
      />
    </View>
  );

  const renderConfirmEditButtons = () => {
    return (
      <RowView jc="space-around">
        <DefaultButton
          buttonStyle={selectStyle('buttonStyle')}
          title={translate('PROFILE_SAVE')}
          onPress={onSubmit}
          loading={isLoading}
          disabled={!formInfoValid}
          mt={20}
        />

        {/* <DefaultButton
          buttonStyle={[selectStyle('buttonStyle')]}
          title={translate('CANCEL')}
          disabled={isLoading}
          onPress={onDismiss}
          mt={20}
        /> */}
      </RowView>
    );
  };

  const handleImagePick = async () => {
    if (!enableEdit) {
      return;
    }
    if (Executed) {
      return;
    }
    setExecuted(true);

    try {
      const isGranted = await requestPermission(PERMISSION_TYPE.gallery);

      if (isGranted) {
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
          mediaType: 'photo',
        });

        setImage(image);
        setExecuted(false);
      }
    } catch (error) {
      setExecuted(false);
      throw new Error(error);
    }
  };
  
  const renderUserImage = () => {
    return (
      <View
        style={[
          selectStyle('userImageMainContainer'),
          {
            marginHorizontal: enableEdit ? 24 : 16,
            marginVertical: enableEdit ? 16 : 32,
          },
        ]}>
        <View
          // onPress={handleImagePick}
          style={selectStyle('userImageContainer')}>
          {(user?.avatar && image !== ' ') || image?.path ? (
            <FastImage
              source={{
                uri: image ? image.path : user.avatar,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.web,
              }}
              style={selectStyle('imageStyle')}
            />
          ) : (
            <SvgView
              br={99}
              svgFile={creditech.avatar}
              width={78}
              height={78}
            />
          )}
          {/* {enableEdit && (
            <View style={selectStyle('editImage')}>
              <SvgView width={18} height={18} svgFile={creditech.UploadIcon} />
            </View>
          )} */}
        </View>
        {!enableEdit ? (
          <View style={{marginStart: 16}}>
            <Typography style={selectStyle('nameTextSty')}>{name}</Typography>
            {renderEditButtons()}
          </View>
        ) : null}

        {/* {user?.avatar && enableEdit && (
          <Pressable onPress={() => setImage(' ')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('removeImageText'),
              })}
            >
              {translate('REMOVE_IMAGE')}
            </Typography>
          </Pressable>
        )} */}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        view
        title={translate('PERSONAL_DATA')}
        shapeVariant="blueSlate"
        showLogo>
        <KeyboardAwareScrollView>
          {/* {renderPersonalDataInfo()} */}
          {enableEdit ? (
            <>{renderTrusterPersonInfo()}</>
          ) : (
            <TrusterPersonInfo />
          )}
          {/* {renderUserImage()}*/}
          {/* {!enableEdit && renderEditButtons()} */}
          {enableEdit && renderConfirmEditButtons()}
        </KeyboardAwareScrollView>
      </ScrollContainerWithNavHeader>
      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};
export const UserData = baseScreen(userData, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
