import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import DocumentPicker from 'react-native-document-picker';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DynamicDisclaimer from '../DynamicDisclaimer';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import Svg, { Path } from 'react-native-svg';

const RightArrowIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5L16 12L8 19"
      stroke="#4B5565"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface IconCardInterface {
  trailing?: any;
  leftIcon: any;
  title: any;
  index?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: any;
}

const IconCard: React.FC<IconCardInterface> = (props) => {
  const { trailing, leftIcon, title, onPress, index, disabled, style } = props;

  const { selectStyle } = useStyles(styles);
  return (
    <Pressable
      key={title}
      onPress={disabled ? () => {} : onPress}
      style={[
        selectStyle('pressable'),
        index !== 0 && { marginTop: hp(16) },
        disabled && { backgroundColor: '#C6C6C6' },
        // { width: '100%' },
      ]}
    >
      <RowView style={selectStyle('row')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={[
              { backgroundColor: '#F0F0F0', padding: hp(7), borderRadius: 8 },
              disabled && { backgroundColor: '#C6C6C6' },
            ]}
          >
            <SvgView svgFile={leftIcon} width={22} height={22} noRTL />
          </View>
          <Typography style={selectStyle('cameraOption')}>{title}</Typography>
        </View>
        {!trailing ? <RightArrowIcon /> : trailing}
      </RowView>
    </Pressable>
  );
};
export default IconCard;
