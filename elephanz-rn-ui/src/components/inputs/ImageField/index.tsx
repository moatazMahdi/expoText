import {Item, Label, View} from 'native-base';
import React, {useState} from 'react';
import {Image, PermissionsAndroid, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {ImageFieldProps, ImageInfo} from './types';
import {defaultStyles} from './styles';
import {useStyles, useTheme} from '../../../theming';
import {getItemLabelProp} from './utils';
import {ExtendedSVG} from '../../dataDisplay';
import {TextFieldLabelStyles} from '../TextField';
import trash from '../../../assets/images/trash.svg';
import error from '../../../assets/images/error.svg';
import attach from '../../../assets/images/attach.svg';

export const ImageField: React.FC<ImageFieldProps> = props => {
  const {
    onChange,
    value,
    label,
    itemProps = {},
    labelProps = {},
    haseErrors = false,
    styles,
    labelStyle = TextFieldLabelStyles.STACKED,
  } = props;

  const {selectStyle} = useStyles(defaultStyles, styles);
  const {
    theme: {
      palette: {error: errorColor, others},
    },
  } = useTheme();
  const [imageValue, setImageValue] = useState<ImageInfo>(value);
  const chooseImage = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const writePermission = PermissionsAndroid.check(
      'android.permission.CAMERA',
    );
    const cameraPermisson = PermissionsAndroid.check(
      'android.permission.WRITE_EXTERNAL_STORAGE',
    );
    if (writePermission && cameraPermisson) {
      ImagePicker.showImagePicker(
        {
          rotation: 0,
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
            path: 'images',
            privateDirectory: true,
          },
        },
        response => {
          if (!response.didCancel && !response.error) {
            const source: ImageInfo = {
              uri: response.uri,
              imageData: {
                fileType: response.type ? response.type : 'image/jpeg',
                fileBase64: response.data,
              },
            };
            setImageValue(source);
            onChange(source);
          }
        },
      );
    }
  };
  return (
    <Item
      {...getItemLabelProp(labelStyle)}
      style={selectStyle('itemStyle', [labelStyle])}
      {...itemProps}
      onPress={() => chooseImage()}>
      <View style={selectStyle('header')}>
        <Label
          style={[
            selectStyle('labelStyle', [labelStyle]),
            {
              color: haseErrors ? errorColor.value : others.title,
            },
          ]}
          {...labelProps}>
          {label}
        </Label>
        {!!imageValue.uri && (
          <View style={selectStyle('trash')}>
            <ExtendedSVG
              onPress={() => {
                const src: ImageInfo = {
                  uri: '',
                };
                setImageValue(src);
                onChange(src);
              }}
              svgFile={trash}
            />
          </View>
        )}
      </View>
      {imageValue.uri ? (
        <TouchableOpacity
          style={selectStyle('imageContainer')}
          onPress={() => chooseImage()}>
          <Image
            source={{
              uri: !imageValue.uri
                ? imageValue.uri
                : `data:image/gif;base64,${imageValue.imageData?.fileBase64}`,
            }}
            style={selectStyle('image')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View
          style={[
            selectStyle('container'),
            selectStyle('error', [haseErrors]),
          ]}>
          {!haseErrors && (
            <View style={selectStyle('icon')}>
              <ExtendedSVG svgFile={attach} />
            </View>
          )}
        </View>
      )}
      {haseErrors && (
        <View style={selectStyle('errorIcon')}>
          <ExtendedSVG svgFile={error} />
        </View>
      )}
    </Item>
  );
};

export * from './types';
