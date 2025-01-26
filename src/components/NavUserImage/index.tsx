import React, { useState } from 'react';
import { Pressable } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { useRoute } from '@react-navigation/native';
import { useStyles } from 'elephanz-rn-ui';
import Modal from 'react-native-modal';
import { observer } from 'mobx-react';
import { useStores } from 'hooks';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import NotificationBadge from '../NotificationBadge';
import UserProfileModal from '../UserProfileModal';
import SvgView from '../SvgView';
import styles from './styles';
import { Assets } from 'assets';
interface NavUserImageProps {
  onPress?: () => void;
  showBadge?: boolean;
  imageStyle?: ImageStyle;
  imageSVGDimensions?: number;
}

const NavUserImage: React.FC<NavUserImageProps> = (props) => {
  const { onPress, showBadge, imageStyle, imageSVGDimensions } = props;
  const stores = useStores();
  const route = useRoute() || {};
  const user = stores?.backend?.users?.userData;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;
  const { selectStyle } = useStyles(styles);
  const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const onToggleModel = () => {
    setModalVisible(!modalVisible);
  };

  const onModalHide = (passedFunc: () => void) => {
    passedFunc && passedFunc();
  };

  const renderModal = () => {
    const animationTiming = 500;
    return (
      <Modal
        hideModalContentWhileAnimating={true}
        animationIn={'slideInDown'}
        animationInTiming={animationTiming}
        animationOut={'fadeOutUp'}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        isVisible={modalVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        onModalHide={() => onModalHide}
      >
        <UserProfileModal
          closeModal={closeModal}
          onModalHide={(func) => onModalHide(func)}
        />
      </Modal>
    );
  };
  return (
    <>
      {renderModal()}
      <Pressable
        onPress={() => {
          ApplicationAnalytics(
            {
              eventKey: 'controlCenter',
              type: 'CTA',
              parameters: { ScreenName: route?.name },
            },
            stores,
          );

          onPress ? onPress() : onToggleModel();
        }}
        style={selectStyle('headerUserImageContainer')}
      >
        {showBadge && <NotificationBadge userImage />}
        {user?.avatar ? (
          <FastImage
            source={{
              uri: user.avatar,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[
              selectStyle('userImage'),
              imageStyle,
              imageSVGDimensions && {
                width: imageSVGDimensions,
                height: imageSVGDimensions,
              },
            ]}
          />
        ) : (
          <SvgView
            br={99}
            svgFile={creditech.avatar}
            width={imageSVGDimensions ?? 35}
            height={imageSVGDimensions ?? 35}
          />
        )}
      </Pressable>
    </>
  );
};

export default observer(NavUserImage);
