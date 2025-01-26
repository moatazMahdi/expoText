import React from 'react';
import { ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { useRoute } from '@react-navigation/native';
import { useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { wp } from 'src/utils/Dimensions/dimen';
import styles from './styles';

interface DefaultButtonInterface {
  titleStyle?: TextStyle;
  buttonStyle?: ViewStyle | ViewStyle[];
  bottom?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  variant?:
  | 'secondary'
  | 'pending'
  | 'secondaryBackground'
  | 'secondaryBackgroundDarkText';
  mt?: number;
  width?: number;
  mb?: number;
  icon?: any;
  iconAfter?: any;
  fromModal?: string;
  title?: string;
  titleStyles?: TextStyle;
}

const DefaultButton: React.FC<DefaultButtonInterface> = props => {
  const {
    titleStyle,
    width,
    icon,
    iconAfter,
    title,
    buttonStyle,
    bottom,
    loading,
    disabled,
    variant,
    onPress,
    mt,
    mb,
    fromModal,
    titleStyles,
  } = props;


  const route = fromModal ? { name: fromModal } : useRoute() || {};
  const stores = useStores();
  const { selectStyle } = useStyles(styles);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const getVariant = () => {
    switch (variant) {
      case 'secondary':
        return {
          buttonVariantStyle: selectStyle('buttonSecondary'),
          textVariantStyle: selectStyle('textSecondary'),
        };

      case 'pending':
        return {
          buttonVariantStyle: selectStyle('buttonPending'),
          textVariantStyle: selectStyle('textPending'),
        };

      case 'secondaryBackground':
        return {
          buttonVariantStyle: selectStyle('buttonSecondaryBackground'),
          textVariantStyle: selectStyle('TextSecondaryBackground'),
        };
      case 'secondaryBackgroundDarkText':
        return {
          buttonVariantStyle: selectStyle('buttonSecondaryBackground'),
          textVariantStyle: selectStyle('TextSecondaryBackgroundDark'),
        };

      default:
        return {
          buttonVariantStyle: selectStyle('buttonStyle'),
          textVariantStyle: selectStyle('buttonTitleText'),
        };
    }
  };

  const { buttonVariantStyle, textVariantStyle } = getVariant();

  return (
    <Button
      disabled={disabled || loading}
      touchSoundDisabled={false}
      onPress={() => {
        ApplicationAnalytics(
          {
            eventKey: title,
            type: 'CTA',
            parameters: { ScreenName: route?.name },
          },
          stores,
        );

        !loading && onPress();
      }}
      style={[
        buttonVariantStyle,
        bottom && selectStyle('buttonBottom'),
        disabled && selectStyle('buttonPending'),
        loading && selectStyle('buttonPending'),
        width && { width: wp(width) },
        mt && { marginTop: mt },
        mb && { marginBottom: mb },
        buttonStyle,
      ]}>
      {!loading ? (
        <>
          {icon && icon()}
          <Typography
            customStyles={() => ({
              text: disabled
                ? selectStyle('textPending')
                : { ...textVariantStyle, ...titleStyle },
            })}
            style={titleStyles}>
            {title}
          </Typography>
          {iconAfter && iconAfter()}
        </>
      ) : (
        <ActivityIndicator color={common.yellowOrange} />
      )}
    </Button>
  );
};

export default DefaultButton;
