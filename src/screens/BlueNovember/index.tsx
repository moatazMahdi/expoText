import React from 'react';
import {View, ImageBackground, I18nManager} from 'react-native';
import CalendarComponent from 'src/components/CalendarComponent';
import NavUserImage from 'src/components/NavUserImage';
import SvgView from 'src/components/SvgView';
import {useNavigationUtils} from 'hooks';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';

const blueNovember = () => {
  const navigation = useNavigationUtils();
  const isRTL = I18nManager.isRTL;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const handleArrowBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'blue',
        justifyContent: 'space-between',
      }}
      source={creditech.BlueNovOption}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 40,
        }}>
        <SvgView
          svgFile={
            isRTL ? creditech.BlackLongArrow : creditech.BlueLongArrowLift
          }
          width={20}
          height={20}
          onPress={handleArrowBackPress}
        />
        {/* <BackArrow onPress={handleArrowBackPress} type="short" /> */}
        <View
          style={{
            marginBottom: 0,
            borderRadius: 59,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25, 
            shadowRadius: 3.84, 
            elevation: 10,
          }}>
          <NavUserImage showBadge />
        </View>
      </View>
      <CalendarComponent />
    </ImageBackground>
  );
};

export const BlueNovember = baseScreen(blueNovember, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
