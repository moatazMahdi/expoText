import React, {useEffect, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import TransActionHistoryCard from 'src/components/TransActionHistoryCard';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {combineMoneyCurrency} from 'src/utils/HelpersFunctions';
import {BottomContainer} from 'src/components/BottomContainer';
import DefaultButton from 'src/components/DefaultButton';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {hp} from 'src/utils/Dimensions/dimen';
import PayModal from 'src/components/PayModal';
import ViewAll from 'src/components/ViewAll';
import SvgView from 'src/components/SvgView';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import {InstallmentItemInfoInterface, purchaseHistoryCardItem} from 'src/Types';
import styles from './styles';

const installmentItemInfo: React.FC = () => {
  const route: any = useRoute();
  const purchaseItem: purchaseHistoryCardItem = route?.params?.purchaseData;

  const [item, setItem] = useState<InstallmentItemInfoInterface | any>(null);
  const [earlyPayment, setEarlyPayment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();

  const stores = useStores();
  const fetchedItem = stores.backend.users.currentContract;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const installmentContent = [
    {id: 0, name: translate('ITEM_NAME'), data: item?.loanItem},
    {id: 1, name: translate('STORE'), data: item?.merchant},
    {
      id: 2,
      name: translate('PRICE'),
      data: combineMoneyCurrency(item?.totalAmount),
    },
    {
      id: 3,
      name: translate('PURCHASE_DATE'),
      data: fetchedItem?.contractDate,
    },
    {
      id: 4,
      name: translate('INSTALLMENT_PERIOD'),
      data: `${item?.totalInstallmentMonths} ${translate('MONTHS')}`,
    },
    {
      id: 5,
      name: translate('PAID_INSTALLMENT_PERIOD'),
      data: `${item?.totalPaidMonths} ${translate('MONTHS')}`,
    },
  ];

  useEffect(() => {
    let fullData = {
      ...fetchedItem,
      loanItem: purchaseItem.loanItem,
      loanType: purchaseItem.loanType,
      totalInstallmentMonths: purchaseItem.totalInstallmentMonths,
      totalPaidMonths: purchaseItem.totalPaidMonths,
      contractId: purchaseItem?.contractId,
      merchant: purchaseItem.merchant,
    };
    setItem(fullData);
  }, []);

  const navigateTransactionHistory = () => {
    navigation.navigate('transactionHistory', {
      fromItemInfo: true,
      data: item?.lastTransactions,
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        scrollViewStyle={{paddingBottom: hp(100)}}
        title={translate('PURCHASE_DETAILS')}>
        <View style={selectStyle('contractDetailsContainer')}>
          {item && fetchedItem?.remainingAmount > 0 ? (
            <View style={selectStyle('installmentContentContainer')}>
              <Typography fontWeight="700">
                {translate('UPCOMING_INSTALLMENT')}
              </Typography>

              <Typography
                customStyles={() => ({
                  text: selectStyle('upComingInstallmentPriceText'),
                })}>
                {combineMoneyCurrency(item?.nextInstallmentAmount)}
              </Typography>

              <Typography
                customStyles={() => ({
                  text: selectStyle('lateFeesText'),
                })}>
                {`${item?.latePaymentFees} ${translate('LATE_FEES')}`}
              </Typography>

              {purchaseItem?.earlyEligible ? (
                <>
                  <View style={selectStyle('separatorStyle')} />

                  <Pressable
                    style={selectStyle('payAllInstallmentsBtn')}
                    onPress={async () => {
                      try {
                        setIsLoading(true);
                        const data =
                          await stores.backend.users.calculateEarlyPayment(
                            '' + purchaseItem?.contractId,
                          );
                        setEarlyPayment(data);
                        setIsLoading(false);
                        setShowModal(true);
                      } catch ({response}) {
                        setIsLoading(false);
                        if (response.data.status != '401')
                          Alert.alert('', translate('ERROR'), [
                            {text: translate('GENERIC_CONFIRM')},
                          ]);
                      }
                    }}>
                    <Typography
                      customStyles={() => ({
                        text: selectStyle('payAllInstallmentsText'),
                      })}>
                      {translate('SETTLE_LOAN_NOW')}
                    </Typography>
                    <SvgView
                      svgFile={creditech.RightArrow}
                      height={20}
                      width={20}
                      noRTL
                    />
                  </Pressable>
                </>
              ) : null}
            </View>
          ) : null}

          <View style={selectStyle('installmentContentContainer')}>
            {installmentContent?.map(item => {
              return (
                <>
                  <View style={selectStyle('rowContainer')}>
                    <Typography
                      customStyles={() => ({
                        text: selectStyle('nameContainer'),
                      })}>
                      {item?.name}
                    </Typography>

                    <Typography
                      // numberOfLines={1}
                      customStyles={() => ({
                        text: selectStyle('dataText'),
                      })}>
                      {item?.data}
                    </Typography>
                  </View>
                  {item?.id !== installmentContent?.length - 1 && (
                    <View style={selectStyle('separatorStyle')} />
                  )}
                </>
              );
            })}
          </View>
        </View>

        <PayModal
          getContracts={() => {
            stores.backend.users.userContracts.data;
          }}
          screen={'installmentItemInfo'}
          loading={loading}
          setLoading={setLoading}
          closeModal={() => {
            setShowModal(false);
            setEarlyPayment(null);
          }}
          showModal={showModal}
          contract={item}
          amount={earlyPayment?.dueAmount}
          isEarly={earlyPayment?.dueAmount ? true : false}
          earlyCardFees={earlyPayment?.ccFeesPrecent}
          earlySettlementDetails={earlyPayment}
        />

        <ViewAll
          renderItems={({item}) => (
            <TransActionHistoryCard fromItemInfo item={item} />
          )}
          onPress={navigateTransactionHistory}
          data={item?.lastTransactions}
          title={translate('PAYMENT_HISTORY')}
          containerStyle={selectStyle('transactionHistoryContainer')}
          itemsWrapperStyle={{
            marginBottom: 0,
            paddingEnd: 0,
          }}
          isVertical
        />
      </ScrollContainerWithNavHeader>

      {fetchedItem?.remainingAmount > 0 ? (
        <View style={selectStyle('footerContainer')}>
          <BottomContainer>
            <DefaultButton
              title={translate('PAY_DUE_INSTALLMENT')}
              onPress={() => {
                setShowModal(true);
                setEarlyPayment(null);
              }}
            />
          </BottomContainer>
        </View>
      ) : null}

      {(loading || isLoading) && <DefaultOverLayLoading />}
    </View>
  );
};

export const InstallmentItemInfo = baseScreen(installmentItemInfo, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
