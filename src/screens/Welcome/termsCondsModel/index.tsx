import React, { useRef, useEffect } from 'react';
import { Dimensions, Animated, Pressable, View, Easing } from 'react-native';
import { observer } from 'mobx-react';
import { useLocalization, useStores } from 'hooks';
import { useStyles, Typography, Button } from 'elephanz-rn-ui';
import { useRoute } from '@react-navigation/native';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { Assets } from 'assets';
import styles from './styles';

const { height: screenHeight } = Dimensions.get('screen');
const {
  images: { common },
} = Assets;

interface TermsAndCondsModelProps {
  isOpen: boolean;
  onCancel: () => void;
  onAgree?: (bool: Boolean) => void;
}

export const TermsAndCondsModel: React.FC<TermsAndCondsModelProps> = observer(
  (props: TermsAndCondsModelProps) => {
    const { isOpen, onCancel, onAgree } = props;
    const isOpenAnimationProgress = useRef(new Animated.Value(0)).current;
    const backgroundOpacityValue = isOpenAnimationProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 0, 1],
    });
    const backgroundBottomValue = isOpenAnimationProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [-screenHeight, 0, 0],
    });
    const viewBottomValue = isOpenAnimationProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [-screenHeight, -screenHeight, 0],
    });
    const { translate } = useLocalization();
    const { selectStyle } = useStyles(styles);
    const route = useRoute() || {};
    const stores = useStores();

    const renderOverlayView = () => (
      <Pressable onPress={onCancel}>
        <Animated.View
          style={{
            opacity: backgroundOpacityValue,
            bottom: backgroundBottomValue,
          }}
        >
          <View style={selectStyle('overlay')} />
        </Animated.View>
      </Pressable>
    );

    const renderButtons = () => (
      <View style={selectStyle('buttonsContainer')}>
        <Button
          color="primary"
          customStyles={() => ({
            button: () => selectStyle('agreeButton'),
          })}
          onPress={() => {
            if (onAgree) {
              ApplicationAnalytics(
                {
                  eventKey: 'CTA',
                  parameters: {
                    name: translate('AGREE'),
                    ScreenName: route?.name,
                  },
                },
                stores,
              );

              ApplicationAnalytics({
                eventKey: 'terms_and_conditions_agree',
                type: 'STATUS',
              });
              onAgree(true);
              onCancel();
            }
          }}
        >
          <Typography
            color="white"
            customStyles={() => ({
              text: selectStyle('agreeLabel'),
            })}
          >
            {translate('AGREE')}
          </Typography>
        </Button>

        <Button
          color="primary"
          customStyles={() => ({
            button: () => selectStyle('cancelButton'),
          })}
          onPress={() => {
            ApplicationAnalytics(
              {
                eventKey: 'CTA',
                parameters: {
                  name: translate('GENERIC_CANCEL'),
                  ScreenName: route?.name,
                },
              },
              stores,
            );

            ApplicationAnalytics({
              eventKey: 'terms_and_conditions_cancel',
              type: 'STATUS',
            });
            onCancel();
          }}
        >
          <Typography
            color="primary"
            customStyles={() => ({
              text: selectStyle('cancelLabel'),
            })}
          >
            {translate('GENERIC_CANCEL')}
          </Typography>
        </Button>
      </View>
    );

    const renderContentCard = () => (
      <View style={selectStyle('termsViewContainer')}>
        <View style={selectStyle('termsHeaderContainer')}>
          <Typography
            variant="title"
            customStyles={() => ({
              text: selectStyle('titleLabel'),
            })}
          >
            {translate('TERMS_AND_CONDITIONS')}
          </Typography>
          <Pressable
            onPress={() => {
              ApplicationAnalytics({
                eventKey: 'terms_and_conditions_cancel',
                type: 'STATUS',
              });
              onCancel();
            }}
            style={selectStyle('backButton')}
          >
            <common.closeForm />
          </Pressable>
        </View>

        <View style={selectStyle('termsBodyContainer')}>
          <Typography
            variant="subtitle1"
            customStyles={() => ({
              text: selectStyle('subTitleTerms'),
            })}
          >
            {translate('TERM_1').split('.')[0] +
              '.\n\n' +
              translate('TERM_1').split('.')[1] +
              ' ' +
              translate('TERM_1').split('.')[2] +
              '.\n\n' +
              translate('TERM_2')}
          </Typography>
          {renderButtons()}
        </View>
      </View>
    );

    useEffect(() => {
      Animated.timing(isOpenAnimationProgress, {
        useNativeDriver: false,
        toValue: isOpen ? 1 : 0,
        duration: 500,
        easing: Easing.ease,
      }).start();
    }, [isOpen]);

    return (
      <React.Fragment>
        {renderOverlayView()}
        <Animated.View style={{ bottom: viewBottomValue }}>
          {renderContentCard()}
        </Animated.View>
      </React.Fragment>
    );
  },
);
