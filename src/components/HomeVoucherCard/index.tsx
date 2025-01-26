import React from 'react';
import {View, Pressable, ViewStyle, I18nManager} from 'react-native';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import ProgressiveImage from '../ProgressiveImage';
import styles from './styles';
import moment from 'moment';
import { convertToHttps } from 'src/utils/HelpersFunctions';

interface HomeVoucherCardTypes {
  item: {
    title: string;
    image: string;
    Image: string;
    merchantName: string;
    expireDate: string;
    navigateToBillPayment?: boolean;
    description?: string;
    expiryDate?: string;
  };
  containerStyle?: ViewStyle;
  onPress?: () => void;
  isSmall?: boolean;
  bookingAuth?: boolean;
  fontSize?: number;
}

const HomeVoucherCard: React.FC<HomeVoucherCardTypes> = props => {
  const {item, onPress, isSmall, bookingAuth, fontSize} = props;
  const {selectStyle} = useStyles(styles);
  const isRTL = I18nManager.isRTL;

  const isFormattedDate = dateString => {
    const formattedRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}(?::\d{2})? [AP]M$/;
    return formattedRegex.test(dateString);
  };
  const BookingAuthImageUrlHttps = convertToHttps(item?.imageUrl || item?.Image || item?.merchantImageURL)
  const ImageUrlHttps = convertToHttps(item?.image || item?.Image || item?.merchantImage)

  const BookingAuthCard = () => {
    return (
      <Pressable onPress={onPress}>
        <View style={selectStyle('bookingAuthCardContainer')}>
          <ProgressiveImage
            resizeMode="contain"
            imageStyle={selectStyle('bookingAuthImageStyle')}
            imageSource={{
              uri: BookingAuthImageUrlHttps
            }}
            // imageSource={require('../../assets/images/screens/creditech/arabiaMall.png')}
          />

          {/* <Typography
            numberOfLines={1}
            adjustsFontSizeToFit
            customStyles={() => ({
              text: selectStyle('companyText'),
            })}
          >
            {item?.merchantName?.toUpperCase() ?? ''}
          </Typography> */}

          <Typography
            customStyles={() => ({
              text: selectStyle('bookingAuthRedeemTextTill'),
            })}
            fontSize={fontSize ? fontSize : 14} numberOfLines={1}>
            {(isRTL ? item?.title_Ar : item?.title_En  ) || item?.title ||
              item?.name ||
              item?.merchantTitle || item?.Title
              }
              {/* {item?.Title} */}
              {/* {item?.name} */}
          </Typography>
          {item?.expiryDate && (
            <Typography
              customStyles={() => ({
                text: selectStyle('bookingAuthRedeemTextSubTitle'),
              })}
              fontSize={12}>
              {item?.expiryDate
                ? isFormattedDate(item.expiryDate)
                  ? moment(item.expiryDate, 'DD/MM/YYYY hh:mm:ss A').format(
                      'DD/MM/YYYY',
                    ) 
                  : moment(item.expiryDate).format('DD/MM/YYYY')
                : null}
            </Typography>
          )}
        </View>
      </Pressable>
    );
  };

  return bookingAuth ? (
    <BookingAuthCard />
  ) : (
    <Pressable onPress={onPress}>
      <View
        style={[
          selectStyle('cardContainer'),
          isSmall && {height: hp(118), width: wp(140), marginHorizontal: 0},
        ]}>
        <View style={[selectStyle('contentContainer')]}>
          <ProgressiveImage
            resizeMode="contain"
            style={{alignSelf: 'center'}}
            imageStyle={[
              selectStyle('imageStyle'),
              isSmall && {height: hp(78), width: wp(128)},
            ]}
            imageSource={
              item?.navigateToBillPayment
                ? item?.image
                : {uri: ImageUrlHttps}
            }
          />

          {/* <Typography
            numberOfLines={1}
            adjustsFontSizeToFit
            customStyles={() => ({
              text: selectStyle('companyText'),
            })}
          >
            {item?.merchantName?.toUpperCase() ?? ''}
          </Typography> */}

          <Typography
            customStyles={() => ({
              text: selectStyle('redeemTextTill'),
            })}>
            {item?.title ?? ''}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

export default HomeVoucherCard;
