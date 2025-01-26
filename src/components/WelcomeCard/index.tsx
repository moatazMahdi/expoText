import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Typography, useStyles } from 'elephanz-rn-ui';
import styles from './styles';
import { useLocalization } from 'hooks';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import GetStartedButton from '../GetStartedButton';
import DefaultButton from '../DefaultButton';

interface WelcomeCardInterface {
  image: any;
  title: string;
  bodyText: string;
  comingSoon: boolean;
  onPress: () => void;
  welcome?: boolean;
  home?: boolean;
  mt?: number;
  svgNoRTL?: boolean;
  buttonText?: string;
  loading?: boolean;
}

const WelcomeCard: React.FC<WelcomeCardInterface> = (props) => {
  const {
    image,
    title,
    bodyText,
    comingSoon,
    onPress,
    welcome,
    mt,
    buttonText,
    loading,
  } = props;
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  return welcome ? (
    <Pressable onPress={!comingSoon ? onPress : () => {}}>
      <DropShadowWrapper mb={40} mt={mt ?? 20} style={selectStyle('shadowBox')}>
        <View
          style={[
            selectStyle('PannerContainer'),
            selectStyle('welcomeContainer'),
          ]}
        >
          <View
            style={[
              selectStyle('pannerLogoContainer'),
              selectStyle('welcomeLogo'),
            ]}
          >
            <Image
              resizeMode="contain"
              source={image}
              style={selectStyle('imageStyle')}
            />
          </View>
          <View style={{ marginVertical: 5 }}>
            <Typography
              customStyles={() => ({ text: selectStyle('titleText') })}
            >
              {title}
            </Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography
              customStyles={() => ({ text: selectStyle('bodyText') })}
            >
              {bodyText}
            </Typography>
          </View>
          <View
            style={[
              selectStyle('footerContainer'),
              welcome && selectStyle('welcomeFooterContainer'),
            ]}
          >
            {/* Should Check for progress first then render ? continue : getStarted */}
            {!comingSoon ? (
              <GetStartedButton
                loading={loading ? loading : false}
                title={buttonText ? buttonText : null}
                textStyle={selectStyle('footerButtonText')}
                onPress={onPress}
              />
            ) : (
              <Typography
                customStyles={() => ({ text: selectStyle('bodyText') })}
              >
                {translate('COMING_SOON')}
              </Typography>
            )}
          </View>
        </View>
      </DropShadowWrapper>
    </Pressable>
  ) : (
    <Pressable
      onPress={!comingSoon ? onPress : () => {}}
      style={[selectStyle('PannerHomeContainer')]}
    >
      <Image
        resizeMode="contain"
        source={image}
        style={selectStyle('imageStyle')}
      />
      <View style={title && { marginVertical: 5 }}>
        <Typography customStyles={() => ({ text: selectStyle('titleText') })}>
          {title}
        </Typography>
      </View>
      <View style={{ flex: 1 }}>
        <Typography customStyles={() => ({ text: selectStyle('bodyText') })}>
          {bodyText}
        </Typography>
      </View>
      <View style={[selectStyle('footerContainer')]}>
        {/* Should Check for progress first then render ? continue : getStarted */}
        {!comingSoon ? (
          <DefaultButton
            mt={20}
            title={buttonText ? buttonText : translate('GET_STARTED')}
            onPress={onPress}
            loading={loading ? loading : false}
          />
        ) : (
          <Typography customStyles={() => ({ text: selectStyle('bodyText') })}>
            {translate('COMING_SOON')}
          </Typography>
        )}
      </View>
    </Pressable>
  );
};

export default observer(WelcomeCard);
