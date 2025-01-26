import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { wp } from 'src/utils/Dimensions/dimen';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { formatMoney } from 'src/utils/HelpersFunctions';
import RowView from '../Wrappers/RowView';

interface DefaultSliderInterface {
  value: number;
  setValue: (value: number) => void;
  sw?: number;
  minValue?: number;
  maxValue?: number;
  steps?: number[];
}

const DefaultSlider: React.FC<DefaultSliderInterface> = (props) => {
  const { value, setValue, sw, maxValue, steps } = props;

  const { selectStyle } = useStyles(styles);

  const renderSliderMarker = () => {
    return (
      <View style={selectStyle('sliderMarkerContainer')}>
        <Typography
          customStyles={() => ({ text: selectStyle('sliderMarkerText') })}
        >
          {value}
        </Typography>
      </View>
    );
  };

  const sliderWidth = sw || 280;
  return (
    <View style={[selectStyle('sliderView')]}>
      <MultiSlider
        trackStyle={selectStyle('sliderBar')}
        selectedStyle={selectStyle('sliderBar')}
        optionsArray={steps}
        snapped={true}
        enabledOne={true}
        enabledTwo={false}
        allowOverlap={true}
        sliderLength={wp(sliderWidth)}
        isMarkersSeparated={true}
        customMarkerLeft={renderSliderMarker}
        onValuesChange={(values) => setValue(values[0])}
      />
      <RowView mt={15} wt={sliderWidth} jc="space-between">
        <Typography>{0}</Typography>
        <Typography>{formatMoney(maxValue)}</Typography>
      </RowView>
    </View>
  );
};

export default DefaultSlider;
