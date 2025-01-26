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
import {View} from 'native-base';
import SvgView from 'src/components/SvgView';
import DefaultButton from 'src/components/DefaultButton';
import RowView from 'src/components/Wrappers/RowView';
import {Alert, Pressable, TextInput} from 'react-native';
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

interface FatortyDataEntryInterface {}
interface PhotoInterface {
  uri: string;
  height?: number;
  width?: number;
  type?: string;
}

const fatortyDataEntry: React.FC<FatortyDataEntryInterface> = () => {
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
  const [modify, setModify] = useState<boolean>(true);
  const [amountValue, setAmountValue] = React.useState<any | null>(null);
  const availableMonths = [6, 12, 18, 24, 30, 36];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [disclaimer, setDisclaimer] = useState<boolean>(false);
  const [months, setMonths] = React.useState<string>('');
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

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
    stores.backend.products.fatortyResult.loadingState === LoadingState.LOADING;

  const userData = stores.backend.users.userData;

  const resultAmountValue = stores?.backend?.products?.fatortyResult?.data
    ?.installmentValue
    ? stores?.backend?.products?.fatortyResult?.data?.installmentValue
    : null;

  const fatortyAdminFees = stores.backend.products.fatortyResult.data
    ?.fatortyAdminFees
    ? stores.backend.products.fatortyResult.data?.fatortyAdminFees
    : null;

  const adminFeesValue = stores.backend.products.fatortyResult.data
    ?.adminFeesValue
    ? stores.backend.products.fatortyResult.data?.adminFeesValue
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
    await stores.backend.products.fatortyResult.updateOptions({
      id: userData?.id,
      clientId: userData.nationalId,
      tenor: months,
      loanAmount: amountValue,
    });
  };

  const isFormValid = () =>
    months.length > 0 && amountValue && amountValue > 0 && amountValue >= 500;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (isFormValid()) {
        try {
          setBalanceLoading(true);
          await stores.backend.products.validateBalance({
            loanAmount: +amountValue,
            nationalId: userData.nationalId,
          });
          getLoanResult(months, amountValue || 0);
        } catch (error) {
          setDisclaimer(true);
          setAmountValue(null);
        } finally {
          setBalanceLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [months, amountValue]);

  const onNavigateCamera = () => {
    navigation.navigate('camera', {
      hideCameraContainer: true,
      setPhoto: data => setPhoto(data),
      setThumbnail: data => setThumbnail(data),
      justPicData: true,
      title: translate('SCANNED_RECEIPT'),
      controlQuality: 0.2,
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
    } else if (!Number.isNaN(Number(text.replace(/,/g, '')))) {
      setAmountValue(Number(text.replace(/,/g, '')).toString());
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
      <RowView jc="center" style={selectStyle('headerItemContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('headerItemText'),
          })}>
          {title}
        </Typography>
        {rightTitle && (
          <DropShadowWrapper style={selectStyle('headerItemRightContainer')}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp(7),
              }}
              onPress={onPress}>
              <SvgView me={7} svgFile={svgFile} width={20} height={20} />
              <Typography
                fontSize={12}
                colorHex={modify ? common.lightGreen : common.darkBlue}>
                {rightTitle}
              </Typography>
            </Pressable>
          </DropShadowWrapper>
        )}
      </RowView>
    );
  };

  const renderInstallmentValue = () => {
    return modify ? (
      <View style={{marginBottom: hp(5)}}>
        <TextInput
          placeholder={translate('INVOICE_AMOUNT')}
          value={amountValue && amountValue + ''}
          keyboardType="phone-pad"
          onChangeText={handleChangeAmount}
          style={[selectStyle('inputStyle')]}
        />
      </View>
    ) : (
      <View style={{marginBottom: hp(30)}}>
        <Typography
          fontSize={36}
          customStyles={() => ({
            text: {},
          })}>
          {`${amountValue ? formatMoney(amountValue) : 0} ${getCurrency()}`}
        </Typography>
      </View>
    );
  };

  const renderMonths = ({item}) => {
    return (
      <PressableChoice
        style={{}}
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
    );
  };

  const renderCalculatedInstallmentValue = () => (
    <View>
      {renderHeader({
        title: translate('INSTALLMENT_AMOUNT'),
      })}
      <Typography
        customStyles={() => ({
          text: selectStyle('installmentAmountText'),
        })}>
        {combineMoneyCurrency(resultAmount)} {translate('PER_MONTH')}
      </Typography>
    </View>
  );

  const renderContent = () => {
    return (
      <View style={selectStyle('DataEntryContentContainer')}>
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
        <ProgressiveImage
          resizeMode="cover"
          imageStyle={selectStyle('imageStyle')}
          imageSource={
            !photo?.type
              ? photo
              : photo?.type === 'image/jpeg'
              ? {uri: photo?.uri}
              : {uri: thumbnail?.uri}
          }
        />

        {renderHeader({
          title: translate('INVOICE_AMOUNT'),
          rightTitle: modify ? translate('CONFIRM') : translate('MODIFY'),
          svgFile: creditech.modifyIcon,
          onPress: () => {
            modify
              ? ApplicationAnalytics(
                  {eventKey: 'fatorty_confirm', type: 'CTA'},
                  stores,
                )
              : ApplicationAnalytics(
                  {eventKey: 'fatorty_modify', type: 'CTA'},
                  stores,
                );

            setModify(!modify);
          },
        })}
        {renderInstallmentValue()}
        {amountValue && amountValue < 500 && (
          <Typography
            fontSize={12}
            colorHex={common.paleRed}
            customStyles={() => ({
              text: {},
            })}>
            {tempTranslate(
              'Amount must be 500 or greater',
              'يجب أن يكون المبلغ 500 أو أكثر',
            )}
          </Typography>
        )}

        {fatortyAdminFees && amountValue && amountValue >= 500 && (
          <Typography>
            {translate('FATORTY_THERE_ARE_FEES') +
              ' ' +
              combineMoneyCurrency(+fatortyAdminFees)}
          </Typography>
        )}

        {renderHeader({
          title: translate('DURATION'),
        })}

        {renderMonthsList()}

        {isFormValid() && resultAmountValue
          ? renderCalculatedInstallmentValue()
          : null}
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
      const token = stores.backend.auth.getAccessToken();
      let fatortyBillUri = await uploadDocs({
        token,
        fileType: params?.photo?.type,
        id: `${userData.id}_${new Date().getTime()}_fatortyBill`, //id unique for each user photo
        photoURI: photo.uri,
      });
      /**
       * to do send approval request here send @param amountValue @param months @param uploadedPhoto
       */
      await stores.backend.products.fatortySubmit.updateOptions({
        clientId: userData.nationalId,
        tenor: months,
        price: `${amountValue}`,
        invoiceDate: getTodayDate(),
        invoiceMerchant: 'Contact',
        invoiceUrl: fatortyBillUri, // make it as sate
        fatortyAdminFees: `${fatortyAdminFees}`,
        adminFees: adminFeesValue,
      });

      navigation.replace({name: 'fatortyApprovalMessage'});
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
    <View style={{flex: 1}}>
      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        showLogo
        hideBack
        showFloatingActionButton>
        <KeyboardAwareScrollView>{renderContent()}</KeyboardAwareScrollView>
        {renderButtonsContainer()}
      </ScrollContainerWithNavHeader>
    </View>
  );
};
export const FatortyDataEntry = baseScreen(fatortyDataEntry, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
