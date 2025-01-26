import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import SvgView from '../SvgView';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { useNavigationUtils, useStores } from 'hooks';
import { truncateWithEllipses } from 'src/utils/HelpersFunctions';
import { Assets } from 'assets';
import { Typography } from 'elephanz-rn-ui';

interface OurServicesSVGCardProps {
  item: {
    image: string;
    title: string;
    description: string;
  };
  svgImage?: string;
  cardStyle?: ViewStyle;
  width?: number;
  height?: number;
  onPress?: () => void;
}

const {
  images: {
    screens: { creditech, home },
  },
} = Assets;


const OurServicesSVGCard: React.FC<OurServicesSVGCardProps> = (props) => {
  const { item, cardStyle, width, height, onPress, svgImage } = props;
  const stores = useStores();
  const { navigate } = useNavigationUtils();
  const navigateServiceScreen = async () => {
    ApplicationAnalytics(
      {
        eventKey: item?.title,
        type: 'CTA',
        parameters: { ScreenName: `serviceScreen` },
      },
      stores,
    );

    const titles = [
      'We got you covered',
      'Family comes first',
      'عائلتك اولاً',
      'اشترى وانت مطمن',
    ]
    // if (item.title === 'We got you covered' || item.title === 'Family comes first' || item.title === 'عائلتك اولاً' || item.title === 'اشترى وانت مطمن') {
    if (titles.includes(item.title)) {
      navigate('articleDetails', { article: item });
    } else {
      navigate('serviceScreen', { service: item });
    }
  };
  const formatText = (text) => {
    if (!text) return '';
    return text?.charAt(0)?.toUpperCase() + text?.slice(1)?.toLowerCase();
  };
  let formattedTXT = svgImage ? formatText(svgImage) : 'Auto';

  const categories = [
    'Auto',
    'Clubs',
    'Wedding',
    'Education',
    'Homes',
    'Trucks',
    'Mortgage',
    'Brokerage',
    'Leasing',
    'Green_finance',
    'You_matter_the_most',
    'Family_comes_first',
    'We_got_you_covered',
  ];

  const isCategory = (svgImage) => {
    return categories.includes(svgImage);
  };

  if (I18nManager.isRTL && item?.title === 'Family comes first') {
    item.title = 'عائلتك اولاً'
  }

  if (I18nManager.isRTL && item?.title === 'We got you covered') {
    item.title = 'اشترى وانت مطمن'
  }
  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          cardStyle,
          width && { width },
          height && { height },

          // { width: width, height: height -10 }
        ]}
        onPress={navigateServiceScreen}
      >

        <View style={[styles.iconContainer, { width, height }]}>
          {isCategory(formattedTXT) ? (
            // <Typography>{creditech[formattedTXT]}</Typography>
            <SvgView svgFile={creditech[formattedTXT]} style={{ width: '100%', height: '100%' }} />
          ) : null}
        </View>
      </TouchableOpacity>


      <Typography style={[styles.title, { width, height }]}>{item?.title}</Typography>
      {/* <Text style={styles.title}>{truncateWithEllipses(item?.title, 15)}</Text> */}
    </>
  );


};


const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    // width: size,
    // height: size,
    // backgroundColor: '#dddFFF',

  },
  iconContainer: {
    borderRadius: 8,
    // width: size,
    // height: size,
    // marginBottom: 5,
  },
  // image: {
  //   width: size,
  //   height: size,
  // },
  title: {
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: hp(4),
    // backgroundColor: 'red',
    color: '#000000', // Black text color
    fontSize: 12,
    fontWeight: 'bold',
    // width: size,
    textAlign: 'center',
  },
  description: {
    color: '#000000', // Black text color
    fontSize: 10,
    textAlign: 'center',
  },
});
export default OurServicesSVGCard;
