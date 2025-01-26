import React, { useState } from 'react';
import { View, TouchableOpacity, Image} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { baseScreen} from 'hoc';
import { useNavigationUtils, useLocalization } from 'hooks';
import { useStyles, useTheme, Typography, ExtendedSVG, Button } from 'elephanz-rn-ui';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {PageTitle} from 'components';

const captureCards: React.FC = () => {
  const route: any = useRoute();
  const { category, setCategories } = route?.params;
  const [stateCategory, setStateCategory] = useState(category);
  const { id, title, captureCardsMsg, frontCard, backCard, data } = stateCategory;
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();
  let cards = [{ title: translate('Front_Side'), card: frontCard }];
  backCard && cards.push({ title: translate('Back_Side'), card: backCard });
  const { selectStyle } = useStyles(styles);
  const {
    theme: {
      palette: { primary, common }
    }
  } = useTheme();

  const isFormValid = () => {
    if (data[0]?.photo === null || data[1]?.photo === null) {
      return false;
    }
    return true;
  };

  const setPhoto = (data, url, index) => {
    let newCategories = [];
    setCategories((categories) => {
      newCategories = [...categories];
      newCategories[id - 1].data[index].photo = { ...data, uri: url };
      setStateCategory({ ...stateCategory, data: newCategories[id - 1].data });
      return newCategories;
    });
  };

  const renderSide = (item, index) => {
    const navigateToCamera = () =>
      navigation.navigate({ name: 'camera', params: { category, categoryDataId: index, setCategories: setPhoto } });

    return (
      <View style={selectStyle('sideContainer')}>
        <Typography customStyles={() => ({ text: selectStyle('cardTitle') })}>{item.title}</Typography>
        <TouchableOpacity activeOpacity={0.7} style={selectStyle('cardContainer')} onPress={navigateToCamera}>
          {data[index]?.photo?.uri ? (
            
            <Image style={selectStyle('photo')} source={{ uri: data[index]?.photo?.uri?.uri }} />
          ) : (
            <ExtendedSVG svgFile={item.card} />
          )}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToCamera}>
          <Typography customStyles={() => ({ text: selectStyle('captureTxt') })}>
            {data[index]?.photo?.uri ? translate('RECAPTURE') : translate('CAPTURE')}
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };

  const onConfirm = () => {
    let newCategories = [];
    setCategories((categories) => {
      newCategories = [...categories];
      newCategories[id - 1].completed = true;
      return newCategories;
    });
    navigation.goBack();
  };

  const renderConfirmButton = () => (
    <Button
      color="primary"
      customStyles={() => ({
        button: (disabled: boolean) =>
          disabled
            ? { ...selectStyle('button'), backgroundColor: common.lightgrey }
            : { ...selectStyle('button'), backgroundColor: primary.value }
      })}
      progressProps={{ color: common.white }}
      disabled={!isFormValid()}
      onPress={onConfirm}
    >
      <Typography customStyles={() => ({ text: selectStyle('buttonLabel') })}>
        {translate('CONFIRM_VOUCHER')}
      </Typography>
    </Button>
  );

  return (
    // <InstantApprovalProgress step={1} title={title} screen="captureCards" animateProgress={false}>
    <ScrollContainerWithNavHeader title={translate('GO_BACK')}>
      <PageTitle title={title} />
      <Typography customStyles={() => ({ text: selectStyle('bodyTxt') })}>{captureCardsMsg}</Typography>
      {cards?.map((item, index) => renderSide(item, index))}
      <View style={selectStyle('confirmButtonContainer')}>{renderConfirmButton()}</View>
    </ScrollContainerWithNavHeader>
    // </InstantApprovalProgress>
  );
};

export const CaptureCards = baseScreen(captureCards, { allowedRoles: ['CLIENT', 'ADMIN', 'USER'] });
