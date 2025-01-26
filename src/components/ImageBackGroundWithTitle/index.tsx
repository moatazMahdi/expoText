import {
  Pressable,
  ViewStyle,
  ImageStyle,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import HorizontalFlatListItemWrapper from '../Wrappers/HorizontalFlatListItemWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { Assets } from 'assets';

interface ImageBackGroundWithTitleInterface {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  image: string;
  title: string;
  mt?: number;
  onPress?: () => void;
  resizeMode?: 'contain' | 'cover' | 'stretch';
}

const ImageBackGroundWithTitle: React.FC<ImageBackGroundWithTitleInterface> = (
  props,
) => {
  const { containerStyle, title, image, imageStyle, onPress } = props;

  const { selectStyle } = useStyles(styles);

  const [loading, setLoading] = React.useState(true);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;
  // . https://stsci-opo.org/STScI-01GA6KKWG229B16K4Q38CH3BXS.png
  return (
    <HorizontalFlatListItemWrapper>
      <DropShadowWrapper>
        <Pressable onPress={onPress ?? null}>
          <ImageBackground
            // blurRadius={2}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
            source={{ uri: image }}
            style={[selectStyle('container'), containerStyle]}
            imageStyle={[selectStyle('imageStyle'), imageStyle]}
          >
            <LinearGradient
              style={[selectStyle('container'), containerStyle]}
              angle={0}
              useAngle
              colors={['#000000', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
            >
              <View style={selectStyle('titleContainer')}>
                {loading && (
                  <Image
                    source={creditech.imageLoading}
                    style={[
                      selectStyle('imageStyle'),
                      { position: 'absolute', zIndex: -1 },
                    ]}
                  />
                )}
                <Typography
                  customStyles={() => ({
                    text: selectStyle('titleText'),
                  })}
                >
                  {title}
                </Typography>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
      </DropShadowWrapper>
    </HorizontalFlatListItemWrapper>
  );
};

export default ImageBackGroundWithTitle;
