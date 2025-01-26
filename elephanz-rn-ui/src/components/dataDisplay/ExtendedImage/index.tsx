import React, {
  useState,
} from 'react';
import {
  Image,
} from 'react-native';
import {
  ExtendedImageProps,
} from './types';

export const ExtendedImage: React.FC<
ExtendedImageProps
> = (props) => {
  const [hasError, setHasError] = useState(false);

  const {
    fallbackImage,
    ...imageProps
  } = props;

  return (
    <Image
      {...imageProps}
      onError={(error) => {
        setHasError(true);
        if (imageProps.onError) {
          imageProps.onError(error);
        }
      }}
      source={hasError ? fallbackImage : imageProps.source}
    />
  );
};

export * from './types';
