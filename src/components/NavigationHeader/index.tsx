import React from 'react';
import {Alert, Pressable, View} from 'react-native';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {useRoute} from '@react-navigation/native';
// import {Shadow} from 'react-native-shadow-2';
import {useNavigationUtils, useStores} from 'hooks';
import NavUserImage from '../NavUserImage';
import {BackArrow} from 'components';
import SvgView from '../SvgView';
import {Assets} from 'assets';
import styles from './styles';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';

interface NavigationHeaderTypes {
  onPress?: () => void;
  title?: string;
  withUserImage?: boolean;
  rightComponent?: () => void;
  RightComponentWithImage?: () => void;
  hideBack?: boolean;
  removeCapitalization?: boolean;
  shapeVariant?: 'tangelo' | 'yellow' | 'orange' | 'blueSlate';
  showLogo?: boolean;
  renderSearch?: boolean;
  noInternetModal?: string;
}

const NavigationHeader: React.FC<NavigationHeaderTypes> = props => {
  const {
    onPress,
    shapeVariant,
    title,
    withUserImage,
    removeCapitalization,
    rightComponent,
    RightComponentWithImage,
    hideBack,
    showLogo,
    renderSearch,
    noInternetModal,
  } = props;
  const {goBack, canGoBack, navigate} = !hideBack
    ? useNavigationUtils()
    : {goBack: () => null, canGoBack: () => null, navigate: () => null};
  const {selectStyle} = useStyles(styles);
  const route = noInternetModal ? {name: noInternetModal} : useRoute() || {};
  const stores = useStores();
  const canGoBackBoolean = canGoBack();

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const renderUserImage = () => {
    return (
      <>
        {withUserImage && (
          <View style={selectStyle('NavUserImage')}>
            {RightComponentWithImage && RightComponentWithImage()}
            <NavUserImage showBadge />
          </View>
        )}
      </>
    );
  };

  const handleArrowBackPress = () => {
    ApplicationAnalytics(
      {
        eventKey: 'back',
        type: 'CTA',
        parameters: {ScreenName: route?.name},
      },
      stores,
    );

    const canGoBackBoolean = canGoBack();
    if (onPress) {
      onPress();
    } else {
      if (canGoBackBoolean) {
        goBack();
      } else Alert.alert('', "Can't go back!");
    }
  };

  const handleShowBackArrow = () => {
    if (!hideBack && canGoBackBoolean) {
      return <BackArrow onPress={handleArrowBackPress} type="short" />;
    } else {
      return null;
    }
  };

  const renderHeaderBackground = () => {
    switch (shapeVariant) {
      case 'tangelo':
        return (
          <SvgView
            svgFile={creditech.tangeloHeaderShape}
            noRTL
            style={selectStyle('headerBackGroundTangelo')}
            width={388}
            height={147}
          />
        );

      case 'yellow':
        return (
          <SvgView
            svgFile={creditech.yellowHeaderShape}
            noRTL
            style={selectStyle('headerBackgroundYellow')}
            width={400}
            height={180}
          />
        );

      case 'orange':
        return (
          <SvgView
            svgFile={creditech.orangeHeaderShape}
            noRTL
            style={selectStyle('headerBackgroundOrange')}
            width={400}
            height={130}
          />
        );
      case 'blueSlate':
        return (
          <SvgView
            svgFile={creditech.LavanderHeaderShape}
            noRTL
            style={selectStyle('headerBackgroundOrange')}
            width={400}
            height={130}
          />
        );

      default:
        break;
    }
  };

  const renderSearchIcon = () => {
    return (
      <Pressable
        onPress={() => navigate('search')}
        style={selectStyle('SearchIconContainer')}>
        <SvgView svgFile={creditech.SearchIcon} width={16} height={16} />
      </Pressable>
    );
  };

  return (
    <View style={selectStyle('container')}>
      <View style={selectStyle('innerContainer')}>
        {renderHeaderBackground()}
        <View style={selectStyle('contentContainer')}>
          {showLogo && hideBack && (
            <SvgView
              svgFile={creditech.ContactNow}
              ms={20}
              width={65}
              height={35}
            />
          )}

          <View style={[selectStyle('arrowTitleContainer')]}>
            {!hideBack && handleShowBackArrow()}

            {title ? (
              <Typography
                marginLeft={(hideBack || !canGoBack()) && 16}
                customStyles={() => ({
                  text: selectStyle('headerText'),
                })}>
                {removeCapitalization ? title : title.toUpperCase()}
              </Typography>
            ) : null}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderSearch && renderSearchIcon()}
            {rightComponent ? rightComponent() : renderUserImage()}
          </View>

          {showLogo && !hideBack && (
            <SvgView
              svgFile={creditech.ContactNow}
              me={20}
              width={65}
              height={35}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default NavigationHeader;
