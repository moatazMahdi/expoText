import {Animated, Easing, Pressable} from 'react-native';
import React, {useRef, useState} from 'react';
import styles from './styles';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import {useLocalization, useStores} from 'hooks';
import {observer} from 'mobx-react';
import SvgView from '../SvgView';
import {BlurView} from '@react-native-community/blur';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {NavigationContainerRef} from '@react-navigation/native';
interface FloatingNavigatorProps {
  rootNavigator: React.MutableRefObject<NavigationContainerRef | null>;
}

const FloatingNavigator: React.FC<FloatingNavigatorProps> = props => {
  const {translate} = useLocalization();

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;
  const {selectStyle} = useStyles(styles);
  const [navigatorOpened, setNavigatorOpened] = useState(false);
  const expandAnim = useRef(new Animated.Value(hp(52))).current;
  const expandMargin = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnimation = new Animated.Value(0);

  const toggleNavigator = () => {
    if (!navigatorOpened) {
      Animated.timing(expandAnim, {
        toValue: wp(280),
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {});
      Animated.timing(expandMargin, {
        toValue: wp(45),
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {});
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
      setNavigatorOpened(!navigatorOpened);
    } else {
      Animated.timing(expandAnim, {
        toValue: wp(52),
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {});
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {
        setNavigatorOpened(!navigatorOpened);
      });
      Animated.timing(expandMargin, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
  };

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const renderMiddleButton = () => {
    return (
      <Animated.View
        style={{
          transform: [{rotate: spin}],
          marginHorizontal: expandMargin,
        }}>
        <Pressable onPress={toggleNavigator}>
          {/* <View style={selectStyle('centerView')} /> */}
          <SvgView svgFile={creditech.AddButton} width={25} height={25} />
        </Pressable>
      </Animated.View>
    );
  };

  // compare two strings find the largest and fill smallest with white spaces and return first string
  // const compareAndFill = (str1: string, str2: string) => {
  //   if (str1.length < str2.length) {
  //     return str1 + ' '.repeat(str2.length - str1.length);
  //   } else {
  //     return str1;
  //   }
  // };

  return (
    <Animated.View style={[selectStyle('container'), {width: expandAnim}]}>
      <BlurView
        style={[selectStyle('blurView'), {width: '100%'}]}
        blurType="light"
        blurAmount={15}
        blurRadius={10}
        overlayColor="transparent"
      />
      {navigatorOpened && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            justifyContent: 'center',
            width: wp(60),
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => props.rootNavigator?.current.navigate('search')}>
            <SvgView svgFile={creditech.HomeFill} width={30} height={30} />
            <Typography>{translate('HOME')} </Typography>
          </Pressable>
        </Animated.View>
      )}
      {renderMiddleButton()}
      {navigatorOpened && (
        <Animated.View
          style={{opacity: fadeAnim, width: wp(60), alignItems: 'center'}}>
          <Pressable onPress={() => {}}>
            <SvgView svgFile={creditech.upgrade} width={30} height={30} />
            <Typography>{translate('UPGRADE')}</Typography>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default observer(FloatingNavigator);
