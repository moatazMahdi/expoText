import { Assets } from 'assets';
import { useStyles } from 'elephanz-rn-ui';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './styles';

interface BackArrowProps {
  onPress: () => void;
  type?: 'primary' | 'secondry' | 'rounded' | 'short';
}

export const BackArrow: React.FC<BackArrowProps> = (props: BackArrowProps) => {
  const {
    images: {
      common,
      screens: { creditech }
    }
  } = Assets;

  const { onPress, type } = props;
  const { selectStyle } = useStyles(styles);

  const renderBackIcon = () => {
    switch (props.type) {
      case 'primary':
        return <common.longBackArrow style={selectStyle('backIcon')} />;
      case 'secondry':
        return <common.backWhite style={selectStyle('backIcon')} />;
      case 'rounded':
        return <common.backWhite style={selectStyle('backIcon')} />;
      case 'short':
        return <creditech.shortBackArrow style={selectStyle('backIcon')} />;

      default:
        return <common.back style={selectStyle('backIcon')} />;
    }
  };

  return (
    <TouchableOpacity
      hitSlop={{
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      }}
      onPress={onPress}
      style={[selectStyle('backContainer'), type === 'rounded' && selectStyle('roundedType')]}
    >
      {renderBackIcon()}
    </TouchableOpacity>
  );
};
