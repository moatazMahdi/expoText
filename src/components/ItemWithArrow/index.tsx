import {View, Pressable} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import RotateViewBasedOnLocale from '../RotateViewBasedOnLocale';
import {SvgProps} from 'react-native-svg';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';

interface ItemWithArrowInterface {
  marginTop?: number;
  icon: FC<SvgProps>;
  title: string;
  customArrow?: FC<SvgProps>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const ItemWithArrow: React.FC<ItemWithArrowInterface> = props => {
  const {onPress, children, marginTop, icon, title, customArrow} = props;

  const {selectStyle} = useStyles(styles);

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  return (
    <Pressable onPress={onPress ?? null}>
      <DropShadowWrapper style={selectStyle('cardContainer')} mt={marginTop}>
        <RowView jc="space-between">
          <View style={{flexDirection: 'row'}}>
            <SvgView me={13} svgFile={icon} width={20} height={20} />
            <Typography
              fontSize={14}
              customStyles={() => ({
                text: {},
              })}>
              {title}
            </Typography>
          </View>
          {onPress && (
            <RotateViewBasedOnLocale>
              <SvgView
                width={20}
                height={20}
                svgFile={customArrow ?? creditech.BlackLongArrow}
              />
            </RotateViewBasedOnLocale>
          )}
        </RowView>
        {children}
      </DropShadowWrapper>
    </Pressable>
  );
};

export default ItemWithArrow;
