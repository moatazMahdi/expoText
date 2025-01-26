import {
  ImageProps,
  ImageSourcePropType,
} from 'react-native';

export interface ExtendedImageProps extends ImageProps {
  fallbackImage: ImageSourcePropType;
}
