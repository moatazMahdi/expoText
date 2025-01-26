import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
//import { Assets } from 'assets';
import styles from './styles';
import {ContinueButton, PageTitle} from 'components';
// import { selectContactPhone } from 'react-native-select-contact';
import {useRoute} from '@react-navigation/native';
import {saveInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
// import { request, PERMISSIONS } from 'react-native-permissions';
// import { PermissionResult } from 'src/utils/Constants';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {hp} from 'src/utils/Dimensions/dimen';
// import Contacts from 'react-native-contacts';

// const {
//   images: {
//     screens: { creditech },
//   },
// } = Assets;

export const RefContactInfo: React.FC = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
    dependencies,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};
  const navigation = useNavigationUtils();
  const [formValid, setFormValid] = useState<boolean>(false);
  // const [canUseContactPicker, setCanUseContactPicker] =
  //   useState<boolean>(false);

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const stores = useStores();

  const [contactInfo, setContactInfo] = useState({
    postalAddress: [],
    emails: [],
    phones: [],
    familyName: '',
    givenName: '',
    name: '',
    selectedPhone: {type: 'Mobile', number: ''},
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [contacts, setContacts] = useState([]);

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'trusted_contact_info_continue',
        type: 'CTA',
        parameters: {
          name: contactInfo?.givenName ?? '',
          number: contactInfo?.selectedPhone?.number ?? '',
        },
      },
      stores,
    );

    const progress = {
      name: 'employmentStatus',
      params: {
        nationalId,
        categoriesData,
        selfiePic,
        dependencies,
        refContact: {
          ...contactInfo,
          selectedPhone: {
            ...contactInfo.selectedPhone,
            number: contactInfo.selectedPhone.number.replace('+2', ''),
          },
        },
        residentialStatus,
        userInputNationalId,
        personalDetails,
        referralType,
        referralCode,
        hasPromoCode,
      },
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate(progress);
    setIsLoading(false);
  };

  const onContinuePressed = () => {
    formValid && navigateToNextScreen();
  };

  // useEffect(() => {
  // if (contacts?.length > 0) {
  // const contactList = splitArray(contacts, 100);
  // try {
  // contactList.map((contactChunk) => {
  // stores.backend.instantApproval.collectContactsAndLogs({
  // contacts: contactChunk,
  // });
  // });
  // } catch (error) {}
  // }
  // }, [contacts]);

  // const getPermission = async () => {
  // Platform.OS === 'ios'
  // ? await request(PERMISSIONS.IOS.CONTACTS).then((result) => {
  // if (result === PermissionResult.granted) {
  // setCanUseContactPicker(true);
  // Contacts.getAll()
  // .then((userContacts) => {
  // setContacts(userContacts);
  // })
  // .catch((e) => {
  // console.log(e);
  // });
  // }
  // })
  // : await request(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
  // if (result === PermissionResult.granted) {
  // setCanUseContactPicker(true);
  // Contacts.getAll()
  // .then((contacts) => {
  // setContacts(contacts);
  // })
  // .catch((e) => {
  // console.log(e);
  // });
  // }
  // });
  // };

  useEffect(() => {
    // getPermission();
  }, []);

  useEffect(() => {
    if (contactInfo.name !== '' && contactInfo.selectedPhone.number !== '') {
      const regex = /^[0-9]{11}$/;
      if (
        (contactInfo.selectedPhone.number.length === 11 ||
          contactInfo.selectedPhone.number.length === 13) &&
        contactInfo.name.length >= 3 &&
        regex.test(contactInfo.selectedPhone.number?.replace('+2', ''))
      ) {
        setFormValid(true);
      } else {
        setFormValid(false);
      }
    } else {
      setFormValid(false);
    }
  }, [contactInfo]);

  // const getPhoneNumber = () => {
  // selectContactPhone().then((selection) => {
  // if (!selection) {
  // return null;
  // }
  // let { contact, selectedPhone } = selection;
  // setContactInfo({
  // ...contactInfo,
  // ...contact,
  // selectedPhone: {
  // ...selectedPhone,
  // number: selectedPhone.number.replace(/\s/g, ''),
  // },
  // });
  // });
  // };

  const renderRefContactName = () => {
    return (
      <DefaultTextInput
        title={translate('REF_CONTACT_NAME_2')}
        editable={true}
        value={contactInfo.name}
        placeholder={translate('REF_CONTACT_NAME_2')}
        onchangeText={text => {
          setContactInfo({...contactInfo, name: text});
        }}
        // icon={canUseContactPicker && creditech.contactUpload}
        iconWidth={19}
        iconHeight={19}
        // onPress={canUseContactPicker ? getPhoneNumber : null}
        viewStyle={{marginBottom: hp(20)}}
      />
    );
  };

  const renderRefContactNumber = () => {
    return (
      <DefaultTextInput
        title={translate('REF_CONTACT_NUMBER_2')}
        editable={true}
        keyboardType="numeric"
        value={contactInfo.selectedPhone.number}
        placeholder={translate('REF_CONTACT_NUMBER_2')}
        onchangeText={text => {
          setContactInfo({
            ...contactInfo,
            selectedPhone: {type: 'Mobile', number: text},
          });
        }}
        maxLength={contactInfo.selectedPhone.number?.includes('+') ? 13 : 11}
      />
    );
  };

  const renderRefContactDescription = () => {
    return (
      <View style={selectStyle('refContactDescriptionContainer')}>
        <Typography
          customStyles={() => ({text: selectStyle('refContactDescription')})}>
          {translate('WE_NEED_REF_CONTACT')}
        </Typography>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        removeCapitalization
        hideBack
        shapeVariant="yellow"
        showLogo>
        <KeyboardAwareScrollView style={selectStyle('mainContainer')}>
          <ContinueLater fromScreen="refContactInfo" />
          <PageTitle title={translate('REFERENCE_NUMBER_SCREEN_TITLE')} />

          {renderRefContactDescription()}

          {renderRefContactName()}

          {renderRefContactNumber()}
        </KeyboardAwareScrollView>

        <ContinueButton
          back
          onContinuePressed={onContinuePressed}
          completeForm={formValid}
        />
      </ScrollContainerWithNavHeader>

      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </View>
  );
};
