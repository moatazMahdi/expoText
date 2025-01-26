import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import Modal from 'react-native-modal';
import { DefaultModalInterface } from './ModalProps';

const DefaultModal: React.FC<DefaultModalInterface> = (props) => {
  const {
    children,
    bottom,
    animationInTiming,
    animationOutTiming,
    onCloseModal,
    isVisible,
    ViewContainerStyle,
    hideModalViewStyle,
  } = props;

  const { selectStyle } = useStyles(styles);
  const timing = 950;
  return (
    <Modal
      hideModalContentWhileAnimating={true}
      style={[bottom && selectStyle('modalStyle')]}
      animationIn={'slideInUp'}
      animationInTiming={animationInTiming ? animationInTiming : timing}
      animationOut={'slideOutDown'}
      animationOutTiming={animationOutTiming ? animationOutTiming : timing}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      isVisible={isVisible}
      backdropTransitionInTiming={animationInTiming ? animationInTiming : 0}
      backdropTransitionOutTiming={animationInTiming ? animationInTiming : 0}
    >
      <View
        style={[
          !hideModalViewStyle && selectStyle('modalViewContainer'),
          ViewContainerStyle,
        ]}
      >
        {children}
      </View>
    </Modal>
  );
};

export default DefaultModal;
