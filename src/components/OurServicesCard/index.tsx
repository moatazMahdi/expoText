import {
  View,
  ViewStyle,
  I18nManager,
  ImageBackground,
  Pressable,
} from 'react-native';
import React from 'react';
import styles from './styles';
import {Typography, useStyles} from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import ProgressiveImage from '../ProgressiveImage';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultButton from '../DefaultButton';

interface ViewAllProps {
  item: {
    image?: string;
    title: string;
    description: string;
    backgroundImage?: string;
  };
  cardStyle?: ViewStyle;
  width?: number;
  forSearch?: boolean;
  imageHeight?: number;
  height?: number;
  removeHeight?: boolean;
}

const OurServicesCard: React.FC<ViewAllProps> = props => {
  const {item, cardStyle, imageHeight, width, height, forSearch, removeHeight} =
    props;
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const stores = useStores();
  const {navigate} = useNavigationUtils();
  const navigateServiceScreen = async () => {
    ApplicationAnalytics(
      {
        eventKey: item?.title,
        type: 'CTA',
        parameters: {ScreenName: `serviceScreen`},
      },
      stores,
    );
    navigate('serviceScreen', {service: item});
  };

  const renderContent = () => {
    return (
      <>
        <Typography
          numberOfLines={1}
          customStyles={() => ({
            text: selectStyle('titleStyle'),
          })}>
          {item?.title}
        </Typography>
        <Typography
          numberOfLines={3}
          customStyles={() => ({
            text: I18nManager.isRTL
              ? selectStyle('descStyle')
              : selectStyle('descStyleEn'),
          })}>
          {item?.description}
        </Typography>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <DefaultButton
            mt={16}
            mb={10}
            width={199}
            title={translate('KNOW_MORE')}
            onPress={navigateServiceScreen}
          />
        </View>
      </>
    );
  };

  return !forSearch ? (
    <DropShadowWrapper style={selectStyle('container')}>
      <View
        style={[
          selectStyle('cardContainer'),
          width && {width: wp(width)},
          height && {height: height},
          !removeHeight && {height: hp(282)},
          cardStyle,
        ]}>
        {/* <Image
          resizeMode="cover"
          source={{ uri: item?.image }}
          style={[selectStyle('imageStyle'), , width && { width: wp(width) }]}
        /> */}
        <ProgressiveImage
          imageStyle={[
            selectStyle('imageStyle'),
            width && {width: wp(width)},
            imageHeight && {height: hp(imageHeight)},
          ]}
          imageSource={{
            uri: item?.image ? item?.image : item?.backgroundImage,
          }}
          resizeMode={'cover'}
        />
        {renderContent()}
        {/* {renderBlurBasedOnDevice()} */}
      </View>
    </DropShadowWrapper>
  ) : (
    <DropShadowWrapper style={selectStyle('imageStyleSearch')}>
      <Pressable
        onPress={() => {
          navigate('serviceScreen', {service: item});
        }}>
        <ImageBackground
          source={{uri: item?.image ? item?.image : item?.backgroundImage}}
          imageStyle={[
            selectStyle('imageStyleSearch'),
            width && {width: wp(width)},
          ]}
          style={[
            selectStyle('imageStyleSearch'),
            width && {width: wp(width)},
          ]}>
          <View style={selectStyle('searchNameContainer')}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderBottomLeftRadius: 19,
                borderBottomRightRadius: 19,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Typography
                fontSize={12}
                marginTop={15}
                marginBottom={15}
                numberOfLines={1}>
                {item?.title}
              </Typography>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </DropShadowWrapper>
  );
};

export default OurServicesCard;
