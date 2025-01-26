import React, {useEffect, useState} from 'react';
import {I18nManager, View, Text} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import {wp} from 'src/utils/Dimensions/dimen';
import {ContinueButton, PageTitle} from 'components';
import {useRoute} from '@react-navigation/native';
import {
  dependentsNum,
  dependentsNumEn,
} from 'src/screens/InstantApproval/clientInfo/data';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {saveInstantApprovalProgress} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
import SvgView from 'src/components/SvgView';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

export const ClientDependencies: React.FC = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};
  const stores = useStores();
  const navigation = useNavigationUtils();
  const [dependenciesNum, setDependenciesNum] = useState<number>(0);
  const [numOfDependencies, setNumOfDependencies] = useState<string>(
    I18nManager.isRTL
      ? dependentsNum[dependenciesNum]
      : dependentsNumEn[dependenciesNum],
  );
  const [isLoading, setIsLoading] = useState(false);

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  useEffect(() => {
    if (dependenciesNum < 4) {
      setNumOfDependencies(
        I18nManager.isRTL
          ? dependentsNum[dependenciesNum]
          : dependentsNumEn[dependenciesNum],
      );
    } else {
      setNumOfDependencies(
        I18nManager.isRTL
          ? dependentsNum[dependenciesNum - 1]
          : dependentsNumEn[dependenciesNum - 1],
      );
    }
  }, [dependenciesNum]);

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    ApplicationAnalytics(
      {
        eventKey: 'clientNumOfDependencies',
        type: 'CTA',
        parameters: {
          dependencies: numOfDependencies ?? '',
        },
      },
      stores,
    );
    // Save Progress First Before Navigating to Next Screen
    const progress = {
      name: 'refContactInfo',
      params: {
        nationalId,
        categoriesData,
        selfiePic,
        dependencies: numOfDependencies,
        residentialStatus,
        userInputNationalId,
        personalDetails,
        referralType,
        referralCode,
        hasPromoCode,
      },
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate(progress);
    setIsLoading(false);
  };

  const renderSliderMarker = () => {
    return (
      <View style={selectStyle('shadowBox')}>
        <View style={selectStyle('sliderMarkerContainer')}>
          <Text style={selectStyle('sliderMarkerText')}>
            {dependenciesNum < 4 ? dependenciesNum : '+3'}
          </Text>
        </View>
      </View>
    );
  };

  const renderSlider = () => (
    <View style={selectStyle('sliderContainer')}>
      <MultiSlider
        trackStyle={selectStyle('sliderBar')}
        selectedStyle={selectStyle('sliderBar')}
        min={0}
        max={4}
        step={1}
        snapped={true}
        enabledOne={true}
        enabledTwo={false}
        allowOverlap={true}
        sliderLength={wp(300)}
        isMarkersSeparated={true}
        customMarkerLeft={renderSliderMarker}
        onValuesChange={values => setDependenciesNum(values[0])}
      />
    </View>
  );

  const renderPeopleSVG = () => (
    <View style={selectStyle('peopleSVGContainer')}>
      <SvgView width={221} height={176} svgFile={creditech.supportingPeople} />
    </View>
  );

  const onContinuePressed = () => {
    navigateToNextScreen();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        showLogo
        hideBack
        shapeVariant="yellow"
        removeCapitalization>
        <ContinueLater fromScreen="clientDependencies" />
        <PageTitle title={translate('FAMILY_MEMBERS_COUNT')} />

        {renderPeopleSVG()}

        {renderSlider()}

        <ContinueButton
          back
          onContinuePressed={onContinuePressed}
          completeForm={true}
        />
      </ScrollContainerWithNavHeader>
      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </View>
  );
};
