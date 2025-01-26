import React from 'react';
import {View, Image, Dimensions, Pressable} from 'react-native';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import styles from './styles';
import {
  capitalizeFirstChar,
  handleLargeText,
  tempTranslate,
} from 'src/utils/HelpersFunctions';

export const BookingAuthenticationCard = ({
  item,
  statues,
  width,
  ph,
  onPress,
}) => {
  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const StatuesColors = status => {
    switch (status) {
      case tempTranslate('pending', 'معلقة'):
        return {
          backgroundColor: '#FDF6E7',
          textColor: '#FDB022',
        };
      case tempTranslate('approved', 'ناجحه'):
      case tempTranslate('Done', 'ناجحه'):
      case tempTranslate('success', 'ناجحه'):
        return {
          backgroundColor: '#ECFDF3',
          textColor: '#039754',
        };
      case tempTranslate('rejected', 'مرفوضة'):
      case tempTranslate('expired', 'منتهية'):
        return {
          backgroundColor: '#FEE4E2',
          textColor: '#D92C20',
        };
      case tempTranslate('saved', 'محفوظة'):
        return {
          backgroundColor: '#E7F7FD',
          textColor: '#228BDB',
        };
      default:
        return {
          backgroundColor: 'white',
          textColor: common.black,
        };
    }
  };
  const {selectStyle} = useStyles(styles);

  const {backgroundColor, textColor} = StatuesColors(item.status);

  return (
    <View
      style={{
        width: width ? width : Dimensions.get('window').width,
        paddingHorizontal: ph,
        marginEnd: 16,
      }}>
      <Pressable
        style={[
          selectStyle('bookingAuthCardSty'),
          {
            backgroundColor: 'white',
            marginBottom: width ? 0 : 20,
            alignItems: 'center',
            borderRadius: 8,
          },
        ]}
        onPress={onPress}>
        <View
          style={{width: '70%', flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: item.image || item?.merchantImageURL}}
            style={selectStyle('bookingAuthCardImage')}
          />
          <View style={{maxWidth: '70%'}}>
            <Typography style={selectStyle('cardTitle')} numberOfLines={1}>
              {item.title || item?.merchantTitle}
            </Typography>
            <Typography style={selectStyle('cardSubtitle')} numberOfLines={2}>
              {`${handleLargeText(item.product || item?.productName)}`}
            </Typography>
            <Typography style={selectStyle('cardOffer')} numberOfLines={1}>
              {handleLargeText(item.offer || item?.offerTitle || item?.tenorTitle)}
            </Typography>
            <Typography style={selectStyle('priceText')}>
              <Typography style={selectStyle('priceSubText')}>EGP</Typography>{' '}
              {item.price || item?.loanAmount}
            </Typography>
          </View>
        </View>

        {item?.status ? (
          <View style={[selectStyle('statusContainer'), {backgroundColor}]}>
            <Typography style={[selectStyle('statusText'), {color: textColor}]}>
              {capitalizeFirstChar(item.status)}
            </Typography>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
};
