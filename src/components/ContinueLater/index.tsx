import React from 'react';
import { Pressable } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { useStyles, Typography } from 'elephanz-rn-ui';
import styles from './styles';

interface ContinueLater {
  fromScreen?: string;
}

export const ContinueLater: React.FC<ContinueLater> = (props) => {
  const { fromScreen } = props;
  /* Hooks */
  const navigation = useNavigationUtils();
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const continueLaterPressed = () => {
    navigation.navigate('continueLaterScreen', { fromScreen: fromScreen });
  };

  return (
    <Pressable
      style={selectStyle('continueLaterContainer')}
      onPress={continueLaterPressed}
    >
      <Typography
        customStyles={() => ({ text: selectStyle('continueLaterText') })}
      >
        {translate('CONTINUE_LATER')}
      </Typography>
    </Pressable>
  );
};
