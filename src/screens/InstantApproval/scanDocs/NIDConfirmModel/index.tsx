import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Easing,
} from 'react-native';

import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { useStyles, useTheme, Typography, Button } from 'elephanz-rn-ui';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { NIDConfirmModelProps } from 'src/Types';
import { useLocalization, useStores } from 'hooks';
import styles from './styles';
import { Assets } from 'assets';

export const NIDConfirmModel: React.FC<NIDConfirmModelProps> = observer(
  (props) => {
    const route = useRoute() || {};
    const { isOpen, nationalId, ocr_NID, onCancel, onConfirm } = props;

    const [NID, setNID] = useState(nationalId);

    const isOpenAnimationProgress = useRef(new Animated.Value(0)).current;
    const { selectStyle } = useStyles(styles);
    const { translate } = useLocalization();
    const stores = useStores();

    const { height: screenHeight } = Dimensions.get('screen');

    const {
      theme: { palette },
    } = useTheme();
    const {
      images: { common },
    } = Assets;

    useEffect(() => {
      setNID(nationalId);
    }, [nationalId]);

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

    useEffect(() => {
      Animated.timing(isOpenAnimationProgress, {
        useNativeDriver: false,
        toValue: isOpen ? 1 : 0,
        duration: 500,
        easing: Easing.ease,
      }).start();
    }, [isOpen]);

    const renderOverlayView = () => (
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View
          style={{
            ...selectStyle('animationContainer'),
            opacity: backgroundOpacityValue,
            bottom: backgroundBottomValue,
          }}
        >
          <View style={selectStyle('overlay')} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );

    const renderButtons = () => (
      <View style={selectStyle('buttonsContainer')}>
        <TouchableOpacity activeOpacity={0.7} onPress={onCancel}>
          <Typography
            variant="body1"
            color="primary"
            customStyles={() => ({
              text: selectStyle('rescanLabel'),
            })}
          >
            {translate('RESCAN')}
          </Typography>
        </TouchableOpacity>

        <Button
          color="primary"
          customStyles={() => ({
            button: (disabled: boolean) =>
              disabled
                ? {
                    ...selectStyle('button'),
                    backgroundColor: palette.common.lightgrey,
                  }
                : {
                    ...selectStyle('button'),
                    backgroundColor: palette.primary.value,
                  },
          })}
          onPress={() => {
            if (onConfirm) {
              ApplicationAnalytics(
                {
                  eventKey: 'CTA',
                  parameters: {
                    name: translate('CONFIRM_VOUCHER'),
                    ScreenName: route?.name,
                  },
                },
                stores,
              );

              onConfirm();
            }
          }}
        >
          <Typography
            color="white"
            customStyles={() => ({
              text: selectStyle('buttonLabel'),
            })}
          >
            {translate('CONFIRM_VOUCHER')}
          </Typography>
        </Button>
      </View>
    );

    const renderContentCard = () => {
      const onNIDChange = (value: string) => {
        if (/^[a-zA-Z0-9]+$/.test(value) || value.length === 0) {
          setNID(value);
        }
      };

      return (
        <View style={selectStyle('contentCardContainer')}>
          <View style={selectStyle('cardTitleContainer')}>
            <Pressable onPress={onCancel} style={selectStyle('backButton')}>
              <common.back />
            </Pressable>

            <Typography
              variant="title"
              customStyles={() => ({ text: selectStyle('titleLabel') })}
            >
              {translate('CONFIRM_NID_NUM')}
            </Typography>
          </View>

          <View style={selectStyle('cardBodyContainer')}>
            <Typography
              variant="subtitle1"
              customStyles={() => ({ text: selectStyle('subtitle1') })}
            >
              {translate('NID_NOT_MATCH')}
            </Typography>

            <Typography
              variant="subtitle2"
              customStyles={() => ({ text: selectStyle('subtitle2') })}
            >
              {translate('ENTERED_NID')}
            </Typography>

            <TextInput
              style={selectStyle('fieldInput')}
              editable={false}
              value={NID}
              onChangeText={onNIDChange}
              keyboardType="number-pad"
            />

            <Typography
              variant="subtitle2"
              customStyles={() => ({ text: selectStyle('subtitle2') })}
            >
              {translate('SCANNED_NID')}
            </Typography>

            <TextInput
              style={selectStyle('fieldInput')}
              editable={false}
              value={ocr_NID}
            />

            <Typography
              variant="subtitle1"
              customStyles={() => ({ text: selectStyle('subtitle1') })}
            >
              {translate('CONFIRM_OR_RESCAN')}
            </Typography>

            {renderButtons()}
          </View>
        </View>
      );
    };

    return (
      <>
        {isOpen && (
          <React.Fragment>
            {renderOverlayView()}

            <Animated.View
              style={{
                ...selectStyle('animationContainer'),
                bottom: viewBottomValue,
              }}
            >
              {renderContentCard()}
            </Animated.View>
          </React.Fragment>
        )}
      </>
    );
  },
);
