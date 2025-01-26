import React from 'react';
import { View } from 'react-native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { FatortyDisclaimerInterface } from 'src/Types';
import GetStartedButton from '../GetStartedButton';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import Svg, { Circle, Path } from 'react-native-svg';
import ProgressiveImage from '../ProgressiveImage';
import { useLocalization } from 'hooks';

interface FatortyInvoiceCardInterface {
  photo: any;
  thumbnail: any;
  isInvoice: boolean;
}
const FatortyInvoiceCard: React.FC<FatortyInvoiceCardInterface> = (props) => {
  const { photo, thumbnail, isInvoice } = props;

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const validInvoiceIcon = () => (
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle
        cx="12.0684"
        cy="12"
        r="10"
        fill="#039754"
        stroke="#039754"
        strokeWidth="1.5"
      />
      <Path
        d="M8.56836 12.5L10.5684 14.5L15.5684 9.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const inValidInvoiceIcon = () => (
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0684 12C22.0684 17.5228 17.5912 22 12.0684 22C6.54551 22 2.06836 17.5228 2.06836 12C2.06836 6.47715 6.54551 2 12.0684 2C17.5912 2 22.0684 6.47715 22.0684 12ZM9.03799 8.96965C9.33088 8.67676 9.80575 8.67676 10.0986 8.96965L12.0683 10.9393L14.038 8.96967C14.3309 8.67678 14.8058 8.67678 15.0986 8.96967C15.3915 9.26256 15.3915 9.73744 15.0986 10.0303L13.129 12L15.0986 13.9696C15.3915 14.2625 15.3915 14.7374 15.0986 15.0303C14.8057 15.3232 14.3309 15.3232 14.038 15.0303L12.0683 13.0607L10.0987 15.0303C9.80578 15.3232 9.3309 15.3232 9.03801 15.0303C8.74512 14.7374 8.74512 14.2625 9.03801 13.9697L11.0077 12L9.03799 10.0303C8.74509 9.73742 8.74509 9.26254 9.03799 8.96965Z"
        fill="#E54444"
      />
    </Svg>
  );

  return (
    <View style={{ height: 72, marginBottom: hp(16) }}>
      <RowView
        style={{
          backgroundColor: '#F0F4F8',
          padding: 10,
          borderRadius: 12,
        }}
      >
        <ProgressiveImage
          resizeMode="cover"
          imageStyle={selectStyle('imageStyle')}
          imageSource={
            !photo?.type
              ? photo
              : photo?.type === 'image/jpeg'
              ? { uri: photo?.uri }
              : { uri: thumbnail?.uri }
          }
        />

        <View
          style={{
            // backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <View
            style={{
              marginLeft: wp(16),
              justifyContent: 'space-around',
            }}
          >
            <Typography
              style={{
                color: '#080B30',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 24,
                fontFamily: 'Ping LCG',
              }}
            >
              {translate('FATORTY_INVOICE')}
            </Typography>

            <Typography
              style={{
                color: '#9B9FA5',
                fontFamily: 'Ping LCG',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: 24,
                fontSize: 14,
              }}
            >
              {translate('FATORTY_IMAGE')}
            </Typography>
          </View>

          <View
            style={{
              justifyContent: 'center',
              width: 'auto',
            }}
          >
            {/* {isInvoice ? validInvoiceIcon() : inValidInvoiceIcon()} */}
            {isInvoice ? validInvoiceIcon() : inValidInvoiceIcon()}
          </View>
        </View>
      </RowView>
    </View>
  );
};

export default FatortyInvoiceCard;
