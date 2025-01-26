import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import DefaultModal from '../DefaultModal';
import { useLocalization } from 'hooks';
import DefaultButton from '../DefaultButton';

interface AlertModalInterface {
  loading?: boolean;
  titleText: string;
  bodyText: string;
  alertVisible: boolean;
  closeAlert: () => void;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalInterface> = (props) => {
  const { alertVisible, closeAlert, loading, onConfirm, titleText, bodyText } =
    props;
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const renderModalContent = () => {
    return (
      <DropShadowWrapper style={selectStyle('modalContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}
        >
          {titleText}
        </Typography>
        <Typography
          customStyles={() => ({
            text: selectStyle('bodyText'),
          })}
        >
          {bodyText}
        </Typography>
        <View
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            flex: 1,
            width: '100%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
            }}
          >
            <DefaultButton
              loading={loading}
              titleStyle={selectStyle('buttonText')}
              onPress={onConfirm}
              buttonStyle={selectStyle('buttonStyle')}
              title={translate('CONFIRM')}
              fromModal="alertModal"
            />
            <DefaultButton
              titleStyle={selectStyle('buttonText')}
              onPress={closeAlert}
              variant="secondary"
              buttonStyle={selectStyle('buttonStyle')}
              title={translate('CANCEL')}
              fromModal="alertModal"
            />
          </View>
        </View>
      </DropShadowWrapper>
    );
  };

  return (
    <DefaultModal
      hideModalViewStyle
      isVisible={alertVisible}
      onCloseModal={closeAlert}
    >
      {renderModalContent()}
    </DefaultModal>
  );
};

export default observer(AlertModal);
