import React, {useState, useEffect} from 'react';
import {View, Alert, ImageBackground} from 'react-native';
import {useLocalization} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import DropShadow from 'react-native-drop-shadow';
import DefaultButton from 'src/components/DefaultButton';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import SvgView from 'src/components/SvgView';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {hp} from 'src/utils/Dimensions/dimen';
import {PageTitle} from 'src/components/PageTitle';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

export const ScanCarLicense: React.FC = () => {
  const navigation = useNavigation();
  const {translate} = useLocalization();
  const {selectStyle} = useStyles(styles);

  const [completeForm, setCompleteForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState([
    {
      id: 0,
      completed: false,
      data: [
        {id: 1, photo: null},
        {id: 2, photo: null},
      ],
    },
  ]);

  useEffect(() => {
    if (
      categories[0].data[0]?.photo?.uri &&
      categories[0].data[1]?.photo?.uri
    ) {
      setCompleteForm(true);
    } else {
      setCompleteForm(false);
    }
  }, [categories]);

  const submitPhotos = async () => {
    if (completeForm) {
      const backSidePhoto = categories[0].data[1]?.photo?.uri;
      if (backSidePhoto) {
        try {
          setIsLoading(true);
          navigation.navigate('creditOptionalData', {
            frontPhoto: categories[0].data[0]?.photo?.uri,
            backPhoto: categories[0].data[1]?.photo?.uri,
          });
        } catch (error) {
          console.error('processing failed', error);
          Alert.alert(
            'Error',
            'Failed to process the back side of the car license card.',
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        Alert.alert('Error', 'Back side of the car license is not available.');
      }
    }
  };

  const setPhoto = (data, url, index) => {
    setCategories(categories => {
      const newCategories = [...categories];
      newCategories[0].data[index].photo = {...data, uri: url};
      return newCategories;
    });
  };

  const onScanDoc = async (index, title) => {
    navigation.navigate('camera', {
      category: categories[0],
      categoryDataId: index,
      setCategories: setPhoto,
      title: title,
    });
  };

  const renderNIDCard = ({cardImage, cardText, index}) => {
    const photoPicked = categories[0].data[index]?.photo?.uri;

    if (photoPicked) {
      return (
        <DropShadow style={selectStyle('shadowBox')}>
          <ImageBackground
            imageStyle={selectStyle('NIDCardContainerScanned')}
            style={selectStyle('NIDCardContainerScanned')}
            source={{uri: categories[0].data[index]?.photo?.uri}}>
            <DefaultButton
              variant="secondaryBackground"
              width={297}
              onPress={() => onScanDoc(index, cardText)}
              title="Rescan Image"
              mt={100}
            />
          </ImageBackground>
        </DropShadow>
      );
    }
    return (
      <DropShadow style={selectStyle('shadowBox')}>
        <View style={selectStyle('NIDCardContainer')}>
          <View style={selectStyle('NIDCardImageContainer')}>
            <SvgView svgFile={cardImage} />
          </View>
          <Typography customStyles={() => ({text: selectStyle('NIDCardText')})}>
            {cardText}
          </Typography>
          <DefaultButton
            variant="secondaryBackground"
            width={297}
            onPress={() => onScanDoc(index)}
            title="Scan"
          />
        </View>
      </DropShadow>
    );
  };

  return (
    <>
      <ScrollContainerWithNavHeader
        // hideBack
        shapeVariant="orange"
        // showLogo
        removeCapitalization>
        <PageTitle title={translate('CAR_LICENSE')} />

        {renderNIDCard({
          cardImage: creditech.NIDFrontEmpty,
          cardText: translate('CAR_LICENSE_FRONT'),
          index: 0,
        })}
        {renderNIDCard({
          cardImage: creditech.NIDBackEmpty,
          cardText: translate('CAR_LICENSE_BACK'),
          index: 1,
        })}
        {!isLoading && (
          <DefaultButton
            disabled={!completeForm}
            title="Confirm"
            titleStyles={{
              color: 'white',
              fontSize: 16,
              fontWeight: '700',
            }}
            onPress={submitPhotos}
            buttonStyle={{
              position: 'absolute',
              bottom: 5,
              marginTop: hp(30),
              height: 48,
              borderRadius: 48,
              backgroundColor: '#FD8326',
              opacity: !completeForm ? 0.5 : 1,
            }}
          />
        )}
      </ScrollContainerWithNavHeader>
      {isLoading && (
        <DefaultOverLayLoading message="Please wait, this can take a while." />
      )}
    </>
  );
};
