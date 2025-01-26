import { Pressable, ViewStyle, ImageStyle, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import ProgressiveImage from '../ProgressiveImage';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface ImageWithShadowInterface {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  item: {
    id?: number;
    image: string;
    redeemLimit: number[];
    Description?: string;
  };
  mt?: number;
  onPress?: () => void;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  w?: number;
  h?: number;
  noImage?: boolean;
  fit?: boolean;
  renderTextInsteadOfImage?: boolean;
  style?: ViewStyle;
}

const ImageWithShadow: React.FC<ImageWithShadowInterface> = (props) => {
  const {
    item,
    containerStyle,
    renderTextInsteadOfImage,
    imageStyle,
    onPress,
    resizeMode,
    w,
    h,
    noImage,
    fit,
    style,
  } = props;

  const { selectStyle } = useStyles(styles);

  const textInsteadOfImage = () => {
    return (
      <View
        style={
          fit
            ? selectStyle('textInsteadOfImageFit')
            : selectStyle('textInsteadOfImage')
        }
      >
        <Typography
          textAlign="center"
          fontWeight={fit ? '200' : '900'}
          fontSize={fit ? 12 : 21}
        >
          {item?.title}
        </Typography>
      </View>
    );
  };

  return !noImage ? (
    <DropShadowWrapper
      style={[
        selectStyle('container'),
        containerStyle,
        w && { width: wp(w) },
        h && { height: hp(h) },
      ]}
    >
      <Pressable
        style={[
          selectStyle('container'),
          ,
          w && { width: wp(w) },
          h && { height: hp(h) },
        ]}
        onPress={onPress}
      >
        {renderTextInsteadOfImage && !item?.image ? (
          textInsteadOfImage()
        ) : (
          <ProgressiveImage
            placeHolderImageStyle={[
              selectStyle('imageStyle'),
              { borderRadius: 20 },
              w && { width: wp(w) },
              h && { height: hp(h) },
            ]}
            imageStyle={[
              selectStyle('imageStyle'),
              imageStyle,
              w && { width: wp(w) },
              h && { height: hp(h) },
            ]}
            imageSource={{ uri: item?.image ? item.image : 'http://' }}
            resizeMode={resizeMode}
          />
        )}
      </Pressable>
    </DropShadowWrapper>
  ) : (
    <Pressable
      style={[
        // selectStyle('container'),
        { backgroundColor: 'transparent' },
        w && { width: wp(w) },
        h && { height: hp(h) },
        style,
      ]}
      onPress={onPress}
    >
      <ProgressiveImage
        placeHolderImageStyle={[
          selectStyle('imageStyle'),
          { borderRadius: 20 },
          w && { width: wp(w) },
          h && { height: hp(h) },
          style,
        ]}
        imageStyle={[
          selectStyle('imageStyle'),
          imageStyle,
          h && { height: hp(h) },
          w && { width: wp(w - 20) },
          { borderRadius: 0 },
        ]}
        imageSource={{ uri: item?.image ? item.image : 'http://' }}
        resizeMode={resizeMode}
        useImage
      />
    </Pressable>
  );
};

export default ImageWithShadow;
