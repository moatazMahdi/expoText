import { View, Image, ViewStyle, ImageStyle, ImageProps } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import FastImage, { FastImageProps } from 'react-native-fast-image';

interface ProgressiveImageInterface {
  imageSource: string | { uri: string } | any;
  style?: ViewStyle;
  imageStyle?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat' | 'center';
  imageProps?: FastImageProps;
  normalImageProps?: ImageProps;
  placeHolderImageStyle?: ImageStyle;
  useImage?: boolean;
  errorImage?: string | { uri: string };
}

const ProgressiveImage: React.FC<ProgressiveImageInterface> = (props) => {
  const {
    imageSource,
    errorImage,
    normalImageProps,
    useImage,
    style,
    imageStyle,
    resizeMode,
    imageProps,
    placeHolderImageStyle,
  } = props;

  const { selectStyle } = useStyles(styles);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  let placeholder;

  if (error) {
    placeholder = errorImage ?? creditech.noImage;
  } else if (loading) {
    placeholder = creditech.imageLoading;
  }

  const onLoad = () => {
    setLoading(false);
    setError(false);
  };

  const onError = (error) => {
    setLoading(false);
    setError(true);
  };
  return (
    <View style={[style]}>
      {!useImage ? (
        <FastImage
          source={imageSource}
          onLoad={onLoad}
          onError={onError}
          style={imageStyle}
          resizeMode={FastImage.resizeMode[`${resizeMode ?? 'contain'}`]}
          {...imageProps}
        />
      ) : (
        <Image
          source={imageSource}
          onLoad={onLoad}
          onError={onError}
          style={imageStyle}
          resizeMode={resizeMode ? resizeMode : 'contain'}
          {...normalImageProps}
        />
      )}
      {placeholder && (
        <View style={selectStyle('placeholderWrapper')}>
          <Image
            resizeMethod="auto"
            resizeMode="contain"
            style={[imageStyle, placeHolderImageStyle]}
            source={placeholder}
          />
        </View>
      )}
    </View>
  );
};

export default ProgressiveImage;
