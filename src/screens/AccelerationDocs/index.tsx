import React, {useState, useEffect} from 'react';
import {View, I18nManager, ScrollView} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import styles from './styles';
import NavigationHeader from 'src/components/NavigationHeader';
import DropShadow from 'react-native-drop-shadow';
import {ContinueButton, PageTitle} from 'components';
import {uploadDocs} from 'utils';
import {useRoute} from '@react-navigation/native';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import SvgView from 'src/components/SvgView';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import FloatingActionButton from 'src/components/FloatingActionButton';
import DefaultButton from 'src/components/DefaultButton';

const {
  images: {
    screens: {creditech, instantApproval},
  },
} = Assets;

export const AccelerationDocs: React.FC = () => {
  const {setPhotos} = (useRoute().params as any) || {};
  /* Hooks */
  const stores = useStores();
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  /* States */
  const [completeForm, setCompleteForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const staticCategories = [
    {
      id: 0,
      completed: false,
      title: translate('NID'),
      optional: false,
      message: translate('NID_MSG'),
      captureCardsMsg: translate('NID_CARDS_MSG'),
      frontCard: instantApproval.NIDFront,
      backCard: instantApproval.NIDBack,
      data: [
        {id: 1, photo: null, SYNAPS_id: '1', data: null},
        {id: 2, photo: null, SYNAPS_id: '3', data: null},
      ],
    },
  ];
  const [categories, setCategories] = useState([...staticCategories]);

  useEffect(() => {
    if (
      categories[0].data[0]?.photo?.uri &&
      categories[0].data[1]?.photo?.uri
    ) {
      if (categories[0].completed === false) {
        setCategories(categories => {
          let newCategories = [...categories];
          newCategories[0].completed = true;
          return newCategories;
        });
      }
      setCompleteForm(true);
    } else {
      setCompleteForm(false);
    }
  }, [categories]);

  const userData = stores.backend.users.userData;
  const submitPhotos = async () => {
    try {
      setIsLoading(true);
      const token = stores.backend.auth.getAccessToken();
      /********************************************************************************/
      let electricityBill = await uploadDocs({
        token,
        fileType: 'image/jpeg',
        id: `${userData.id}_${new Date().getTime()}_electricityBill`, //id unique for each user photo
        photoURI: categories[0].data[0].photo.uri,
      });
      /********************************************************************************/
      let ProofLetter = await uploadDocs({
        token,
        fileType: 'image/jpeg',
        id: `${userData.id}_${new Date().getTime()}_proofLetter`, //id unique for each user photo
        photoURI: categories[0].data[1].photo.uri,
      });
      /********************************************************************************/
      setPhotos([
        {uri: electricityBill, index: 0},
        {uri: ProofLetter, index: 1},
      ]);
      /********************************************************************************/
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const setPhoto = (data, url, index) => {
    let newCategories = [];
    setCategories(categories => {
      newCategories = [...categories];
      newCategories[0].data[index].photo = {...data};
      return newCategories;
    });
  };

  const onScanDoc = async (index, title) => {
    ApplicationAnalytics(
      {
        eventKey: 'speeding_up_the_tat_scan',
        type: 'CTA',
        parameters: {name: stores.backend.products?.currentProduct},
      },
      stores,
    );
    navigation.navigate('camera', {
      category: categories[0],
      categoryDataId: index,
      hideCameraContainer: index !== 0,
      setCategories: setPhoto,
      title: title,
      controlQuality: 0.2,
    });
  };

  const renderNIDCard = ({cardImage, cardPickedImage, cardText, index}) => (
    <DropShadow style={selectStyle('shadowBox')}>
      <View style={selectStyle('NIDCardContainer')}>
        <View style={selectStyle('NIDCardImageContainer')}>
          {categories[0].data[index]?.photo?.uri ? (
            // <Image style={selectStyle('photo')} source={{ uri: categories[0].data[index].photo?.uri }} />
            <SvgView svgFile={cardPickedImage} />
          ) : (
            <SvgView svgFile={cardImage} />
          )}
        </View>
        <Typography customStyles={() => ({text: selectStyle('NIDCardText')})}>
          {cardText}
        </Typography>
        <DefaultButton
          width={140}
          variant="secondaryBackground"
          title={translate('SCAN')}
          onPress={() => onScanDoc(index, cardText)}
        />
        {categories[0].data[index]?.photo?.uri && (
          <View style={selectStyle('fullButtonContainer')}>
            <View style={selectStyle('fullButton')}>
              <SvgView fill={'white'} svgFile={instantApproval.correct} />
            </View>
          </View>
        )}
      </View>
    </DropShadow>
  );

  return (
    <View style={selectStyle('mainContainer')}>
      <FloatingActionButton bot={110} />
      <ScrollView
        style={selectStyle('mainContainer')}
        contentContainerStyle={{flexGrow: 1}}>
        <NavigationHeader showLogo hideBack title={''} shapeVariant="orange" />

        <PageTitle
          title={translate('TWO_DOCS')}
        />

        {renderNIDCard({
          cardImage: creditech.ElectricityPillEmpty,
          cardPickedImage: creditech.ElectricityPillFill,
          cardText: translate('PROOF_OF_ADDRESS'),
          index: 0,
        })}

        {renderNIDCard({
          cardImage: creditech.ProofLetterEmpty,
          cardPickedImage: creditech.ProofLetterFill,
          cardText: translate('PROOF_OF_PAYMENT'),
          index: 1,
        })}
        <ContinueButton
          back
          onContinuePressed={submitPhotos}
          completeForm={completeForm}
          loading={isLoading}
        />
      </ScrollView>
      {isLoading && (
        <DefaultOverLayLoading message={translate('PLEASE_WAIT')} />
      )}
    </View>
  );
};
