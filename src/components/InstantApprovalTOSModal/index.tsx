import { Alert, Pressable, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { observer } from 'mobx-react';
import DefaultModal from '../DefaultModal';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { Assets } from 'assets';
import {
  getInstantApprovalProgress,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import SvgView from '../SvgView';
import DefaultButton from '../DefaultButton';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

interface InstantApprovalTOSModalInterface {
  isVisible: boolean;
  onClose: () => void;
}

const InstantApprovalTOSModal: React.FC<InstantApprovalTOSModalInterface> = (
  props,
) => {
  const { isVisible, onClose } = props;
  const stores = useStores();
  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const { navigate } = useNavigationUtils();
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const onAccept = async () => {
    // navigate('referralScreen');
    // Check First if there is progress for instant approval
    // Then navigate to scanNID or latest progress screen
    // ApplicationAnalytics({ eventKey: 'terms_and_conditions_agree' }, stores);
    ApplicationAnalytics(
      {
        eventKey: 'terms_and_conditions',
        type: 'CTA',
        parameters: { actionName: 'agree' },
      },
      stores,
    );
    const progress = await getInstantApprovalProgress();
    if (progress) {
      if (progress?.name !== 'congratulations') {
        navigate(progress);
      } else
        Alert.alert(
          translate('DEAR_CLIENT'),
          tempTranslate(
            progress?.params?.res?.message?.en,
            progress?.params?.res?.message?.ar,
          ),
        );
    } else {
      navigate('permissionsDisclaimer');
    }
    onClose();
  };
  const renderButtons = () => (
    <View>
      <DefaultButton
        fromModal="termsAndConditionsModal"
        title={translate('AGREE')}
        onPress={onAccept}
      />
      <DefaultButton
        fromModal="termsAndConditionsModal"
        mt={20}
        variant="secondaryBackground"
        title={translate('GENERIC_CANCEL')}
        onPress={() => {
          ApplicationAnalytics(
            {
              eventKey: 'terms_and_conditions',
              type: 'CTA',
              parameters: { name: 'cancel' },
            },
            stores,
          );
          onClose();
        }}
      />
    </View>
  );

  const renderContentCard = () => (
    <View style={selectStyle('termsViewContainer')}>
      <View style={selectStyle('termsHeaderContainer')}>
        <Typography
          variant="title"
          customStyles={() => ({
            text: selectStyle('titleLabel'),
          })}
        >
          {translate('TERMS_AND_CONDITIONS')}
        </Typography>
        <Pressable onPress={onClose} style={selectStyle('backButton')}>
          <SvgView svgFile={creditech.Close} width={13} height={13} />
        </Pressable>
      </View>
      <View style={selectStyle('termsBodyContainer')}>
        <Typography
          variant="subtitle1"
          customStyles={() => ({
            text: selectStyle('subTitleTerms'),
          })}
        >
          {translate('TERM_1').split('.')[0] +
            '.\n\n' +
            translate('TERM_1').split('.')[1] +
            ' ' +
            translate('TERM_1').split('.')[2] +
            '.\n\n' +
            translate('TERM_2')}
        </Typography>
        {renderButtons()}
      </View>
    </View>
  );

  return (
    <DefaultModal bottom isVisible={isVisible} onCloseModal={onClose}>
      {renderContentCard()}
    </DefaultModal>
  );
};

export default observer(InstantApprovalTOSModal);
