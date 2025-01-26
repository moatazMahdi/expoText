import React, {useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import BillDetails from 'src/components/BillDetails';
import DefaultButton from 'src/components/DefaultButton';
import InfoBox from 'src/components/InfoBox';
import {WalletForm, WalletTypeOptions} from 'src/Types';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';

const digitalFatortyOptions: React.FC = () => {
  const {
    fatortyResultAmount,
    fatortyAmount,
    invoiceNo,
    invoiceUrl,
    feesAmount,
    invoiceId,
    fatortyAdminFees,
    adminFeesValue,
  } =
    (useRoute().params as {
      fatortyAmount: string;
      fatortyResultAmount: string;
      invoiceNo: string;
      invoiceUrl: string;
      feesAmount: string;
      invoiceId: number;
      fatortyAdminFees: any;
      adminFeesValue: any;
    }) || {};

  const [selectedItem, setSelectedItem] = useState<number>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();

  const stores = useStores();
  const {userData} = stores.backend.users;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const digitalOptions = [
    {
      id: 0,
      // name: translate('BANK_WALLET'),
      name: translate('WALLET'),
      imageSrc: creditech.DigitalWallet,
      showCheckbox: true,
      noteMessage: translate('INSTANT_TRANSFER'),
      onPress: () => {
        async function verifyPhone(values: WalletForm) {
          try {
            setIsLoading(true);
            const verifyPhoneCodeRes =
              await stores.backend.auth.verifyPhoneNumber(
                userData.phone.replace(/^\+2/, ''),
                "digitalFatorty",
                "digitalFatorty"
              );
            setIsLoading(false);
            navigation.navigate('verification', {
              phoneNumber: userData.phone.replace(/^\+2/, ''),
              fromScreen: 'digitalFatortyOptions',
              otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
              fatortyAmount,
              invoiceNo,
              invoiceUrl,
              nID: userData?.nationalId,
              mobileNumber: userData?.phone,
              walletType: WalletTypeOptions.TELECOM_WALLET,
              invoiceId,
              fatortyAdminFees,
              adminFeesValue,
              // canCreateBioMetricFromLogin: canCreateBioMetric,
            });
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

        const onSubmit = async (values: WalletForm) => {
          try {
            verifyPhone({
              nID: userData?.nationalId,
              mobileNumber: userData?.phone,
              walletType: WalletTypeOptions.TELECOM_WALLET,
            });
          } catch (e) {
            Alert.alert('', translate('ERROR'), [
              {text: translate('GENERIC_CONFIRM')},
            ]);
          }
        };

        onSubmit({
          nID: userData?.nationalId,
          mobileNumber: userData?.phone,
          walletType: WalletTypeOptions.TELECOM_WALLET,
        });
      },
    },
    // {
    //   id: 1,
    //   name: translate('BANK_WALLET'),
    //   imageSrc: creditech.BankWallet,
    //   noteMessage: translate('INSTANT_TRANSFER'),
    //   showCheckbox: true,
    //   onPress: () => {
    //     async function verifyPhone(values: WalletForm) {
    //       try {
    //         setIsLoading(true);
    //         const verifyPhoneCodeRes =
    //           await stores.backend.auth.verifyPhoneNumber(
    //             userData.phone.replace(/^\+2/, ''),
    //           );
    //         setIsLoading(false);
    //         navigation.navigate('verification', {
    //           phoneNumber: userData.phone.replace(/^\+2/, ''),
    //           fromScreen: 'digitalFatortyOptions',
    //           otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
    //           fatortyAmount,
    //           invoiceNo,
    //           invoiceUrl,
    //           nID: userData?.nationalId,
    //           mobileNumber: userData?.phone,
    //           walletType: WalletTypeOptions.BANK_WALLET,
    //           invoiceId,
    //         });
    //       } catch (error) {
    //         setIsLoading(false);
    //         console.error('Error in verification:', error);
    //         error.response.data.statusCode === 400 &&
    //           Alert.alert(
    //             tempTranslate('Error', 'خطأ'),
    //             tempTranslate(
    //               'You sent to much, Try Again later',
    //               'لقد حاولت العديد من المرات الرجاء المحاوله في وقت لاحق',
    //             ),
    //             [{ text: translate('GENERIC_CONFIRM') }],
    //           );
    //       }
    //     }

    //     const onSubmit = async (values: WalletForm) => {
    //       try {
    //         await verifyPhone({
    //           nID: userData?.nationalId,
    //           mobileNumber: userData?.phone,
    //           walletType: WalletTypeOptions.BANK_WALLET,
    //         });
    //       } catch (error) {
    //         console.error('Error in onSubmit:', error);
    //       }
    //     };

    //     // Example call to onSubmit
    //     onSubmit({
    //       nID: userData?.nationalId,
    //       mobileNumber: userData?.phone,
    //       walletType: WalletTypeOptions.BANK_WALLET,
    //     });
    //   },
    //   // navigation.navigate('digitalFatortyWallet', {
    //   //   fatortyAmount,
    //   //   invoiceNo,
    //   //   invoiceUrl,
    //   // }),
    // },
    {
      id: 2,
      name: translate('BANK_TRANSFER'),
      imageSrc: creditech.BankTransfer,
      noteMessage: translate('RECEIVING_IN_2_5_DAYS'),
      showCheckbox: true,
      onPress: () => {
        navigation.navigate('digitalFatortyBankTransfer', {
          fatortyAmount,
          invoiceNo,
          invoiceUrl,
          invoiceId,
          fatortyAdminFees,
          adminFeesValue,
        });
      },
    },
  ];

  const renderItem = (item, selectedItem, setSelectedItem, setIsChecked) => {
    const isSelected = item.id === selectedItem;
    const itemStyle = isSelected
      ? {
          backgroundColor: '#FD8326',
          color: '#FD8326',
          backgroundIconColor: '#FDF6E7',
          svgColor: '#FD8326',
        }
      : {
          backgroundColor: '#E6E6E6',
          color: '#31363F',
          backgroundIconColor: '#F0F4F8',
          svgColor: '#4B5565',
        };

    return (
      <View style={{flexDirection: 'row'}} key={item.id}>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: wp(4),
            borderWidth: 1,
            borderRadius: 8,
            padding: wp(12),
            borderColor: itemStyle.backgroundColor,
          }}
          onPress={() => {
            setSelectedItem(item.id);
            setIsChecked(false);
          }}>
          <View style={{flexDirection: 'row', ...selectStyle('viewContainer')}}>
            <View
              style={{
                backgroundColor: itemStyle.backgroundIconColor,
                padding: hp(7),
                borderRadius: 24,
                marginHorizontal: wp(8),
              }}>
              <SvgView svgFile={item.imageSrc} width={22} height={22} />
            </View>
            <View>
              <Typography
                fontSize={16}
                fontWeight={'500'}
                customStyles={() => ({
                  text: {
                    color: itemStyle.color,
                  },
                  margin: wp(16),
                })}>
                {item.name}
              </Typography>
              <Typography
                fontSize={11}
                customStyles={() => ({
                  text: {
                    color: itemStyle.color,
                  },
                  margin: wp(16),
                })}>
                {item.noteMessage}
              </Typography>
            </View>
          </View>
          <View
            style={{
              ...selectStyle('radioButton'),
              borderColor: itemStyle.backgroundColor,
            }}>
            {isSelected && <View style={selectStyle('radioButtonIcon')} />}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      title={translate('CHOSE_PAYMENT_METHOD')}>
      {isLoading ? (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: '#F5F5F5',
            height: '100%',
          }}>
          <View style={{flex: 1, marginHorizontal: wp(16), height: '100%'}}>
            <DropShadowWrapper
              style={{...selectStyle('optionsContainer'), elevation: 0}}>
              <View style={{width: '100%'}}>
                {digitalOptions.map(item =>
                  renderItem(item, selectedItem, setSelectedItem, setIsChecked),
                )}
                {selectedItem !== null && (
                  <InfoBox
                    messageKey={'FATORTY_OTP_INFO'}
                    additionalText={userData.phone}
                    iconColor="#31363F"
                    backgroundColor="#F0F4F8"
                    textColor="#31363F"
                    leftBarColor="#4B5565"
                    containerStyle={{
                      marginHorizontal: hp(0),
                      borderRadius: hp(12),
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  />
                )}
              </View>
            </DropShadowWrapper>
            {/* <Typography style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginVertical: hp(12),
              color: '#020B19'
            }}>{translate('REVIEW_BILL_DETAILS')}</Typography> */}
            <BillDetails
              Amount={fatortyAmount}
              feesAmount={feesAmount}
              screenName={'DigitalFatortyOptions'}
              style={{marginBottom: hp(14)}}
            />
            <InfoBox
              messageKey={'FATORTY_ADMIN_FEES_INFO'}
              containerStyle={{
                marginHorizontal: hp(0),
                borderRadius: hp(12),
              }}
            />
          </View>
          <DefaultButton
            title={translate('CONFIRM')}
            onPress={() => {
              digitalOptions
                .filter(item => item.id === selectedItem)[0]
                .onPress();
            }}
            disabled={selectedItem === null}
            mb={hp(20)}
          />
        </View>
      )}

      {/* //////////////////////////// */}
      {/* {isLoading ? <DefaultOverLayLoading message={translate('PLEASE_WAIT')} /> : <View style={{ justifyContent: 'center', backgroundColor: 'white', height: '100%' }}>
        <View style={{ flex: 1, marginHorizontal: wp(16), height: '100%' }}>
          <DropShadowWrapper style={selectStyle('optionsContainer')}>
            <View style={{
              width: '100%',
            }}>
              {digitalOptions.map((item) => (
                <View style={{
                  flexDirection: 'row',
                }}>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      margin: wp(4),
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: wp(12),
                      borderColor: '#E6E6E6'
                    }}
                    key={item.id}
                    onPress={() => {
                      setSelectedItem(item.id);
                      setIsChecked(false);
                    }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      ...selectStyle('viewContainer'),

                    }}>
                      {
                        item.id === selectedItem ? <>
                          <View style={{
                            backgroundColor: '#FDF6E7',
                            padding: hp(7),
                            borderRadius: 24,
                            marginHorizontal: wp(8)
                          }}>
                            <SvgView svgFile={item.imageSrc} width={22} height={22} />
                          </View>
                          <View>

                            <Typography fontSize={16} fontWeight={'500'} customStyles={() => ({
                              text: { color: '#FD8326' },
                              margin: wp(16),
                            })}>
                              {item.name}
                            </Typography>

                            <Typography
                              fontSize={10}
                              marginRight={wp(6)}
                              marginLeft={wp(6)}
                              customStyles={() => ({
                              })} >{item.noteMessage}</Typography>

                          </View>

                        </>
                          : <>
                            <View style={{ backgroundColor: '#F0F0F0', padding: hp(7), borderRadius: 24, marginHorizontal: wp(8) }}>
                              <SvgView svgFile={item.imageSrc} width={22} height={22} />
                            </View>
                            <Typography fontSize={16} fontWeight={'500'} customStyles={() => ({
                              text: { color: '#31363F' },
                              margin: wp(16),
                            })}>
                              {item.name}
                            </Typography>
                            <Typography fontSize={10} marginRight={wp(6)} marginLeft={wp(6)}  >({item.noteMessage})</Typography>
                          </>
                      }

                    </View>

                    <View style={selectStyle('radioButton')}>
                      {item.id === selectedItem && (
                        <View style={selectStyle('radioButtonIcon')} />
                      )}
                    </View>

                  </Pressable>
                </View>
              ))}
              {
                selectedItem !== null && <InfoBox
                  messageKey={'FATORTY_OTP_INFO'}
                  additionalText={userData.phone}
                  iconColor='#31363F'
                  backgroundColor='#F0F4F8'
                  textColor='#31363F'
                  leftBarColor='#4B5565'
                  containerStyle={{ marginHorizontal: hp(0), borderRadius: hp(12), overflow: 'hidden' }}
                />
              }
            </View>
          </DropShadowWrapper>
          <Typography style={{
            fontSize: 14,
            fontWeight: 'bold',
            marginVertical: hp(12),
            color: '#020B19'
          }}>{translate('REVIEW_BILL_DETAILS')}</Typography>
          <BillDetails Amount={fatortyAmount} feesAmount={feesAmount} screenName={'DigitalFatortyOptions'} style={
            { marginBottom: hp(14) }
          } />
          <InfoBox messageKey={'FATORTY_ADMIN_FEES_INFO'}
            containerStyle={{ marginHorizontal: hp(0), borderRadius: hp(12), }}
          />
        </View> */}

      {/* <DefaultButton
        title={translate('CONFIRM')}
        onPress={() => {
          digitalOptions[selectedItem].onPress();

        }}
        disabled={selectedItem === null}

        mb={hp(20)}
      />
    </View>} */}
    </ScrollContainerWithNavHeader>
  );
};

export const DigitalFatortyOptions = baseScreen(digitalFatortyOptions, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
