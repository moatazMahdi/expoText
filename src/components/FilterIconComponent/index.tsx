import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { useStyles, useTheme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { observer } from 'mobx-react';
import SvgView from '../SvgView';

interface FilterIconComponentInterface {
  setOpenFilter: (value: boolean) => void;
  openFilter: boolean;
}

const FilterIconComponent: React.FC<FilterIconComponentInterface> = (props) => {
  const { selectStyle } = useStyles(styles);
  const { setOpenFilter, openFilter } = props;

  const {
    theme: {
      palette: { common }
    }
  } = useTheme();

  const {
    images: {
      screens: { creditech }
    }
  } = Assets;

  return (
    <View style={selectStyle('filterContainer')}>
      <SvgView
        svgFile={creditech.filterOutline}
        onPress={() => {
          setOpenFilter(!openFilter);
        }}
        width={25}
        height={25}
        stroke={openFilter ? common.darkBlue : common.lightgrey}
        fill={openFilter ? common.darkBlue : common.lightgrey}
      />
    </View>
  );
};

export default observer(FilterIconComponent);
