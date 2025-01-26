import { View } from 'react-native';
import React, { useCallback } from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DropShadow from 'react-native-drop-shadow';
import Svg, {
  ClipPath,
  Defs,
  G,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import {
  combineMoneyCurrency,
  formatExpiryDate,
  getPoints,
} from 'src/utils/HelpersFunctions';
import { useLocalization } from 'hooks';
import { observer } from 'mobx-react';
interface Credit {
  totalPointsValue: number;
  pointsToExpire: number;
  expiryDate: string;
}

const CreditView: React.FC<Credit> = (props) => {
  const { totalPointsValue, pointsToExpire, expiryDate } = props;
  const points = combineMoneyCurrency(totalPointsValue);
  const [numLines, setNumLines] = React.useState(1);
  const cardDimensions = {
    w: wp(342),
    h: hp(numLines !== 1 ? numLines * 30 + 170 : 170),
  }; // with more points, h=212
  const { selectStyle } = useStyles(styles);

  const onTextLayout = useCallback((e) => {
    setNumLines(e.nativeEvent.lines.length);
  }, []);

  const renderContent = () => {
    const { translate } = useLocalization();
    return (
      <View style={selectStyle('textContainer')}>
        <DropShadow style={selectStyle('textShadow')}>
          <Typography
            onTextLayout={onTextLayout}
            customStyles={() => ({
              text: selectStyle('creditText'),
            })}
          >
            {points}
          </Typography>
          <Typography
            customStyles={() => ({
              text: selectStyle('expireText'),
            })}
          >
            {`${getPoints(pointsToExpire)} ${translate(
              'POINTS_EXPIRE_IN',
            )} ${formatExpiryDate(expiryDate)}`}
          </Typography>
        </DropShadow>
        <Typography
          customStyles={() => ({
            text: selectStyle('hintText'),
          })}
        >
          {translate('TURN_A_PERCENTAGE')}
        </Typography>
        {/* <Pressable style={selectStyle('getMorePointsButton')}>
          <Typography
            customStyles={() => ({
              text: selectStyle('morePointsText')
            })}
          >
            {translate("MORE_POINTS")}
          </Typography>
        </Pressable> */}
      </View>
    );
  };
  return (
    <DropShadow style={selectStyle('container')}>
      <View style={selectStyle('cardContainer')}>
        <Svg height={cardDimensions.h} width={cardDimensions.w}>
          <Defs>
            <RadialGradient
              id="grad"
              cx="15%"
              cy="30%"
              rx="100%"
              ry="55%"
              fx="40%"
              fy="20%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#0AFFA7" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#294BA1" stopOpacity="1" />
            </RadialGradient>
            <ClipPath id="clip">
              <G scale="1" x="1">
                <Rect
                  x="01"
                  y="0"
                  height={cardDimensions.h}
                  width={cardDimensions.w}
                />
              </G>
            </ClipPath>
          </Defs>
          {renderContent()}
          <Rect
            x="0"
            y="0"
            rx={16}
            height={cardDimensions.h}
            width={cardDimensions.w}
            fill="url(#grad)"
            clipPath="url(#clip)"
          />
        </Svg>
      </View>
    </DropShadow>
  );
};

export default observer(CreditView);
