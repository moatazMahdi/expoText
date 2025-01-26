import React from 'react';
import {View, Pressable, ActivityIndicator} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useStyles} from 'elephanz-rn-ui';
import {useNavigationUtils, useStores} from 'hooks';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import styles from './styles';
import {Assets} from 'assets';

export const ContinueButton = (props: {
  onContinuePressed: () => void;
  completeForm: boolean;
  containerStyle?;
  loading?: boolean;
  removeAbsolute?: boolean;
  back?: boolean;
  fromModal?: string;
}) => {
  const {
    onContinuePressed,
    completeForm,
    back,
    containerStyle,
    loading,
    fromModal,
  } = props;
  const route = fromModal ? {name: fromModal} : useRoute() || {};
  const stores = useStores();
  const {selectStyle} = useStyles(styles);

  const {
    images: {common},
  } = Assets;

  const {goBack} = useNavigationUtils();

  const onPress = () => {
    ApplicationAnalytics(
      {
        type: 'CTA',
        eventKey: route?.name,
        parameters: {name: 'continueButton', ScreenName: route?.name},
      },
      stores,
    );

    loading ? null : onContinuePressed();
  };

  const renderArrow = () => {
    return completeForm ? (
      <common.longWhiteBackArrow style={[selectStyle('backIcon')]} />
    ) : (
      <common.longGoldBackArrow style={selectStyle('backIcon')} />
    );
  };
  return (
    <View style={selectStyle('buttonsContainer')}>
      <Pressable
        onPress={onPress}
        style={[
          selectStyle('baseStyle'),
          // !removeAbsolute && selectStyle('absoluteStyle'),
          completeForm
            ? selectStyle('continueContainerOutlined')
            : selectStyle('continueContainerFilled'),
          containerStyle,
        ]}>
        {loading ? (
          <ActivityIndicator color={'#fff'} size="large" />
        ) : (
          renderArrow()
        )}
      </Pressable>
      {back && (
        <Pressable
          onPress={() => goBack()}
          style={[selectStyle('baseStyle'), selectStyle('back')]}>
          <common.longGoldBackArrow
            style={[selectStyle('baseStyle'), selectStyle('backIconDis')]}
          />
        </Pressable>
      )}
    </View>
  );
};
