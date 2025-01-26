import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {useRoute} from '@react-navigation/native';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import PurchaseHistoryCard from 'src/components/PurchaseHistoryCard';
import InstantApprovalCard from 'src/components/InstantApprovalCard';
import ThingsYouCanDoCard from 'src/components/ThingsYouCanDoCard';
import NavigationHeader from 'src/components/NavigationHeader';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {Typography, useStyles} from 'elephanz-rn-ui';
import RejectedCard from 'src/components/RejectedCard';
import RowView from 'src/components/Wrappers/RowView';
import BalanceCard from 'src/components/BalanceCard';
import AppliedCard from 'src/components/AppliedCard';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import ViewAll from 'src/components/ViewAll';
import {LoadingState} from 'utils';
import {
  checkUserInstantApprovalStatus,
  returnCredit,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const manageCredit: React.FC = () => {
  const route: any = useRoute();

  const [loading, setLoading] = useState(false);
  const [toView, setToView] = useState<
    | 'creditActivated'
    | 'creditNotActivated'
    | 'noCredit'
    | 'rejected'
    | 'loading'
    | null
    | string
  >(null);

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();

  const stores = useStores();
  const userContracts = stores.backend.users.userContracts.data;
  const userCredit = stores.backend.users.userCredits.data;
  const credit = returnCredit(userCredit);
  const role = stores.backend.users.role;

  const {
    images: {
      screens: {creditech, instantApproval},
    },
  } = Assets;

  const checkInstantStatus = async () => {
    if (role !== 'GUEST') {
      checkUserInstantApprovalStatus(stores, setToView);
    } else {
      setToView('noCredit');
    }
  };

  const getNoonPaymentStatus = async () => {
    if (route?.params?.orderId) {
      try {
        setLoading(true);
        const status = await stores.backend.payment.getPaymentStatus(
          route?.params?.orderId,
        );
        setLoading(false);
        status?.orderStatus === 'CAPTURED'
          ? Alert.alert(
              '',
              tempTranslate(
                'Your Payment Was Successful!',
                'تم تأكيد الدفع بنجاح!',
              ),
              [{text: translate('GENERIC_CONFIRM')}],
            )
          : Alert.alert(
              '',
              tempTranslate('Payment declined', 'تم رفض العملية'),
              [{text: translate('GENERIC_CONFIRM')}],
            );
      } catch (e) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getNoonPaymentStatus();
    checkInstantStatus();
  }, []);

  const navigateQuickPay = () => {
    ApplicationAnalytics(
      {eventKey: 'manage_my_credit_quick_pay', type: 'CTA'},
      stores,
    );
    navigation.navigate('quickPay');
  };

  const navigatePayToOthers = () => {
    navigation.navigate('payToOthers');
    ApplicationAnalytics({eventKey: 'pay_to_others', type: 'CTA'}, stores);
  };

  const navigatePurchaseHistoryItemInfo = async item => {
    setLoading(true);
    try {
      stores.backend.users.setCurrentContract(item?.contractId);
      await stores.backend.users.getContractDetailsById();
      setLoading(false);
      navigation.navigate('installmentItemInfo', {
        purchaseData: {
          ...item,
          contractId: item?.contractId,
          merchant: item?.merchant,
        },
      });
      ApplicationAnalytics(
        {
          eventKey: 'purchase_installment_item',
          type: 'CTA',
          parameters: {
            installmentItem: item?.loanItem,
            contractId: item?.contractId,
          },
        },
        stores,
      );
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const CreditView = () => {
    let viewContent = null;
    if (toView === 'creditActivated')
      viewContent = credit?.limit ? <BalanceCard /> : null;
    else if (toView === 'creditNotActivated') viewContent = <AppliedCard />;
    else if (toView === 'noCredit')
      viewContent = <InstantApprovalCard withBackView noContracts />;
    else if (toView === 'rejected') viewContent = <RejectedCard />;
    else if (toView === 'loading')
      viewContent = (
        <View style={{height: hp(100), width: wp(340), alignItems: 'center'}}>
          <Typography>{translate('PLEASE_WAIT')}</Typography>
          <AnimatedLottieView
            source={instantApproval.loadingLottie}
            autoPlay
            loop
          />
        </View>
      );
    return <View style={selectStyle('balanceContainer')}>{viewContent}</View>;
  };

  const navigatePurchaseHistory = () => {
    ApplicationAnalytics(
      {eventKey: 'manage_my_credit_purchase_history', type: 'CTA'},
      stores,
    );
    navigation.navigate('purchaseHistory');
  };

  const renderPurchasesCards = ({item}) => {
    return (
      <PurchaseHistoryCard
        onPress={navigatePurchaseHistoryItemInfo}
        item={item}
      />
    );
  };

  const renderPurchases = () => {
    return (
      <ViewAll
        renderItems={renderPurchasesCards}
        onPress={navigatePurchaseHistory}
        data={userContracts}
        loading={
          stores.backend.users.userContracts.loadingState ===
          LoadingState.LOADING
        }
        title={translate('PURCHASES')}
        horizontal={true}
      />
    );
  };

  const renderFatorty = () => {
    return (
      <>
        <ViewAll showTitle hideViewAll title={translate('THINGS_YOU_CAN_DO')}>
          <RowView style={selectStyle('rowStyle')} mt={20}>
            <ThingsYouCanDoCard
              w={wp(160)}
              h={hp(160)}
              smallText={translate('FATORTY_TEXT')}
              item={{
                id: 0,
                name: translate('FATORTY'),
                icon: creditech.fatorty,
                onPress: () => {
                  ApplicationAnalytics(
                    {
                      eventKey: 'manage_my_credit_pay_with_fatorty',
                      type: 'CTA',
                    },
                    stores,
                  );
                  navigation.navigate('digitalFatorty');
                },
              }}
            />
            <ThingsYouCanDoCard
              w={wp(160)}
              h={hp(160)}
              smallText={translate('CALCULATOR_TEXT')}
              item={{
                id: 1,
                name: translate('CALCULATOR'),
                icon: creditech.Calculator,
                onPress: () => {
                  navigation.navigate('calculator');
                },
              }}
            />
          </RowView>
          <RowView style={selectStyle('rowStyle')} mt={12}>
            <ThingsYouCanDoCard
              w={wp(160)}
              smallText={translate('QUICK_PAY_TEXT')}
              item={{
                id: 0,
                name: translate('QUICK_PAY'),
                icon: creditech.QuickPay,
                onPress: navigateQuickPay,
              }}
            />
            <ThingsYouCanDoCard
              w={wp(160)}
              smallText={translate('PAY_TO_OTHERS_TEXT')}
              item={{
                id: 0,
                name: translate('PAY_TO_OTHERS'),
                icon: creditech.PayToOthers,
                onPress: navigatePayToOthers,
              }}
            />
          </RowView>
        </ViewAll>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={selectStyle('contentContainer')}
        style={selectStyle('mainContainer')}
        showsVerticalScrollIndicator={false}>
        <NavigationHeader
          shapeVariant="orange"
          title={translate('MY_CREDIT_LIMIT')}
          withUserImage={true}
        />
        <View style={{backgroundColor: '#F5F5F5'}}>
          <CreditView />
          {renderPurchases()}
          {renderFatorty()}
        </View>
      </ScrollView>
      {loading && <DefaultOverLayLoading />}
    </View>
  );
};
export const ManageCreditScreen = baseScreen(manageCredit, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
