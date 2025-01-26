import React from 'react';
import { ActivityIndicator, I18nManager, Image } from 'react-native';
import { View } from 'native-base';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import SvgView from 'src/components/SvgView';
import { Assets } from 'assets';
import styles from './styles';

const Progress: React.FC<any> = (props) => {
  const { progressLoading, userProgress, shouldUserRewarded } = props;

  const { selectStyle } = useStyles(styles);

  const data = [
    {
      id: 1,
      fulfilled: userProgress?.currentStreak >= 1 || shouldUserRewarded,
    },
    {
      id: 2,
      fulfilled: userProgress?.currentStreak >= 2 || shouldUserRewarded,
    },
    {
      id: 3,
      fulfilled: userProgress?.currentStreak >= 3 || shouldUserRewarded,
    },
    {
      id: 4,
      fulfilled: userProgress?.currentStreak >= 4 || shouldUserRewarded,
    },
  ];

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  return (
    <DropShadowWrapper style={selectStyle('stepsContainer')}>
      {progressLoading ? (
        <ActivityIndicator
          size={'large'}
          color={common.darkBlue}
          style={{ alignSelf: 'center' }}
        />
      ) : userProgress ? (
        <View
          style={[selectStyle('container'), { backgroundColor: common.white }]}
        >
          <View style={selectStyle('renderDiamondView')}>
            {data.map((item) => {
              return (
                <View style={selectStyle('diamondView')}>
                  <SvgView
                    svgFile={creditech.Diamond}
                    width={32}
                    height={32}
                    fill={item?.fulfilled ? common.darkBlue : '#E1E1E1'}
                  />

                  <Typography
                    customStyles={() => ({
                      text: selectStyle('diamondNumber'),
                    })}
                  >
                    {item.id}
                  </Typography>
                </View>
              );
            })}

            <SvgView
              svgFile={creditech.FinalDiamond}
              fill={shouldUserRewarded ? '#FF8300' : '#E1E1E1'}
              width={47}
              height={47}
            />
          </View>

          <View style={selectStyle('diamondContainer')}>
            <Image
              source={creditech.DiamondImg}
              style={selectStyle('diamond')}
            />

            <Typography
              customStyles={() => ({
                text: selectStyle('diamondAnswers'),
              })}
            >
              {I18nManager.isRTL
                ? `30/${userProgress?.answeredCount}`
                : `${userProgress?.answeredCount}/30`}
            </Typography>
          </View>
        </View>
      ) : null}
    </DropShadowWrapper>
  );
};

export default Progress;
