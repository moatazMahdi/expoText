import React from 'react';
import {Pressable} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {FloatingActionButtonInterface} from 'src/Types';
import {useNavigationUtils, useStores} from 'hooks';
import {wp} from 'src/utils/Dimensions/dimen';
import {useStyles} from 'elephanz-rn-ui';
import SvgView from '../SvgView';
import {Assets} from 'assets';
import styles from './styles';

const FloatingActionButton: React.FC<FloatingActionButtonInterface> = props => {
  const route = useRoute() || {};
  const {bot, pos} = props;

  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const stores = useStores();

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  return (
    <Pressable
      style={[
        selectStyle('buttonStyle'),
        {bottom: bot},
        pos === 'left' ? {left: wp(30)} : {right: wp(30)},
      ]}
      onPress={() => {
        ApplicationAnalytics(
          {
            eventKey: 'floatActionButton_home',
            type: 'CTA',
            parameters: {ScreenName: route?.name},
          },
          stores,
        );
        navigation.navigate('home');
      }}>
      <SvgView width={25} height={25} svgFile={creditech.HomeFill} />
    </Pressable>
  );
};

export default observer(FloatingActionButton);
