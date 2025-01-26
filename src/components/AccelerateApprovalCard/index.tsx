import React from 'react';
import { Image, View } from 'react-native';
import styles from './styles';
import { Typography, useStyles } from '@/elephanz-rn-ui';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import GetStartedButton from '../GetStartedButton';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { hp } from 'src/utils/Dimensions/dimen';
import { Assets } from '@/src/assets';

const AccelerateApprovalCard: React.FC<any> = (props) => {
  const stores = useStores();

  const { selectStyle } = useStyles(styles);

  const { navigate } = useNavigationUtils();

  const { setPhotosData } = props;

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <DropShadowWrapper mb={30} style={selectStyle('cardContainer')}>
      <Typography
        customStyles={() => ({
          text: selectStyle('headerText'),
        })}
      >
        {translate('ACCELERATE_APPROVAL')}
      </Typography>

      <View style={selectStyle('contentContainer')}>
        <Image
          resizeMode="contain"
          source={creditech.Accelerate}
          style={{ width: hp(198), height: hp(112), alignSelf: 'center' }}
        />
        <Typography
          customStyles={() => ({
            text: {},
          })}
        >
          {translate('ACCELERATE_APPROVAL_DESC')}
        </Typography>
        <Typography
          marginTop={20}
          fontSize={48}
          textAlign="center"
          customStyles={() => ({
            text: {},
          })}
        >
          {translate('ONE_WEEK')}
        </Typography>
        <GetStartedButton
          onPress={() => {
            ApplicationAnalytics(
              {
                eventKey: 'speeding_up_the_tat_get_started',
                type:'CTA',
                parameters: { productName: stores.backend.products?.currentProduct },
              },
              stores,
            );
            navigate('accelerationDocs', {
              setPhotos: (data) => setPhotosData(data),
            });
          }}
        />
      </View>
    </DropShadowWrapper>
  );
};

export default observer(AccelerateApprovalCard);
