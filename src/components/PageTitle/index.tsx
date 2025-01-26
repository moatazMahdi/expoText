import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Typography, useStyles } from 'elephanz-rn-ui';
import styles from './styles';

export const PageTitle = (props: { style: ViewStyle | {}; title: string; titleContainerStyle?; titleTextStyle?}) => {
  const { style, title, titleContainerStyle, titleTextStyle } = props;

  const { selectStyle } = useStyles(styles);

  return (
    <View style={[style, selectStyle('titleContainer'), titleContainerStyle || {}]}>
      <Typography customStyles={() => ({ text: titleTextStyle ? titleTextStyle : selectStyle('titleText') })}>
        {title || 'Page Title'}
      </Typography>
    </View>
  );
};
