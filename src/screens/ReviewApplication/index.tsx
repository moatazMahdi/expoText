import React, {useEffect, useState} from 'react';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import {
  combineMoneyCurrency,
  getDateAfterXMonths,
} from 'src/utils/HelpersFunctions';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import RowView from 'src/components/Wrappers/RowView';
import {View} from 'native-base';
import {plansItem} from 'src/components/PlansCard/types';
import {wp} from 'src/utils/Dimensions/dimen';
import DefaultButton from 'src/components/DefaultButton';
import AccelerateApprovalCard from 'src/components/AccelerateApprovalCard';
import {Alert} from 'react-native';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';

const reviewApplication: React.FC = () => {
  const navigation = useNavigationUtils();

  const stores = useStores();
  const {controlLoginModalView} = stores.backend.users;
  const {data, submitFormValues, programId} = useRoute().params as {
    data: {
      plan: plansItem;
      duration: number;
      amount: number;
      downPayment: number;
      installmentValue: number;
    };
    submitFormValues: any;
    programId: string;
  };

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const [photos, setPhotos] = useState([]);
  const [validForm, setValidForm] = useState(Boolean);
  const [isLoading, setIsLoading] = useState(false);

  const setPhotosData = (array: []) => setPhotos([...array]);

  useEffect(() => {
    if (photos.length === 2) {
      if (photos[0]?.uri !== '' && photos[1]?.uri !== '') {
        setValidForm(true);
      } else {
        setValidForm(false);
      }
    } else {
      setValidForm(false);
    }
    return () => {};
  }, [photos]);

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const renderPlan = () => {
    return (
      <View>
        <Typography fontWeight="700" fontSize={16}>
          {translate('PLAN')}
        </Typography>
        <DropShadowWrapper style={selectStyle('planContainer')}>
          <Typography marginTop={9} fontSize={16} fontWeight="700">
            {data?.plan?.title}
          </Typography>
          <Typography marginTop={16} fontSize={14}>
            {data?.plan?.description}
          </Typography>
        </DropShadowWrapper>
      </View>
    );
  };
  const renderInstallmentPlan = () => {
    const validColor = validForm ? common.lightGreen : common.black;
    const dateAfter: {fromDate: string; toDate: string} = getDateAfterXMonths(
      data.duration,
    );
    return (
      <View>
        <Typography fontWeight="700" fontSize={16} marginTop={45}>
          {translate('INSTALLMENT_PLAN')?.toUpperCase()}
        </Typography>
        <Typography fontSize={48} marginTop={9}>
          {data?.duration + ' ' + translate('MONTHS')}
        </Typography>
        <Typography
          marginTop={6}
          fontSize={16}
          fontWeight={'700'}
          colorHex={validColor}>
          {!validForm
            ? translate('PENDING_FOUR_WEEK_APPROVAL')
            : translate('PENDING_ONE_WEEK_APPROVAL')}
        </Typography>
        <RowView style={{alignItems: 'center'}} mt={6}>
          <Typography fontSize={12} colorHex={validColor}>
            {dateAfter.fromDate}
          </Typography>
          <View
            style={{
              width: '60%',
              height: 1,
              backgroundColor: validColor,
              marginHorizontal: wp(5),
            }}
          />
          <Typography fontSize={12} colorHex={validColor}>
            {dateAfter.toDate}
          </Typography>
        </RowView>
        <Typography fontSize={16} marginTop={31}>
          {translate('MONTHLY_INSTALLMENT')}
        </Typography>
        <Typography fontSize={48} marginTop={27}>
          {combineMoneyCurrency(data?.amount)}
        </Typography>
      </View>
    );
  };

  const onApply = async () => {
    ApplicationAnalytics(
      {
        eventKey: photos[1]?.uri
          ? 'apply-with-speed-up-docs'
          : 'cross-selling-apply',
        type: 'CTA',
        parameters: {
          productName: stores.backend.products?.currentProduct,
        },
      },
      stores,
    );

    const valuesToSend = {
      ...submitFormValues,
      plan: data?.plan?.description,
      tenor: `${data.duration}`,
      amount: '' + data.amount,
      downPayment: data.downPayment ? '' + data.downPayment : '0',
      installmentValue: '' + data.installmentValue,
      electricityBill: photos[0]?.uri || '',
      hrLetter: photos[1]?.uri || '',
    };
    try {
      setIsLoading(true);
      if (programId) {
        await stores.backend.programs.submitProgramForm(
          programId,
          valuesToSend,
        );
      } else {
        await stores.backend.products.sendRequestInfoForm(valuesToSend, null);
      }
      navigation.navigate('approvalMessageScreen');
    } catch (error) {
      let errorBody;

      if (
        error.response.data.message &&
        typeof error.response.data.message === 'object'
      ) {
        // eslint-disable-next-line prefer-destructuring
        errorBody = error.response.data.message[0];
      } else if (error.response.data.message) {
        errorBody = error.response.data.message;
      }
      Alert.alert(translate('LEAD_FORM_FAILED_TITLE'), errorBody);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccelerate = () => {
    return (
      <View style={{flex: 1}}>
        {<AccelerateApprovalCard setPhotosData={setPhotosData} />}
      </View>
    );
  };
  return (
    <ScrollContainerWithNavHeader
      showFloatingActionButton
      scrollViewStyle={selectStyle('container')}
      title={translate('REVIEW_APPLICATION')}>
      {renderPlan()}
      {renderInstallmentPlan()}
      {!validForm && renderAccelerate()}
      <DefaultButton
        buttonStyle={selectStyle('buttonStyle')}
        loading={isLoading}
        onPress={() => controlLoginModalView(true, () => onApply())}
        title={translate('APPLY_NOW')}
      />
    </ScrollContainerWithNavHeader>
  );
};
export const ReviewApplication = baseScreen(reviewApplication, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
