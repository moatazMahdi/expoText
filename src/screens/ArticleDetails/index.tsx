import React, {useEffect, useState} from 'react';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {View} from 'native-base';
import ProgressiveImage from 'src/components/ProgressiveImage';
import DefaultButton from 'src/components/DefaultButton';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {Article} from 'shared/DTOs/programs';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import {
  checkUserInstantApprovalStatus,
  getInstantApprovalProgress,
  getRejectionData,
} from 'src/utils/HelpersFunctions';
import InstantApprovalTOSModal from 'src/components/InstantApprovalTOSModal';
import DynamicDisclaimer from 'src/components/DynamicDisclaimer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';

const articleDetails: React.FC = () => {
  const stores = useStores();

  const {article, key} =
    (useRoute().params as {article?: Article; key?: string}) || {};
  const [Article, setArticle] = useState<Article>(article);
  const [articleLoading, setArticleLoading] = useState(false);
  const [clientValidate, setClientValidate] = useState('false');
  const {backgroundImage, sections, title, id} = Article || {};

  const {controlLoginModalView} = stores.backend.users;

  const {selectStyle} = useStyles(styles);
  const isFocused = useIsFocused();

  const [toView, setToView] = useState<
    | 'creditActivated'
    | 'creditNotActivated'
    | 'noCredit'
    | 'rejected'
    | 'loading'
    | null
    | string
  >(null);
  const {translate} = useLocalization();

  const userId = stores.backend.users.userData?.id;
  const user = stores.backend.users.userData;

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    const getArticle = async () => {
      try {
        setArticleLoading(true);
        // const article = await stores.backend.programs.getArticleById(key);
        setArticle(await stores.backend.programs.getArticleById(key));
      } catch (e) {
      } finally {
        setArticleLoading(false);
      }
    };
    !article && getArticle();
  }, []);

  const navigation = useNavigationUtils();
  const role = useStores().backend.users.role;
  const [creditResult, setResult] = useState({mobile: false});
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [buttonText, setButtonText] = useState(translate('GET_STARTED'));
  const [isLoading, setLoading] = useState(false);
  const instantApprovalStatus =
    stores.backend.instantApproval.instantApprovalStatus;

  const [instantProgress, setProgress] = useState({name: '', params: {}});

  const checkUserInstantStatus = async () => {
    await checkUserInstantApprovalStatus(stores, setToView);
  };

  useEffect(() => {
    checkUserInstantStatus();
    // stores.backend.general.logEvent({
    //   key: 'exclusive_for_you',
    //   userId,
    //   parameters: { title },
    // });
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'exclusive_for_you',
        parameters: {
          name: title,
        },
      },
      stores,
    );
  }, []);

  const checkForProgress = async () => {
    if (role !== 'GUEST') {
      const progress = await getInstantApprovalProgress();
      const user = stores.backend.users?.userData;
      if (progress) {
        setProgress(progress);
        if (progress?.name !== 'congratulations') {
          setButtonText(translate('ACTIVATE_CREDIT'));
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
    {
      toView === 'rejected' &&
        stores.backend.instantApproval
          .validateHybrid(user?.nationalId)
          .then(res => setClientValidate(res?.status));
    }
  }, [buttonText, isFocused, toView]);

  const onOpen = async () => {
    const progress = instantProgress;
    if (progress?.name) {
      setProgress(progress);
      if (progress?.name !== 'congratulations') {
        navigation.navigate(progress);
      }
    } else if (role === 'GUEST') {
      navigation.navigate('signUp');
    } else {
      const {mobile} = creditResult;
      if (mobile) {
      } else {
        setIsTermsOpen(true);
      }
    }
  };

  const renderImage = () => {
    return (
      <ProgressiveImage
        resizeMode="cover"
        imageSource={{uri: backgroundImage}}
        imageStyle={selectStyle('headerImage')}
      />
    );
  };

  const onNavigateBranches = () => {
    navigation.navigate('branches', {
      data: stores.backend.general.branches.data,
    });
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'visit_nearest_branches',
        parameters: {program: title},
      },
      stores,
    );
  };

  const onNavigateManageMyBills = () => {
    navigation.navigate('manageMyBills');
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'enjoy_contact_world',
        parameters: {program: title},
      },
      stores,
    );
  };

  const onNavigateApplyForSupplementary = () => {
    navigation.navigate('supplementaryRequestForm');
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'supplementary_request_form',
        parameters: {program: title},
      },
      stores,
    );
    // stores.backend.general.logEvent({
    //   key: 'supplementary_request_form',
    //   userId,
    // });
  };

  const onGetStartedPressed = () => {
    controlLoginModalView(true, () => onOpen());
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: 'get_started',
        parameters: {program: title},
      },
      stores,
    );
  };
  const renderButton = () => {
    const hasNoCredit = toView === 'noCredit';
    const rejected = toView === 'rejected';
    let showButton = false;
    let buttonText = translate('GET_STARTED');
    let action = () => controlLoginModalView(true, () => onOpen());
    const rejectionNumber = getRejectionData(
      instantApprovalStatus?.rejectedReason,
    );
    switch (id) {
      case 1:
      case 3:
        if (hasNoCredit) {
          buttonText = translate('GET_STARTED');
          action = () => onGetStartedPressed();
          showButton = true;
        } else if (rejected) {
          if (clientValidate === 'true') {
            buttonText = translate('VISIT_BRANCH');
            action = () => onNavigateBranches();
          } else {
            buttonText = translate('ENJOY_CONTACT_WORLD');
            action = () => onNavigateManageMyBills();
          }
          showButton = true;
        }
        break;
      case 2:
        if (hasNoCredit) {
          action = () => onGetStartedPressed();
          buttonText = translate('GET_STARTED');
          showButton = true;
        } else if (rejected) {
          if (clientValidate === 'true') {
            buttonText = translate('VISIT_BRANCH');
            action = () => onNavigateBranches();
          } else {
            buttonText = translate('ENJOY_CONTACT_WORLD');
            action = () => onNavigateManageMyBills();
          }
          showButton = true;
        } else {
          // action = () => onNavigateBranches();
          buttonText = translate('APPLY_SUPPLEMENTARY');
          action = () => onNavigateApplyForSupplementary();
          showButton = true;
        }
        break;
      default:
        break;
    }

    return showButton ? (
      <DefaultButton
        loading={isLoading}
        disabled={false}
        onPress={() => action()}
        title={buttonText}
        mt={20}
        mb={20}
        buttonStyle={selectStyle('button')}
      />
    ) : null;
  };

  const renderDetails = (item: {name: string; body: string}) => {
    return (
      <DropShadowWrapper mh={20} mb={20}>
        <View style={selectStyle('detailsContainer')}>
          {item?.name ? (
            <Typography fontWeight="700">{item?.name}</Typography>
          ) : null}
          <Typography
            customStyles={() => ({text: selectStyle('descriptionText')})}>
            {item.body}
          </Typography>
        </View>
      </DropShadowWrapper>
    );
  };

  const renderDetailsSections = () => {
    return (
      sections &&
      sections.length > 0 &&
      sections?.map(item => {
        return renderDetails(item);
      })
    );
  };

  const renderDisclaimer = () => {
    let disclaimerText = translate('CREDIT_LIMIT_ENJOY');
    switch (id) {
      case 1:
      case 3:
        disclaimerText = translate('CREDIT_LIMIT_ENJOY');
        break;
      case 2:
        disclaimerText = translate('CREDIT_LIMIT_SUPPLEMENTARY');
        break;
      default:
        break;
    }

    return (
      <DynamicDisclaimer
        iconColor={common.paleRed}
        textColor={common.paleRed}
        text={disclaimerText}
        withBackground
      />
    );
  };
  return (
    <View style={{flex: 1}}>
      {articleLoading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader title={title}>
        {renderImage()}
        {renderDetailsSections()}
        <InstantApprovalTOSModal
          isVisible={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
        {toView === 'noCredit' ||
          (toView === 'rejected' && !articleLoading && renderDisclaimer())}
        {renderButton()}
      </ScrollContainerWithNavHeader>
    </View>
  );
};
export const ArticleDetails = baseScreen(articleDetails, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
