import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Typography, useStyles } from 'elephanz-rn-ui';
import styles from './styles';
import { Assets } from 'assets';
import FatortyInvoiceCard from 'src/components/FatortyInvoiceCard';
import CustomList from 'src/components/CustomList';
import InfoBox from 'src/components/InfoBox';
import { useLocalization } from 'hooks';

interface cameraModalContentInterface {
  approvementPointsData: any;
  isInvoice?: boolean;
  children?: any;
  photo?: any;
  thumbnail?: any;
}

const CameraModalContent: React.FC<cameraModalContentInterface> = (props) => {
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const { approvementPointsData, isInvoice, photo, thumbnail } = props;
  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const renderCameraModalContent = () => {
    switch (approvementPointsData?.type) {
      case 'info':
        return (
          <View style={selectStyle('container')}>
            <Typography style={selectStyle('title')}>
              {translate('FATORTY_INSTRUCTIONS_HEADER')}
            </Typography>
            <CustomList
              messages={approvementPointsData.points}
              colors={{
                bullet: '#4B5565',
                text: '#31363F',
              }}
            />
          </View>
        );

      case 'error':
        return (
          <>
            {approvementPointsData.isEligible ? (
              <FatortyInvoiceCard
                photo={photo}
                thumbnail={thumbnail}
                isInvoice={isInvoice}
              />
            ) : null}
            {isInvoice ? (
              <CustomList
                messages={approvementPointsData.points}
                colors={{
                  bullet: '#E54444',
                  text: '#E54444',
                  backgroundColor: '#FEE4E2',
                }}
              />
            ) : (
              <InfoBox
                // add [0] if you want to show only one message
                messageKey={'FATORTY_INVALID_INVOICE_ERROR'}
                messageText={approvementPointsData.points}
                iconColor={'#E54444'}
                leftBarColor={'#E54444'}
                textColor={'#E54444'}
                backgroundColor={'#FEE4E2'}
                svgIcon={creditech.AttentionIcon}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return <>{renderCameraModalContent()}</>;
};

export default CameraModalContent;
