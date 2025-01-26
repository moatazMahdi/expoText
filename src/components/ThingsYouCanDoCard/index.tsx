import React from 'react';
import { Pressable, View } from 'react-native';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { useNavigationUtils } from 'hooks';
import SvgView from '../SvgView';
import styles from './styles';

interface ThingsYouCanDoInterface {
  item: {
    id: number;
    name: string;
    icon: any;
    navigateScreen: string;
    onPress?: () => void;
  };
  w?: number;
  h?: number;
  smallText?: string;
}

const ThingsYouCanDoCard: React.FC<ThingsYouCanDoInterface> = (props) => {
  const { item, w, h, smallText } = props;

  const navigation = useNavigationUtils();

  const { selectStyle } = useStyles(styles);

  const onNavigate = () => {
    try {
      navigation.navigate(item?.navigateScreen);
    } catch (error) {
      alert('error');
    }
  };
  return (
    <DropShadowWrapper
      style={[
        selectStyle('shadowWrapper'),
        w && { width: w },
        h && { height: h },
      ]}
    >
      <Pressable
        onPress={item.onPress ?? onNavigate}
        style={[
          selectStyle('cardContainer'),
          w && { width: w },
          h && { height: h },
        ]}
      >
        <View style={selectStyle('iconStyle')}>
          <SvgView svgFile={item?.icon} width={35} height={35} />
        </View>

        <Typography
          customStyles={() => ({
            text: selectStyle(smallText ? 'nameTextStyle' : 'nameText'),
          })}
        >
          {item?.name}
        </Typography>
        {smallText ? (
          <Typography
            customStyles={() => ({
              text: selectStyle('smallText'),
            })}
          >
            {smallText}
          </Typography>
        ) : null}
      </Pressable>
    </DropShadowWrapper>
  );
};

export default ThingsYouCanDoCard;
