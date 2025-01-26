/**
 * for displaying the progress of installment or for any other purpose that requires progress bar
 * @param percentage if the percentage is already calculate it can be passed to it if NOT
 * @param total & @param part can be used to calculate the percentage of the progress bar
 * @barHeight is used to increase the height of the entire progress bar and also the font size of the progress text
 * @param screenWidth is used to check if the progress percentage is greate than hp(40) or not due to a bug if the percentage is less than 12 or 5 or at 0
 * the percentage text will get out of view if it's flex-end so if it's smaller than hp(40) it will be flex-start.
 *
 */
import { View, Dimensions, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface ProgressBarProps {
  percentage?: number;
  total?: number;
  part?: number;
  containerStyle?: ViewStyle;
  barHeight?: number;
  showMonthNumber?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const {
    percentage,
    total,
    part,
    containerStyle,
    barHeight,
    showMonthNumber,
  } = props;
  const { width } = Dimensions.get('window');
  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const { selectStyle } = useStyles(styles);
  let calculatedPercentage = 0;
  if (total) {
    if (part || part === 0) {
      calculatedPercentage = part / total;
    } else calculatedPercentage = 0;
  } else if (percentage || percentage === 0) {
    calculatedPercentage = percentage;
  } else {
    calculatedPercentage = 0;
  }

  let screenWidth: any = width * calculatedPercentage;
  calculatedPercentage = calculatedPercentage * 100;
  const percentageText = Math.round(calculatedPercentage);

  return (
    <View style={[selectStyle('progressBarContainer'), containerStyle]}>
      <View
        style={[
          selectStyle('progressBarOuter'),
          barHeight && { height: hp(barHeight), borderRadius: barHeight / 2 },
        ]}
      />
      <View
        style={[
          selectStyle('progressBarInner'),
          { width: calculatedPercentage + '%' },
          screenWidth >= hp(40) && {
            alignItems: 'flex-end',
            backgroundColor: common.darkOrange,
          },
          barHeight && { height: hp(barHeight), borderRadius: barHeight / 2 },
        ]}
      >
        <View
          style={[
            selectStyle('progressBarTextContainer'),
            barHeight && { bottom: hp(barHeight + 5) },
          ]}
        >
          <Typography
            customStyles={() => ({
              text: {
                ...selectStyle('progressBarText'),
                right: showMonthNumber ? 0 : wp(-10),
              },
            })}
          >
            {`${
              showMonthNumber || showMonthNumber === 0
                ? showMonthNumber
                : percentageText + '%'
            }`}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
