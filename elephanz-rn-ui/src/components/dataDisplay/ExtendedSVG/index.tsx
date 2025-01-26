import React from 'react';
import {View} from 'react-native';
import defaultStyles from './styles';
import {ExtendedSVGProps} from './types';
import {useStyles} from '../../../theming';

export const ExtendedSVG: React.FC<ExtendedSVGProps> = props => {
  const {customStyles, svgFile, ...svgProps} = props;

  const {selectStyle} = useStyles(defaultStyles, customStyles);
  return (
    <View style={selectStyle('containerStyle')}>
      <props.svgFile {...svgProps} width="100%" height="100%" />
    </View>
  );
};

export * from './types';
