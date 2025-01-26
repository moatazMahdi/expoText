import React from 'react';
import { Pressable, View } from 'react-native';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { observer } from 'mobx-react';
import SvgView from '../SvgView';
import { wp } from 'src/utils/Dimensions/dimen';
import { cardWithCheckMarkInterface } from 'src/Types';

const CardWithCheckMark: React.FC<cardWithCheckMarkInterface> = (props) => {
  const { selectStyle } = useStyles(styles);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const {
    checked,
    svgFile,
    onPress,
    title,
    width,
    height,
    headLine,
    Mandatory,
    ImageStyle,
    rowImage,
    textColor,
  } = props;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <Pressable onPress={onPress}>
      {headLine && (
        <Typography
          style={{ marginStart: 16, color: '#020B19' }}
          marginTop={24}
          fontWeight={'700'}
        >
          {headLine}
          {Mandatory && (
            <Typography style={{ color: 'red' }} fontWeight={'700'}>
              *
            </Typography>
          )}
        </Typography>
      )}
      <DropShadowWrapper
        mb={30}
        style={[
          selectStyle('cardContainer'),
          width && { width: wp(width) },
          height && { height: height },
          {
            borderColor: checked ? common.successCard : common.cardGray,
            elevation: 0,
          },
        ]}
      >
        <View style={selectStyle('cardStyle')}>
          <View style={[selectStyle('cardImage'), ImageStyle]}>
            <SvgView svgFile={svgFile} width={24} height={24} />
          </View>
          <Typography
            fontSize={16}
            style={{ marginStart: 8, color: textColor ? textColor : '#4B5565' }}
          >
            {title}
          </Typography>
        </View>
        {checked && (
          <SvgView
            svgFile={creditech.checkedBox}
            style={selectStyle('checkStyle')}
            width={20}
            height={20}
            fill={common.lightGreen}
          />
        )}
        {rowImage && (
          <SvgView
            svgFile={creditech.rowRight}
            style={selectStyle('checkStyle')}
            width={20}
            height={20}
            fill={common.lightGreen}
          />
        )}
      </DropShadowWrapper>
    </Pressable>
  );
};

export default observer(CardWithCheckMark);
