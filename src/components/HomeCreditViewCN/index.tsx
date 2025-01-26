import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { BalanceInterface, purchaseHistoryCardItem } from 'src/Types';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import InstantApprovalCard from '../InstantApprovalCard';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import DefaultSeparator from '../DefaultSeparator';
import BillPaymentCard from '../BillPaymentCard';
import DefaultFlatList from '../DefaulFlatList';
import DefaultButton from '../DefaultButton';
import ProgressBar from '../ProgressBarCN';
import { PromoCodeStatus } from './types';
import RowView from '../Wrappers/RowView';
import {
  checkUserInstantApprovalStatus,
  combineMoneyCurrency,
  getRejectionData,
  returnArabicMonthName,
  returnCredit,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import { LoadingState } from 'utils';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';
import DefaultOverLayLoading from '../DefaultOverLayLoading';
import { useFocusEffect } from '@react-navigation/native';

const HomeCreditView: React.FC<any> = () => {
  const [sectionSelected, setSectionSelected] = useState(0);
  const [clientValidate, setClientValidate] = useState('false');
  const [isLoading, setIsLoading] = useState(false);
  const [clientStatus, setClientStatus] = useState(null);
  const [balance, setBalance] = useState<BalanceInterface | null>(null);
  const [toView, setToView] = useState<
    | 'creditActivated'
    | 'creditNotActivated'
    | 'noCredit'
    | 'rejected'
    | 'loading'
    | 'promoCode'
    | null
    | string
  >(null);

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  const stores = useStores();

  const userCredit = stores.backend.users.userCredits.data;
  const userCreditLoadingState =
    stores.backend.users.userCredits.loadingState === LoadingState.LOADING;
  const role = stores.backend.users.role;
  const userContracts = stores.backend.users?.userContracts?.data;
  const userActiveContracts = stores.backend.users?.userActiveContracts?.data;
  const instantApprovalStatus =
    stores.backend.instantApproval.instantApprovalStatus;
  const user = stores.backend.users.userData;

  const ScrollRef = useRef();

  const {
    images: {
      screens: { creditech, instantApproval },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const checkInstantStatus = async () => {
    if (role !== 'GUEST') {
      checkUserInstantApprovalStatus(stores, setToView);
    } else {
      setToView('noCredit');
    }
  };

  useEffect(() => {
    checkInstantStatus();
  }, []);

  const onManageMyCreditPress = () => {
    ApplicationAnalytics({ eventKey: 'manage_my_credit', type: 'CTA' }, stores);
    navigation.navigate('manageCredit');
  };

  const onQuickPayPress = () => {
    // navigation.navigate('quickPay');
    navigation.navigate('bookingAuthentication');

    ApplicationAnalytics({ eventKey: 'home_quick_pay', type: 'CTA' }, stores);
  };

  const onNavigateToBranches = () => {
    ApplicationAnalytics(
      { eventKey: 'home_activate_credit_cta', type: 'CTA' },
      stores,
    );

    navigation.navigate('branches', {
      data: stores.backend.general.branches.data,
    });
  };

  const fetchValidation = async () => {
    try {
      setIsLoading(true);
      const data = await stores.backend.instantApproval.validateHybrid(
        user?.nationalId,
      );
      if (data?.status === 'true') {
        fetchStatus();
      }

      setClientValidate(data?.status);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await stores.backend.instantApproval.hybridStatus(
        user?.nationalId,
      );
      setClientStatus(data);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role !== 'GUEST') {
      fetchValidation();
    }
  }, []);

  const NavigationButtonAction = () => {
    navigation.navigate('creditUpgrade', { title: 'Normal' });
  };

  const handleRejectionReasons = () => {
    let imageToView = '';
    let rejectionReasonText = '';
    let rejectionReasonText_body = '';
    let buttonText = '';
    let buttonAction = () => onNavigateToBranches();
    const initialValues = {
      imageToView,
      rejectionReasonText,
      rejectionReasonText_body,
      buttonText,
      buttonAction,
    };
    const rejectionNumber = getRejectionData(
      instantApprovalStatus?.rejectedReason,
    );

    ApplicationAnalytics(
      {
        eventKey: 'rejection-widget',
        type: 'STATUS',
        parameters: { rejectionNumber },
      },
      stores,
    );

    if (instantApprovalStatus?.rejectedFromOtherProducts) {
      imageToView = creditech.creditDisApprove;
      rejectionReasonText = translate(
        'REJECTED_WITH_SHOWSTOPPER_REASON_HEADLINE',
      );
      rejectionReasonText_body = translate(
        'REJECTED_WITH_SHOWSTOPPER_REASON_BODY',
      );
    } else if (clientValidate === 'false') {
      imageToView = creditech.creditDisApprove;
      rejectionReasonText = translate(
        'REJECTED_WITH_SHOWSTOPPER_REASON_HEADLINE',
      );
      rejectionReasonText_body = translate(
        'REJECTED_WITH_SHOWSTOPPER_REASON_BODY',
      );
      buttonText = translate('VISIT_BRANCH');
      buttonAction = () => onNavigateToBranches();
    } else if (clientValidate === 'true') {
      switch (clientStatus?.statusName) {
        case 'Pending Contact':
        case 'Pending':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate('NORMAL_ASSESSMENT_HEADLINE');
          rejectionReasonText_body = translate('NORMAL_ASSESSMENT_BODY');
          // buttonText = translate('REQUEST_MORE_INFO_BUTTON');
          // buttonAction = () => NavigationButtonAction();

          break;
        case '':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate(
            'MISSING_DATA_INCOMPLETE_DOX_HEADLINE',
          );
          rejectionReasonText_body = translate(
            'MISSING_DATA_INCOMPLETE_DOX_BODY',
          );
          buttonText = translate('REQUEST_MORE_INFO_BUTTON');
          buttonAction = () => NavigationButtonAction();
          break;

        case 'Pending Client':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate(
            'MISSING_DATA_INCOMPLETE_DOX_HEADLINE',
          );
          rejectionReasonText_body = translate(
            'MISSING_DATA_INCOMPLETE_DOX_BODY',
          );
          buttonText = translate('REQUEST_MORE_INFO_BUTTON');
          buttonAction = () => NavigationButtonAction();
          break;

        case 'Confirmed':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate('NORMAL_ASSESSMENT_HEADLINE');
          rejectionReasonText_body = translate('NORMAL_ASSESSMENT_BODY');
          break;
        case 'Done':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate('SIGN_CONTRACT_STEP_HEADLINE');
          rejectionReasonText_body = translate('SIGN_CONTRACT_STEP_BODY');
          buttonText = translate('VISIT_BRANCH');
          break;

        case 'Rejected':
          imageToView = creditech.creditDisApprove;
          rejectionReasonText = translate(
            'REJECTED_WITH_SHOWSTOPPER_REASON_HEADLINE',
          );
          rejectionReasonText_body = translate(
            'REJECTED_WITH_SHOWSTOPPER_REASON_BODY',
          );
          // buttonText = translate('VISIT_BRANCH');
          // buttonAction = () => navigation.navigate('');
          break;
        default:
          <DefaultOverLayLoading />;
      }
    }

    if (
      imageToView === initialValues.imageToView &&
      rejectionReasonText === initialValues.rejectionReasonText &&
      rejectionReasonText_body === initialValues.rejectionReasonText_body &&
      buttonText === initialValues.buttonText &&
      buttonAction === initialValues.buttonAction
    ) {
      return <DefaultOverLayLoading style={{ backgroundColor: 'white' }} />;
    }
    return {
      imageToView,
      rejectionReasonText,
      buttonText,
      rejectionReasonText_body,
      buttonAction,
    };
  };

  const handlePromoCodeView = (promoCodeStatus) => {
    let imageToView = creditech.creditDisApprove;
    let rejectionReasonText = translate('PC_HOLD');

    switch (promoCodeStatus) {
      case PromoCodeStatus.PENDING_DOCS:
        imageToView = creditech.creditDisApprove;
        rejectionReasonText = translate('PC_PENDING_DOC');
        break;

      case PromoCodeStatus.PENDING_APPROVAL:
        imageToView = creditech.rejectionVariantTwo;
        rejectionReasonText = translate('PC_PENDING_APPROVAL');
        break;

      case PromoCodeStatus.HOLD:
        imageToView = creditech.creditDisApprove;
        rejectionReasonText = translate('PC_HOLD');
        break;

      case PromoCodeStatus.REJECTED:
        imageToView = creditech.rejectionVariantTwo;
        rejectionReasonText = translate('REJECTION_REASON_TWO');
        break;

      default:
        break;
    }

    return {
      imageToView,
      rejectionReasonText,
      buttonText: '',
      rejectionReasonText_body: '',
      buttonAction: null,
    };
  };

  // To Show Credit Tab and ...etc
  const renderSectionsTitles = () => {
    return (
      <ScrollView
        ref={ScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={selectStyle('sectionsContainer')}
      >
        <Pressable
          onPress={() => {
            ApplicationAnalytics(
              { eventKey: 'home_credit', type: 'CTA' },
              stores,
            );
            setSectionSelected(0);
          }}
          style={[
            selectStyle('sectionBaseStyle'),
            sectionSelected === 0
              ? selectStyle('selectedSection')
              : selectStyle('notSelectedSection'),
          ]}
        >
          <Typography
            customStyles={() => ({
              text:
                sectionSelected === 0
                  ? selectStyle('sectionTextSelected')
                  : selectStyle('sectionText'),
            })}
          >
            {translate('CREDIT')}
          </Typography>
        </Pressable>

        <Pressable
          onPress={() => {
            ApplicationAnalytics(
              { eventKey: 'home_bill_payment', type: 'CTA' },
              stores,
            );
            setSectionSelected(3);
          }}
          style={[
            selectStyle('sectionBaseStyle'),
            sectionSelected === 3
              ? selectStyle('selectedSection')
              : selectStyle('notSelectedSection'),
          ]}
        >
          <Typography
            customStyles={() => ({
              text:
                sectionSelected === 3
                  ? selectStyle('sectionTextSelected')
                  : selectStyle('sectionText'),
            })}
          >
            {translate('BILL_PAYMENT')}
          </Typography>
        </Pressable>
      </ScrollView>
    );
  };

  const onNavigateCreditUpgrade = () => {
    if (userCredit[0]?.limit) {
      navigation.navigate('creditUpgrade', { title: 'Increase limit' });
    } else {
      Alert.alert('', translate('MUST_HAVE_CREDIT'), [
        { text: translate('GENERIC_CONFIRM') },
      ]);
    }
  };

  // const balance: BalanceInterface = returnCredit(userCredit);


  useFocusEffect(
    useCallback(() => {
      const newBalance = returnCredit(userCredit);
      console.log("lskdhvsd");
      setBalance(newBalance);
      return () => {
        setBalance(null);
      };
    }, [userCredit])
  );
  
  // To handle the Credit Balance
  const renderSectionsContent = () => {
    if (!userCreditLoadingState) {
      if (balance?.limit) {
        return (
          <View>
            <Typography
              customStyles={() => ({
                text: selectStyle('creditText'),
              })}
            >
              {combineMoneyCurrency(balance?.amount)}
            </Typography>

            <Typography
              customStyles={() => ({
                text: selectStyle('limitText'),
              })}
            >
              {`${translate('AVAILABLE_BALANCE')}: ${combineMoneyCurrency(
                balance?.limit,
              )} `}
              <Typography
                customStyles={() => ({
                  text: selectStyle('limitTextUnderLine'),
                })}
                onPress={() => {
                  ApplicationAnalytics(
                    {
                      eventKey: 'credit_tab_increase_limit',
                      type: 'CTA',
                    },
                    stores,
                  );
                  onNavigateCreditUpgrade();
                }}
              >
                {translate('INCREASE_LIMIT')}
              </Typography>
            </Typography>
          </View>
        );
      } else {
        return null;
      }
    } else {
      return <ActivityIndicator size={'large'} color={common.darkBlue} />;
    }
  };

  const renderLoanTypeIcon = (item: any) => {
    return (
      <View style={selectStyle('loanIconTypeContainer')}>
        <SvgView
          svgFile={item.imageUrl}
          width={18}
          height={12}
          style={selectStyle('loanImage')}
        />

        <Typography
          customStyles={() => ({
            text: selectStyle('loanTypeText'),
          })}
        >
          {item?.loanType}
        </Typography>
      </View>
    );
  };

  const renderLoanNamePrice = (item: purchaseHistoryCardItem) => {
    const totalPrice = item?.totalAmount;
    return (
      <View style={selectStyle('loanNamePriceContainer')}>
        <Typography
          numberOfLines={3}
          customStyles={() => ({
            text: selectStyle('loanNameText'),
          })}
        >
          {item?.loanItem}
        </Typography>

        <Typography
          customStyles={() => ({
            text: selectStyle('loanPriceText'),
          })}
        >
          {combineMoneyCurrency(totalPrice)}
        </Typography>
      </View>
    );
  };

  const renderLoanProgress = (item: purchaseHistoryCardItem) => {
    return (
      <ProgressBar
        showMonthNumber={item?.totalPaidMonths}
        total={item?.totalInstallmentMonths}
        part={item?.totalPaidMonths}
      />
    );
  };

  const renderLoans = ({ item, index }) => {
    return (
      <View
        style={[
          selectStyle('loanItemContainer'),
          index !== 0 && { marginTop: hp(17) },
        ]}
      >
        {renderLoanTypeIcon({
          imageUrl: creditech.Cart,
          loanType: item.loanTypeName ? item.loanTypeName : item.loanType,
        })}

        <View style={selectStyle('loanColumnData')}>
          {renderLoanNamePrice(item)}

          {renderLoanProgress(item)}

          <Typography
            marginTop={4}
            fontSize={12}
            colorHex={common.blackesh}
            textAlign="right"
          >
            {`${item?.totalInstallmentMonths} ${tempTranslate(
              'Months',
              returnArabicMonthName(item?.totalInstallmentMonths),
            )}`}
          </Typography>
        </View>
      </View>
    );
  };

  const renderLoansList = (loansNum?: number) => {
    const contractsLoading =
      stores.backend.users.userContracts.loadingState === LoadingState.LOADING;
    const activeContractsLoading =
      stores.backend.users.userActiveContracts.loadingState ===
      LoadingState.LOADING;

    if (userContracts?.length > 0 || userActiveContracts?.length > 0) {
      return (
        <DefaultFlatList
          style={{ alignItems: 'stretch' }}
          flatListProps={{
            data:
              userActiveContracts && userActiveContracts?.length > 0
                ? userActiveContracts?.slice(0, loansNum ?? 2)
                : userContracts && userContracts?.slice(0, loansNum ?? 2),
            renderItem: renderLoans,
          }}
          isFetchingData={
            stores.backend.users.userContracts.loadingState ===
              LoadingState.LOADING ||
            stores.backend.users.userActiveContracts.loadingState ===
              LoadingState.LOADING
          }
        />
      );
    } else if (activeContractsLoading || contractsLoading) {
      return <ActivityIndicator size={'large'} color={common.darkBlue} />;
    }
  };

  const renderContractsCTA = () => {
    return (
      <View style={selectStyle('actionContainer')}>
        <DefaultButton
          titleStyle={{ fontSize: hp(12) }}
          variant="secondaryBackground"
          title={translate('MANAGE_CREDIT')}
          onPress={onManageMyCreditPress}
          buttonStyle={selectStyle('buttonStyle')}
        />

        <DefaultButton
          titleStyle={{ fontSize: hp(12) }}
          // variant="secondaryBackground"
          // title={translate('QUICK_PAY')}
           title={translate("BUY_NOW")}
          onPress={onQuickPayPress}
          buttonStyle={selectStyle('buttonStyle')}
        />
      </View>
    );
  };

  const renderSeparator = () =>
    returnCredit(userCredit)?.limit ? (
      <DefaultSeparator
        mb={
          (userContracts && userContracts?.length > 0) ||
          (userActiveContracts && userActiveContracts?.length > 0)
            ? 0
            : 20
        }
        mt={20}
      />
    ) : null;

  const hasCredit = () => {
    return (
      <>
        {renderSectionsContent()}

        {renderSeparator()}

        {renderLoansList()}

        {(balance?.limit ||
          (userContracts && userContracts?.length > 0) ||
          (userActiveContracts && userActiveContracts?.length > 0)) &&
          renderContractsCTA()}
      </>
    );
  };

  const renderAppliedWithContracts = () => {
    return (
      <>
        <RowView>
          <Image
            resizeMode="contain"
            source={creditech.successImage}
            style={selectStyle('sideImage')}
          />

          <View style={{ marginStart: wp(12) }}>
            <Typography fontSize={14} fontWeight="700">
              {translate('APPROVED_FOR')}
            </Typography>

            <Typography fontSize={24} fontWeight="700">
              {instantApprovalStatus?.limit &&
                combineMoneyCurrency(instantApprovalStatus?.limit)}
            </Typography>

            <Typography
              customStyles={() => ({
                text: { lineHeight: hp(20) },
              })}
              fontSize={12}
            >
              {translate('ONE_STEP_LEFT')}
            </Typography>
          </View>
        </RowView>

        <DefaultButton
          title={translate('ACTIVATE_CREDIT')}
          mt={8}
          width={147}
          onPress={() => {
            ApplicationAnalytics(
              { eventKey: 'home_activate_credit_cta', type: 'CTA' },
              stores,
            );

            navigation.navigate('creditActivationEnquiry');
          }}
        />
        {renderLoansList(1)}

        {renderContractsCTA()}
      </>
    );
  };

  const renderRejectedWithContracts = () => {
    const {
      imageToView,
      rejectionReasonText,
      buttonText,
      buttonAction,
      rejectionReasonText_body,
    } = handleRejectionReasons() || {};
    return (
      <>
        <RowView>
          <Image
            resizeMode="contain"
            source={imageToView}
            style={selectStyle('sideImage')}
          />

          <View style={{ marginStart: wp(12), paddingEnd: wp(32) }}>
            <Typography
              customStyles={() => ({
                text: { lineHeight: hp(20) },
              })}
              fontSize={12}
              fontWeight="700"
            >
              {rejectionReasonText}
            </Typography>
            <Typography
              customStyles={() => ({
                text: { lineHeight: hp(20) },
              })}
              fontSize={12}
            >
              {rejectionReasonText_body}
            </Typography>
          </View>
        </RowView>
        {buttonText?.length > 0 && (
          <DefaultButton
            title={buttonText}
            mt={12}
            variant={'secondaryBackground'}
            width={188}
            onPress={() => buttonAction()}
          />
        )}

        {renderLoansList(1)}
        {renderContractsCTA()}
      </>
    );
  };

  const renderRejectedWithNoContracts = (promoCodeStatus?) => {
    const {
      imageToView,
      rejectionReasonText,
      buttonText,
      buttonAction,
      rejectionReasonText_body,
    } = promoCodeStatus
      ? handlePromoCodeView(promoCodeStatus)
      : handleRejectionReasons() || {};

    return (
      <View>
        <Image
          resizeMode="contain"
          source={imageToView}
          style={
            imageToView === creditech.creditDisApprove
              ? selectStyle('disapprovedImage')
              : selectStyle('variantImage')
          }
        />

        <Typography
          customStyles={() => ({
            text: { lineHeight: hp(25) },
          })}
          marginTop={0}
          fontWeight="700"
          colorHex={common.blackesh}
          fontSize={14}
        >
          {rejectionReasonText}
        </Typography>
        <Typography
          customStyles={() => ({
            text: { lineHeight: hp(18), marginTop: hp(8) },
          })}
          marginTop={0}
          fontWeight="400"
          colorHex={common.blackesh}
          fontSize={12}
        >
          {rejectionReasonText_body}
        </Typography>

        {buttonText?.length > 0 && (
          <DefaultButton
            title={buttonText}
            mt={12}
            variant={'secondaryBackground'}
            width={188}
            onPress={() => buttonAction()}
          />
        )}
      </View>
    );
  };

  const loadingContainer = () => {
    return (
      <View
        style={{
          height: hp(300),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ height: hp(100) }}>
          <Typography>{translate('PLEASE_WAIT')}</Typography>
          <AnimatedLottieView
            source={instantApproval.loadingLottie}
            autoPlay
            loop
          />
        </View>
      </View>
    );
  };

  const renderAppliedNoContracts = () => {
    return (
      <>
        <Typography
          customStyles={() => ({
            text: selectStyle('limitText'),
          })}
        >
          {translate('APPROVED_FOR')}
        </Typography>

        <Typography
          marginTop={10}
          customStyles={() => ({
            text: selectStyle('creditText'),
          })}
        >
          {instantApprovalStatus?.limit &&
            combineMoneyCurrency(instantApprovalStatus?.limit)}
        </Typography>

        <Typography
          customStyles={() => ({
            text: { lineHeight: hp(20) },
          })}
          marginTop={20}
          fontSize={14}
        >
          {translate('ONE_STEP_LEFT')}
        </Typography>
        <View style={{ marginTop: hp(20) }}>
          <DefaultButton
            title={translate('ACTIVATE_CREDIT')}
            width={305}
            onPress={() => {
              ApplicationAnalytics(
                { eventKey: 'home_activate_credit_cta', type: 'CTA' },
                stores,
              );
              navigation.navigate('creditActivationEnquiry');
            }}
          />
        </View>
      </>
    );
  };

  const applied = () => {
    return (
      <View>
        {(userContracts && userContracts?.length > 0) ||
        (userActiveContracts && userActiveContracts?.length > 0)
          ? renderAppliedWithContracts()
          : renderAppliedNoContracts()}
      </View>
    );
  };

  const userRejected = () => {
    return (
      <View>
        {(userContracts && userContracts?.length > 0) ||
        (userActiveContracts && userActiveContracts?.length > 0)
          ? renderRejectedWithContracts()
          : renderRejectedWithNoContracts()}
      </View>
    );
  };

  const creditView = () => {
    let viewContent = null;

    switch (sectionSelected) {
      case 0:
        if (toView?.split(' ')[0] === 'promoCode') {
          viewContent = renderRejectedWithNoContracts(toView?.split(' ')[1]);
        } else if (toView === 'creditActivated') viewContent = hasCredit();
        else if (toView === 'creditNotActivated') viewContent = applied();
        else if (toView === 'noCredit')
          viewContent = (
            <InstantApprovalCard
              mt={0}
              renderLoansList={renderLoansList}
              renderContractsCTA={renderContractsCTA}
            />
          );
        else if (toView === 'rejected') viewContent = userRejected();
        else if (toView === 'loading') viewContent = loadingContainer();
        else if (toView == null) {
          viewContent =
            ((userContracts && userContracts?.length > 0) ||
              (userActiveContracts && userActiveContracts?.length > 0)) &&
            balance?.limit ? (
              <>
                {renderSectionsContent()}
                {renderLoansList()}
                {renderContractsCTA()}
              </>
            ) : balance?.limit ? (
              renderSectionsContent()
            ) : (userContracts && userContracts?.length > 0) ||
              (userActiveContracts && userActiveContracts?.length > 0) ? (
              <>
                {renderLoansList()}
                {renderContractsCTA()}
              </>
            ) : null;
        }
        break;

      case 3:
        viewContent = <BillPaymentCard />;
        break;

      default:
        viewContent = null;
        break;
    }
    return (
      <View>
        {renderSectionsTitles()}
        <View style={selectStyle('container')}>
          {isLoading ? (
            <View
              style={{
                width: '100%',
                height: 120,
              }}
            >
              <DefaultOverLayLoading style={{ backgroundColor: 'white' }} />
            </View>
          ) : (
            <>{viewContent}</>
          )}
        </View>
        {/* <View style={selectStyle('container')}>{viewContent}</View> */}
      </View>
    );
  };

  return <>{creditView()}</>;
};

export default observer(HomeCreditView);
