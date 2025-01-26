import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  FlatList,
  Animated,
  Image,
  I18nManager,
} from 'react-native';
import {Typography, useStyles} from 'elephanz-rn-ui';
import SvgView from 'src/components/SvgView';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import styles from './styles';
import {Assets} from 'assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {tempTranslate} from 'src/utils/HelpersFunctions';

export const AppOnboarding: React.FC = () => {
  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const {
    images: {
      screens: {creditech, onboarding},
    },
  } = Assets;

  const data = [
    {
      id: 1,
      imageUrl: onboarding.onboarding3,
      title: tempTranslate(
        'Instant Credit Limit!',
        'الطلب والموافقة علي حد ائتماني في لحظات!',
      ),
      desc: tempTranslate(
        'Just follow these simple steps and get instant credit limit',
        'الطلب والموافقة في لحظات بأسهل وأسرع الإجراءات!',
      ),
    },
    {
      id: 2,
      imageUrl: onboarding.onboarding2,
      title: tempTranslate('Manage Your Bills!', 'إدارة فواتيرك!'),
      desc: tempTranslate(
        'Track, manage and pay your bills instantly cash or with your credit limit!',
        'ادفع فواتيرك باستخدام رصيدك الائتماني أو كاش',
      ),
    },
    {
      id: 3,
      imageUrl: onboarding.onboarding1,
      title: tempTranslate('Your Financial Companion!', 'شريكك المالي!'),
      desc: tempTranslate(
        'All your financial needs are covered here!',
        'كل احتياجاتك المالية في مكان واحد!',
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % data.length);
    }, 10000);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [data.length]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace({name: 'onboarding'});
    } catch (error) {
      console.error('Error saving onboarding status', error);
    }
  };

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(
      contentOffsetX / event.nativeEvent.layoutMeasurement.width,
    );
    setCurrentIndex(newIndex);
    startAutoScroll();
  };

  const GetStartButton = () => {
    return (
      <View style={selectStyle('buttonContainer')}>
        <Pressable style={selectStyle('button')} onPress={completeOnboarding}>
          <Typography style={selectStyle('getStartText')}>
            {tempTranslate('Get Started', 'ابدأ من هنا')}
          </Typography>
          <SvgView
            svgFile={onboarding.ArrowRight}
            width={20}
            height={20}
            ms={8}
            style={{
              transform: [{rotate: I18nManager.isRTL ? '90deg' : '0deg'}],
            }}
          />
        </Pressable>
      </View>
    );
  };

  const renderItemsWrapper = ({item}: {item: (typeof data)[0]}) => {
    return (
      <View style={selectStyle('cardContainer')}>
        <Image
          source={item.imageUrl}
          style={{width: '100%', height: 200}}
          resizeMode="contain"
        />
        <Text style={selectStyle('title')}>{item.title}</Text>
        <Text style={selectStyle('description')}>{item.desc}</Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={selectStyle('dotContainer')}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              selectStyle('dot'),
              currentIndex === index
                ? selectStyle('activeDot')
                : selectStyle('inactiveDot'),
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={selectStyle('container')}>
      <ImageBackground
        style={selectStyle('imageBackground')}
        // resizeMode='contain'
        source={creditech.OnboardingBackground}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItemsWrapper}
          keyExtractor={item => item.id.toString()}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onTouchStart={stopAutoScroll}
          onScrollEndDrag={startAutoScroll}
          // contentContainerStyle={{
          //   flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
          // }}
          // inverted={I18nManager.isRTL}
        />
        {renderDots()}
      </ImageBackground>
      <GetStartButton />
    </View>
  );
};
