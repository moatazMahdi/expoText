import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {getInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import InstantApprovalTOSModal from '../InstantApprovalTOSModal';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import {InstantApprovalCardInterface} from 'src/Types';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import DefaultButton from '../DefaultButton';
import RowView from '../Wrappers/RowView';
import WelcomeCard from '../WelcomeCard';
import {Assets} from 'assets';
import styles from './styles';

const InstantApprovalCard: React.FC<InstantApprovalCardInterface> = props => {
  const {
    welcome,
    mt,
    renderLoansList,
    renderContractsCTA,
    noContracts,
    withBackView,
  } = props;

  const {translate} = useLocalization();

  const [buttonText, setButtonText] = useState(translate('GET_STARTED'));
  const [instantProgress, setProgress] = useState({name: '', params: {}});
  const [creditResult, setResult] = useState({mobile: false});
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const isFocused = useIsFocused();

  const stores = useStores();
  const role = useStores().backend.users.role;
  const instantApprovalStatus =
    stores.backend.instantApproval.instantApprovalStatus;
  const userContracts = stores.backend.users.userContracts.data;
  const userActiveContracts = stores.backend.users.userActiveContracts.data;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const checkForProgress = async () => {
    if (role !== 'GUEST') {
      const progress = await getInstantApprovalProgress();
      const user = stores.backend.users?.userData;
      if (progress) {
        setProgress(progress);
        if (progress?.name != 'congratulations') {
          setButtonText(translate('GET_STARTED'));
        }
      } else {
        setLoading(true);
        try {
          const result = instantApprovalStatus
            ? instantApprovalStatus
            : await stores.backend.instantApproval.validateNationalIdExistence(
                user?.nationalId || '22222222222222',
                user.phone,
              );
          setResult(result);
          const {mobile} = result || {};
          if (mobile) {
            setButtonText(translate('ACTIVATE_CREDIT'));
          }
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    isFocused === true && checkForProgress();
  }, [buttonText, isFocused]);

  const onOpen = async () => {
    if (welcome) {
      ApplicationAnalytics(
        {eventKey: 'user_instantApproval_welcome', type: 'STATUS'},
        stores,
      );
      ApplicationAnalytics(
        {
          eventKey: 'StartedOnboardingGetLimit',
          type: 'CTA',
          parameters: {fromScreen: 'welcome'},
        },
        stores,
      );
    } else {
      ApplicationAnalytics(
        {eventKey: 'user_instantApproval_home', type: 'STATUS'},
        stores,
      );
      ApplicationAnalytics(
        {
          eventKey: 'StartedOnboardingGetLimit',
          type: 'CTA',
          parameters: {fromScreen: 'home'},
        },
        stores,
      );
    }
    // Check First if there is progress for instant approval
    // Then open terms model or navigate to latest progress screen
    const progress = instantProgress;
    if (progress?.name) {
      setProgress(progress);
      ApplicationAnalytics(
        {
          eventKey: 'user_instantApproval_continue',
          type: 'STATUS',
          parameters: {
            progressName: progress?.name,
          },
        },
        stores,
      );
      if (progress?.name != 'congratulations') {
        navigation.navigate(progress);
      } else {
      }
    } else if (role === 'GUEST') {
      ApplicationAnalytics(
        {eventKey: 'user_instantApproval_guest', type: 'CTA'},
        stores,
      );
      navigation.navigate('signUp');
    } else {
      const {mobile} = creditResult;
      if (mobile) {
      } else {
        ApplicationAnalytics(
          {eventKey: 'user_instantApproval_firstTime', type: 'STATUS'},
          stores,
        );
        setIsTermsOpen(true);
      }
    }
  };

  const renderInstantApprovalCard = () => {
    return (
      <WelcomeCard
        mt={mt}
        welcome={welcome}
        image={creditech.InstantApprovalLogo}
        title={translate('GET_INSTANT_APPROVAL')}
        bodyText={translate('INSTANT_APPROVAL_DESC')}
        comingSoon={false}
        onPress={onOpen}
        buttonText={buttonText}
        loading={isLoading}
      />
    );
  };

  const instantApprovalCardWithContracts = () => {
    return (
      <View>
        <RowView>
          <Image
            resizeMode="contain"
            source={creditech.InstantApprovalLogo}
            style={selectStyle('sideImage')}
          />

          <View style={{marginStart: wp(12)}}>
            <Typography fontSize={14} fontWeight="700">
              {translate('GET_INSTANT_APPROVAL')}
            </Typography>

            <Typography
              customStyles={() => ({
                text: {lineHeight: hp(20)},
              })}
              marginEnd={wp(12)}
              fontWeight="500"
              fontSize={12}>
              {translate('INSTANT_APPROVAL_DESC')}
            </Typography>
          </View>
        </RowView>

        <DefaultButton
          title={translate('GET_STARTED')}
          mt={12}
          width={147}
          onPress={onOpen}
        />
        {renderLoansList && renderLoansList(1)}

        {renderContractsCTA && renderContractsCTA()}
      </View>
    );
  };

  const renderHomeInstantApprovalCard = () => {
    if (
      ((userContracts && userContracts.length > 0) ||
        (userActiveContracts && userActiveContracts?.length > 0)) &&
      !noContracts
    ) {
      return instantApprovalCardWithContracts();
    } else {
      return withBackView ? (
        <DropShadowWrapper style={selectStyle('container')}>
          {renderInstantApprovalCard()}
        </DropShadowWrapper>
      ) : (
        renderInstantApprovalCard()
      );
    }
  };

  return (
    <>
      {welcome ? renderInstantApprovalCard() : renderHomeInstantApprovalCard()}
      <InstantApprovalTOSModal
        isVisible={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
};

export default observer(InstantApprovalCard);
