import React from 'react';
import { ImageBackground, Pressable,I18nManager } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useStyles } from 'elephanz-rn-ui';
import styles from './styles';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { useNavigationUtils, useStores } from 'hooks';

const HomeBanners = (props) => {
  const { item, full, fatorty,offerData } = props;
  const { selectStyle } = useStyles(styles);
  const stores = useStores();
  const navigation = useNavigationUtils();
  const isRTL = I18nManager.isRTL;

  const fatortyBannerStyle = { height: hp(84), width: !full ? wp(339) : wp(510) };
  const imageBackground = { height: hp(135), width: !full ? wp(250) : wp(310) };

  const onPress = () => {

    ApplicationAnalytics(
      {
        eventKey: item?.eventKey,
        type: 'CTA',
        parameters: { ScreenName: 'Home' }, 
      },
      stores, 
    );
    if(item?.navigation === null){
      return
    } else if(item?.navigation?.name === 'offerDetails') {
      const Offer = offerData.find(({ id }) => id === item?.navigation?.id);  
      if(Offer === undefined){
        return
      }else{
        navigation.navigate(item?.navigation?.name, { offer: Offer });
      }
      } else {
        navigation.navigate(item?.navigation?.name, { merchant: item?.navigation })
      }
  };    
  return item !== null ? (
    <Pressable style={selectStyle('containerStyle')} onPress={item?.onPress || onPress}>
      <ImageBackground
        resizeMode="cover"
        // source={item?.img || isRTL ?  {uri:item?.imageURL?.ar} :  {uri:item?.imageURL?.en} }
        source={item?.img || {uri: isRTL ? item?.imageURL?.ar:item?.imageURL?.en} }
        imageStyle={[selectStyle('imageBackground')]}
        // style={{ height: hp(135), width: !full ? wp(250) : wp(310) }}
        style={fatorty ? fatortyBannerStyle : imageBackground}
      // style={{ height: hp(190), width: wp(333) }}
      />
    </Pressable>
  ) : null;
};

export default HomeBanners;
