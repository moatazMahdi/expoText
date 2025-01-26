import React, {useEffect} from 'react';
import {I18nManager, View} from 'react-native';
import {useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import RowView from 'src/components/Wrappers/RowView';
import DefaultButton from 'src/components/DefaultButton';
import {hp} from 'src/utils/Dimensions/dimen';
import {plansItem} from 'src/components/PlansCard/types';
import DefaultSeparator from 'src/components/DefaultSeparator';
import {BottomContainer} from 'src/components/BottomContainer';

const plansCompare: React.FC = () => {
  const {data} = useRoute().params as {data: plansItem[]};

  const {resetTo, goBack} = useNavigationUtils();
  const {selectStyle} = useStyles(styles);

  const {
    theme: {
      palette: {
        common: {white, brightGray},
      },
    },
  } = useTheme();

  const {translate} = useLocalization();

  const [plansCompare, setPlansCompare] = React.useState(null);

  const formatPlans = () => {
    let newPlans = [];
    const firstPlan = data[0];
    const secondPlan = data[1];
    handlePlansTenor(firstPlan, secondPlan, newPlans);
    handleDownPayment(firstPlan, secondPlan, newPlans);
    handleAllowDownPayment(firstPlan, secondPlan, newPlans);
    handleInterestRate(firstPlan, secondPlan, newPlans);
    setPlansCompare(newPlans);
  };

  useEffect(() => {
    formatPlans(data);
  }, []);

  const handlePlansTenor = (firstPlan, secondPlan, newPlans) => {
    if (firstPlan['maxTenor'] || secondPlan['maxTenor']) {
      if (firstPlan['minTenor'] || secondPlan['minTenor']) {
        let firstPlanTenorValue = '';
        let SecondPlanTenorValue = '';
        if (firstPlan['maxTenor'] && firstPlan['minTenor']) {
          var firstMaxTenor = Math.floor(firstPlan['maxTenor'] / 12);
          var firstMinTenor = Math.floor(firstPlan['minTenor'] / 12);

          if (firstMaxTenor - firstMinTenor > 3) {
            firstPlanTenorValue = `${translate(
              'UP_TO',
            )} ${firstMaxTenor} ${translate('YEARS')}`;
          } else if (firstMaxTenor === firstMinTenor) {
            SecondPlanTenorValue = `${firstMinTenor} ${
              firstMinTenor > 1 ? translate('YEARS') : translate('YEAR')
            }`;
          } else {
            firstPlanTenorValue = `${firstMinTenor}-${firstMaxTenor} ${translate(
              'YEARS',
            )}`;
          }
        }
        if (secondPlan['maxTenor'] && secondPlan['minTenor']) {
          var secondMaxTenor = Math.floor(secondPlan['maxTenor'] / 12);
          var secondMinTenor = Math.floor(secondPlan['minTenor'] / 12);
          if (secondMaxTenor - secondMinTenor > 3) {
            SecondPlanTenorValue = `${translate(
              'UP_TO',
            )} ${secondMaxTenor} ${translate('YEARS')}`;
          } else if (secondMaxTenor === secondMinTenor) {
            SecondPlanTenorValue = `${secondMinTenor} ${
              secondMinTenor > 1 ? translate('YEARS') : translate('YEAR')
            }`;
          } else {
            SecondPlanTenorValue = `${secondMinTenor}-${secondMaxTenor} ${translate(
              'YEARS',
            )}`;
          }
        }
        newPlans.push({
          title: translate('INSTALLMENT_PLANS'),
          firstPlanValue: firstPlanTenorValue,
          secondPlanValue: SecondPlanTenorValue,
        });
      }
    }
  };

  const handleDownPayment = (firstPlan, secondPlan, newPlans) => {
    if (firstPlan['downPayment'] || secondPlan['downPayment']) {
      let firstPlanDownPaymentValue = '';
      let SecondPlanDownPaymentValue = '';
      if (firstPlan['downPayment'] || firstPlan['downPayment'] === 0) {
        firstPlanDownPaymentValue = `${firstPlan['downPayment']}%`;
      }
      if (secondPlan['downPayment'] || secondPlan['downPayment'] === 0) {
        SecondPlanDownPaymentValue = `${secondPlan['downPayment']}%`;
      }
      newPlans.push({
        title: translate('DOWN_PAYMENT'),
        firstPlanValue: firstPlanDownPaymentValue,
        secondPlanValue: SecondPlanDownPaymentValue,
      });
    }
  };

  const handleAllowDownPayment = (firstPlan, secondPlan, newPlans) => {
    if (firstPlan['allowDownPayment'] || secondPlan['allowDownPayment']) {
      let firstPlanAllowDownPaymentValue = '';
      let SecondPlanAllowDownPaymentValue = '';
      if (firstPlan['allowDownPayment']) {
        firstPlanAllowDownPaymentValue = translate('YES');
      } else {
        firstPlanAllowDownPaymentValue = translate('NO');
      }
      if (secondPlan['allowDownPayment']) {
        SecondPlanAllowDownPaymentValue = translate('YES');
      } else {
        SecondPlanAllowDownPaymentValue = translate('NO');
      }
      newPlans.push({
        title: translate('ALLOW_DOWN_PAYMENT'),
        firstPlanValue: firstPlanAllowDownPaymentValue,
        secondPlanValue: SecondPlanAllowDownPaymentValue,
      });
    }
  };

  const handleInterestRate = (firstPlan, secondPlan, newPlans) => {
    if (firstPlan['interestRate'] || secondPlan['interestRate']) {
      let firstPlanInterestRateValue = '';
      let SecondPlanInterestRateValue = '';
      if (firstPlan['interestRate']) {
        firstPlanInterestRateValue = `${firstPlan['interestRate']}%`;
      }
      if (secondPlan['interestRate']) {
        SecondPlanInterestRateValue = `${secondPlan['interestRate']}%`;
      }
      newPlans.push({
        title: translate('INTEREST_RATE'),
        firstPlanValue: firstPlanInterestRateValue,
        secondPlanValue: SecondPlanInterestRateValue,
      });
    }
  };

  const renderBottomButtons = () => {
    return (
      <BottomContainer>
        <DefaultButton
          onPress={() => goBack()}
          title={translate('BACK_TO_COMPARISON')}
        />

        <DefaultButton
          mt={10}
          variant="secondaryBackground"
          title={translate('GO_HOME')}
          onPress={() => {
            resetTo({name: 'home'});
          }}
        />
      </BottomContainer>
    );
  };

  const renderTitles = () => {
    return (
      <RowView style={{justifyContent: 'center'}} mt={10}>
        {data &&
          data?.map((item: plansItem) => {
            return (
              <Typography
                customStyles={() => ({
                  text: selectStyle('planTitleText'),
                })}>
                {item.title}
              </Typography>
            );
          })}
      </RowView>
    );
  };

  const renderDetails = () => {
    return (
      <View>
        {data?.reduce(() => {
          return plansCompare?.map(
            (item: {
              title: string;
              firstPlanValue: string;
              secondPlanValue: string;
            }) => {
              return (
                <View style={{paddingTop: hp(20), alignItems: 'center'}}>
                  <DefaultSeparator mb={20} />
                  <View
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    jc="space-around">
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Typography
                        customStyles={() => ({
                          text: selectStyle('sectionDetails'),
                        })}>
                        {item.firstPlanValue}
                      </Typography>
                    </View>
                    <Typography
                      customStyles={() => ({
                        text: selectStyle('sectionTitle'),
                      })}>
                      {item.title}
                    </Typography>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Typography
                        customStyles={() => ({
                          text: selectStyle('sectionDetails'),
                        })}>
                        {item.secondPlanValue}
                      </Typography>
                    </View>
                  </View>
                </View>
              );
            },
          );
        })}
      </View>
    );
  };

  const renderBackGround = () => {
    const Content = I18nManager.isRTL ? (
      <>
        <View style={{flex: 1, backgroundColor: white}} />
        <View style={{flex: 1}} />
      </>
    ) : (
      <>
        <View style={{flex: 1}} />
        <View style={{flex: 1, backgroundColor: white}} />
      </>
    );
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>
        {Content}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: brightGray}}>
      {renderBackGround()}
      <ScrollContainerWithNavHeader
        floatBot={-20}
        showFloatingActionButton
        scrollViewStyle={{paddingBottom: hp(50), paddingHorizontal: 0}}
        withUserImage={false}
        title={translate('COMPARE_PLANS')}>
        {data && renderTitles()}
        {plansCompare && renderDetails()}
      </ScrollContainerWithNavHeader>
      {renderBottomButtons()}
    </View>
  );
};

export const PlansCompare = baseScreen(plansCompare, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
