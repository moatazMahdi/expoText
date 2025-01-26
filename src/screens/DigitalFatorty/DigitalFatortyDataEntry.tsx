import React, {useEffect, useState} from 'react';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import {baseScreen} from 'hoc';
import styles from './styles';
import {
  combineMoneyCurrency,
  formatMoney,
  getCurrency,
  getTodayDate,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {Icon, View} from 'native-base';
import SvgView from 'src/components/SvgView';
import DefaultButton from 'src/components/DefaultButton';
import RowView from 'src/components/Wrappers/RowView';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ProgressiveImage from 'src/components/ProgressiveImage';
import PressableChoice from 'src/components/PressableChoice';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {LoadingState, uploadDocs} from 'utils';
import numbro from 'numbro';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {BottomContainer} from 'src/components/BottomContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DocumentPicker from 'react-native-document-picker';
import FatortyDisclaimer from 'src/components/FatortyDisclaimer';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import IconCard from 'src/components/IconCard';
import Svg, {Circle, Path} from 'react-native-svg';
import moment from 'moment';
import BillDetails from 'src/components/BillDetails';
import FatortyInvoiceCard from 'src/components/FatortyInvoiceCard';
interface FatortyDataEntryInterface {}
interface PhotoInterface {
  uri: string;
  height?: number;
  width?: number;
  type?: string;
}

const digitalFatortyDataEntry: React.FC<FatortyDataEntryInterface> = () => {
  const stores = useStores();

  const params = useRoute()?.params as {
    photo: PhotoInterface;
    gallery: boolean;
    thumbnail: PhotoInterface;
  };

  const navigation = useNavigationUtils();

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();
  const [thumbnail, setThumbnail] = useState<PhotoInterface>();
  const [photo, setPhoto] = useState<PhotoInterface>(null);
  const [amountValue, setAmountValue] = React.useState<number>(0);
  const availableMonths = [6, 12, 18, 24, 30, 36];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [disclaimer, setDisclaimer] = useState<boolean>(false);
  const [months, setMonths] = React.useState<string>('');
  //  x.invoiceDate, x.isInvoice, x.totalInvoiceAmount
  const [isInvoice, setIsInvoice] = React.useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = React.useState<string>('');
  const [errorMessages, setErrorMessages] = React.useState<any>();
  //////
  const [isModifying, setIsModifying] = React.useState<boolean>(false);

  const [fatortyBillUri, setFatortyBillUri] = React.useState<string>('');

  const [fatortyAmountValue, setFatortyAmountValue] = React.useState<number>(0);

  const [isAmountValueValid, setIsAmountValueValid] =
    React.useState<boolean>(true);

  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);

  const [invoiceId, setInvoiceId] = React.useState<boolean>(null);

  const [lastValidAmountValue, setLastValidAmountValue] = useState<
    number | null
  >(null);

  //invoiceId
  //setIsAmountValueValid
  //const fatortyAmountValue = amountValue;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  // useEffect(() => {
  //   setAmountValue(amountValue);
  // }, [disclaimer, months]);

  //-------------------------------------------
  useEffect(() => {
    async function fetchData() {
      const token = stores.backend.auth.getAccessToken();
      let fatortyBillUri = await uploadDocs({
        token,
        fileType: params?.photo?.type,
        id: `${userData.id}_${new Date().getTime()}_fatortyBill.jpg`, //id unique for each user photo
        photoURI: photo.uri, // photo.uri,
      });
      return fatortyBillUri;
    }

    try {
      setIsLoading(true); // uncommint it to show loading
      photo?.uri &&
        fetchData()
          .then(fatortyBillUri => {
            // call api
            const fatortyOcrData = stores.backend.products.getFatortyOcrData({
              invoiceUrl: fatortyBillUri,
            });
            setFatortyBillUri(fatortyBillUri);
            return fatortyOcrData;
          })
          .then(OcrData => {
            setInvoiceId(OcrData.invoiceId);
            setIsInvoice(OcrData.isInvoice);
            setInvoiceDate(OcrData.invoiceDate);
            if (I18nManager.isRTL) {
              setErrorMessages(OcrData.errorMessages[0]?.errorMessageAr);
            } else {
              setErrorMessages(OcrData.errorMessages[0]?.errorMessageEn);
            }
            setAmountValue(OcrData.totalInvoiceAmount);
            setFatortyAmountValue(OcrData.totalInvoiceAmount);

            return OcrData;
          })
          .then(({isInvoice, errorMessages}) => {
            let errorMessageInLang;

            if (I18nManager.isRTL) {
              errorMessageInLang = errorMessages[0]?.errorMessageAr;
            } else {
              errorMessageInLang = errorMessages[0]?.errorMessageEn;
            }

            if (!isInvoice) {
              navigation.navigate('digitalFatorty', {
                isInvoice: false,
                openCameraModal: true,
                approvementPointsData: {
                  type: 'error',
                  points: errorMessageInLang,
                },
                photo: photo,
                thumbnail: thumbnail,
                isInvoiceError: true,
                isAgreed: true,
              });
            } else {
              setIsLoading(false);
            }
          })
          .catch(error => {
            // remove navigation when thy fix th response
            navigation.navigate('digitalFatorty', {
              isInvoice: false,
              openCameraModal: true,
              approvementPointsData: {type: 'error', points: errorMessages},
              photo: photo,
              thumbnail: thumbnail,
              isAgreed: true,
            });

            setIsLoading(false);

          });
    } catch (error) {
      setIsLoading(false);
      navigation.navigate('digitalFatorty', {
        isInvoice: false,
        openCameraModal: true,
        approvementPointsData: {
          type: 'error',
          points: errorMessages,
          isAgreed: true,
        },
        photo: photo,
        thumbnail: thumbnail,
        isAgreed: true,
      });
    }
  }, [photo]);

  useEffect(() => {
    if (amountValue && amountValue < 500) {
      ApplicationAnalytics(
        {
          eventKey: 'fatorty',
          type: 'STATUS',
          parameters: {name: 'Balance_below_minimum'},
        },
        stores,
      );
    }
  }, [amountValue]);

  const valueLoading =
    stores.backend.products.digitalFatortyResult.loadingState ===
    LoadingState.LOADING;

  const userData = stores.backend.users.userData;

  const resultAmountValue = stores.backend.products.digitalFatortyResult?.data
    ?.installmentValue
    ? stores.backend.products.digitalFatortyResult.data?.installmentValue
    : null;

  const fatortyAdminFees =
    stores.backend.products.digitalFatortyResult.data?.fatortyAdminFees ?? null;

  const adminFeesValue = stores.backend.products.digitalFatortyResult.data
    ?.adminFeesValue
    ? stores.backend.products.digitalFatortyResult.data?.adminFeesValue
    : null;
  const resultAmount =
    resultAmountValue && !Number.isNaN(resultAmountValue)
      ? numbro(resultAmountValue).format({
          thousandSeparated: true,
        })
      : '';

  useEffect(() => {
    params?.photo && setPhoto(params?.photo);
    params?.thumbnail && setThumbnail(params?.thumbnail);
  }, []);

  const getLoanResult = async (months: string, amountValue: number) => {
    await stores.backend.products.digitalFatortyResult.updateOptions({
      id: userData?.id,
      clientId: userData.nationalId,
      tenor: months,
      loanAmount: amountValue,
    });
  };

  const isFormValid = () =>
    months.length > 0 &&
    amountValue &&
    amountValue > 0 &&
    amountValue >= 500 &&
    isAmountValueValid === true;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (months && amountValue) {
        try {
          setBalanceLoading(true);
          await stores.backend.products.validateBalance({
            loanAmount: +amountValue,
            nationalId: userData.nationalId,
          });
          getLoanResult(months, amountValue || 0);
        } catch (error) {
          setDisclaimer(true);
          // setAmountValue(null);
        } finally {
          setBalanceLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [months, isConfirmed]);

  const onNavigateCamera = () => {
    navigation.navigate('camera', {
      hideCameraContainer: true,
      setPhoto: data => setPhoto(data),
      setThumbnail: data => setThumbnail(data),
      justPicData: true,
      title: translate('SCANNED_RECEIPT'),
      controlQuality: 0.2,
      fatortyScan: true,
    });
  };

  const onUploadFromGallery = async () => {
    try {
      const pick = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      if (pick?.type !== 'image/jpeg') {
        const result = await PdfThumbnail.generate(pick.uri, 0);
        setThumbnail(result);
      }
      setPhoto({uri: pick?.path, ...pick});
    } catch (error) {
      DocumentPicker.isCancel(error);
    }
  };
  const handleChangeAmount = (text: string) => {
    if (text.length === 0) {
      setAmountValue(null);
      setLastValidAmountValue(null);
    } else if (!Number.isNaN(Number(text.replace(/,/g, '')))) {
      const newAmountValue = Number(text.replace(/,/g, '')).toString();
      setAmountValue(Number(newAmountValue));

      if (Number(newAmountValue) <= fatortyAmountValue) {
        setIsAmountValueValid(true);
      } else {
        setIsAmountValueValid(false);
      }

      if (+newAmountValue > 1000000000) {
        if (lastValidAmountValue !== null) {
          setAmountValue(lastValidAmountValue);
        }
      } else {
        // Update the last valid value and set the new valid value
        setAmountValue(+newAmountValue);
        setLastValidAmountValue(+newAmountValue);
      }

      setDisclaimer(false);
    }
  };

  const renderCancel = () => {
    return (
      <DefaultButton
        mt={20}
        variant="secondaryBackground"
        mb={10}
        onPress={() => navigation.goBack()}
        title={translate('CANCEL')}
      />
    );
  };

  const renderHeader = (data: {
    title: string;
    rightTitle?: string;
    svgFile?: any;
    onPress?: () => void;
  }) => {
    const {title, rightTitle, svgFile, onPress} = data;
    return (
      <RowView
        jc="center"
        style={{
          ...selectStyle('headerItemContainer'),
          // width: '100%',
          // backgroundColor: 'green'
        }}>
        {rightTitle && (
          <IconCard leftIcon={svgFile} title={rightTitle} onPress={onPress} />
        )}
      </RowView>
    );
  };

  const renderInstallmentValue = () => {
    //when click on modify button
    return isModifying ? (
      <>
        <Typography
          style={{
            color: '#020B19',
            fontFamily: 'Ping LCG',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: 24,
            marginVertical: 16,
            justifyContent: 'flex-start',
            width: '100%',
            marginLeft: 54,
          }}>
          {translate('INVOICE_AMOUNT')}
        </Typography>

        <View
          style={{
            height: 70,
            width: '100%',
            padding: 16,
            marginBottom: 9,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginBottom: 28,
            }}>
            <TextInput
              placeholder={translate('INVOICE_AMOUNT')}
              value={amountValue && amountValue + ''}
              keyboardType="numeric"
              onChangeText={handleChangeAmount}
              style={[selectStyle('inputStyle')]}
            />

            <DefaultButton
              title={translate('CONFIRM')}
              width={wp(113)}
              titleStyle={{
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Ping LCG',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: 24,
              }}
              disabled={!isAmountValueValid || amountValue < 500}
              buttonStyle={{height: 50}}
              onPress={() => {
                setIsConfirmed(!isConfirmed);
                setIsModifying(false);
                setAmountValue(amountValue);
              }}></DefaultButton>
          </View>
          {
            <Typography
              style={{
                color: 'red',
                fontSize: 12,
                marginTop: 10,
                marginLeft: 10,
              }}>
              {amountValue < 500
                ? tempTranslate(
                    'Invoice amount is less than the minimum limit',
                    ' قيمة الفاتوره اقل من الحد الادنى ',
                  )
                : isAmountValueValid === false
                ? translate('INVALID_AMOUNT')
                : ''}
            </Typography>
          }
        </View>
      </>
    ) : (
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 87,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 16,
        }}>
        <View>
          <Typography
            style={{
              fontFamily: 'Ping LCG',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 16,
            }}>
            {translate('INVOICE_AMOUNT')}
          </Typography>

          <Typography
            style={{
              color: '#081F6F',
              fontFamily: 'Ping LCG',
              fontSize: 24,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 32,
            }}>
            {combineMoneyCurrency(amountValue)}
          </Typography>

          <Typography
            style={{
              color: '#020B19',
              fontFamily: 'Ping LCG',
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 24,
            }}>
            {translate('FATORTY_INVOICE_DATE')}
          </Typography>
        </View>

        <View style={{}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '86%',
            }}>
            <View style={{}}>
              {/* SVG && Modify */}
              <Pressable
                onPress={() => {
                  setIsConfirmed(!isConfirmed);
                  setIsModifying(true);
                  setAmountValue(0);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <SvgView
                    svgFile={creditech.invoiceIcon}
                    width={16}
                    height={16}
                    style={{
                      marginRight: wp(6),
                    }}
                  />
                  <Typography style={{color: '#FD8326'}}>
                    {translate('FATORTY_MODIFY')}
                  </Typography>
                </View>
              </Pressable>
              {/* Date Style  */}
            </View>
          </View>
          <Typography
            style={{
              color: '#98A2B3', // Equivalent to var(--BG-Text-Subtitle, #98A2B3)
              fontFamily: 'Ping LCG',
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 24,
              // marginTop: 24,
              // backgroundColor: 'red'
            }}>
            {/* {params?.gallery ?  invoiceDate  : '12-12-2021'} */}
            {/* {invoiceDate} */}
            {moment(invoiceDate, 'M/D/YYYY h:mm:ss A').format('D/M/YYYY')}
          </Typography>
        </View>
      </View>
    );
  };

  const renderMonths = ({item}) => {
    return (
      <PressableChoice
        style={{
          padding: 8,
        }}
        onPress={() => {
          ApplicationAnalytics(
            {eventKey: 'fatorty_chosen_tenor', type: 'CTA'},
            stores,
          );
          setMonths(item + '');
        }}
        item={item}
        selectedId={months}
        itemId={item?.toString()}
        title={item + ' ' + translate('MONTHS')}
      />
    );
  };

  const renderMonthsList = () => {
    return (
      <>
        <Typography
          style={{
            fontFamily: 'Ping LCG',
            fontSize: 14,
            color: '#020B19',
            fontWeight: '700',
            lineHeight: 16,
            marginBottom: hp(12),
          }}>
          {translate('DURATION')}
        </Typography>
        <DefaultFlatList
          isFetchingData={false}
          style={{marginTop: 0}}
          flatListProps={{
            horizontal: true,
            showsHorizontalScrollIndicator: true,
            data: availableMonths ? availableMonths : [],
            renderItem: renderMonths,
            extraData: [months],
          }}
        />
      </>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          ...selectStyle('DataEntryContentContainer'),
          backgroundColor: '#fafafa',
        }}>
        <View
          style={
            {
              // backgroundColor: 'red',
            }
          }>
          {renderHeader({
            title: translate('SCANNED_RECEIPT'),
            rightTitle: params?.gallery
              ? translate('FATORTY_UPLOAD')
              : translate('FATORTY_RESCAN'),
            svgFile: params?.gallery ? creditech.Gallery : creditech.rescanIcon,
            onPress: () => {
              ApplicationAnalytics(
                {
                  eventKey: params?.gallery
                    ? 'fatorty_reupload'
                    : 'fatorty_retake',
                  type: 'CTA',
                },
                stores,
              );
              params?.gallery ? onUploadFromGallery() : onNavigateCamera();
            },
          })}
        </View>

        {/* fatorty invoice card  */}
        <FatortyInvoiceCard
          photo={photo}
          thumbnail={thumbnail}
          isInvoice={isInvoice}
        />

        <DropShadowWrapper
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            marginBottom: hp(16),
            elevation: 0,
          }}>
          {renderInstallmentValue()}
        </DropShadowWrapper>

        {renderMonthsList()}
        {isFormValid() && resultAmountValue && !disclaimer && !isConfirmed ? (
          <>
            {/* <Typography style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: hp(8),
                color: '#020B19'
              }}>{translate('REVIEW_BILL_DETAILS')}</Typography> */}
            <BillDetails
              isLoading={valueLoading || isLoading || balanceLoading}
              Amount={resultAmountValue}
              feesAmount={adminFeesValue}
              screenName={'DigitalFatortyDataEntry'}
            />
          </>
        ) : null}
      </View>
    );
  };

  const submitFatortyInstallmentApproval = async () => {
    ApplicationAnalytics(
      {eventKey: 'fatorty_requestInstallment_Action', type: 'CTA'},
      stores,
    );
    try {
      setIsLoading(true);
      // const token = stores.backend.auth.getAccessToken();
      // let fatortyBillUri = await uploadDocs({
      //   token,
      //   fileType: params?.photo?.type,
      //   id: `${userData.id}_${new Date().getTime()}_fatortyBill`, //id unique for each user photo
      //   photoURI: photo.uri,
      // });
      /**
       * to do send approval request here send @param amountValue @param months @param uploadedPhoto
       */
      await stores.backend.products.digitalFatortySubmit.updateOptions({
        clientId: userData.nationalId,
        tenor: months,
        price: `${amountValue}`,
        invoiceDate: getTodayDate(),
        invoiceMerchant: 'Contact',
        invoiceUrl: fatortyBillUri, // make it as sate
        fatortyAdminFees: `${fatortyAdminFees}`,
        adminFees: adminFeesValue,
      });

      // navigation.replace({ name: 'fatortyApprovalMessage' });
      navigation.navigate('digitalFatortyOptions', {
        fatortyResultAmount: `${resultAmountValue}`,
        fatortyAmount: `${amountValue}`,
        invoiceNo: stores.backend.products.digitalFatortySubmit.data?.invoiceNo,
        invoiceUrl: fatortyBillUri,
        feesAmount: `${adminFeesValue}`,
        invoiceId: invoiceId,
        fatortyAdminFees,
        adminFeesValue,
      });
    } catch (error) {
      ApplicationAnalytics(
        {
          eventKey: 'fatorty_requestInstallment Failed',
          type: 'STATUS',
        },
        stores,
      );
      Alert.alert('', translate('ERROR')),
        [{text: translate('GENERIC_CONFIRM')}];
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderButtonsContainer = () => {
    return (
      <View>
        {disclaimer && (
          <FatortyDisclaimer
            title={translate('FATOORTY_CREDIT_LIMIT_EXCEED')}
            onPress={() => {
              navigation.navigate('creditUpgrade');
            }}
            buttonTitle={translate('INCREASE_LIMIT')}
            backColor="#FFE2E1"
            svgIcon={creditech.AttentionIcon}
            style={selectStyle('disclaimerStyle')}
          />
        )}
        <BottomContainer>
          <DefaultButton
            onPress={submitFatortyInstallmentApproval}
            loading={valueLoading || isLoading || balanceLoading}
            disabled={
              isModifying || // Disable if isModifying is true
              disclaimer === true || // Disable if disclaimer is exactly true
              isConfirmed ||
              valueLoading ||
              !(isFormValid() && resultAmountValue) ||
              isLoading ||
              balanceLoading
            }
            title={translate('REQUEST_INSTALLMENT')}
          />
          {renderCancel()}
          <Typography
            // fontSize={36}
            fontSize={10}
            customStyles={() => ({
              text: {
                marginBottom: hp(5),
                textAlign: 'center',
                marginHorizontal: 20,
              },
            })}>
            {translate('FATORTY_FEES')}
          </Typography>
        </BottomContainer>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FaFaFa'}}>
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        // hideBack
        title={translate('REVIEW_FATORTY_SCAN')}>
        {isLoading ? (
          <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
        ) : (
          <KeyboardAwareScrollView
            style={{backgroundColor: '#FaFaFa', flex: 1}}>
            {renderContent()}
          </KeyboardAwareScrollView>
        )}
        {!isLoading && renderButtonsContainer()}
      </ScrollContainerWithNavHeader>
    </View>
  );
};
export const DigitalFatortyDataEntry = baseScreen(digitalFatortyDataEntry, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
