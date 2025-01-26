import React, { useState } from 'react';
import { View } from 'react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import SvgView from 'src/components/SvgView';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import DefaultButton from 'src/components/DefaultButton';
import { Typography } from 'elephanz-rn-ui';

const fatortyErrorMessage: React.FC = () => {
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      title="Choose Payment Method"
    >
      <View
        style={{
          justifyContent: 'center',
          height: '90%',
        }}
      >
        <SvgView
          svgFile={creditech.fatortyError}
          style={{ width: wp(110), height: hp(110) }}
          mb={40}
        />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            customStyles={() => ({
              text: {
                color: '#E54444',
                fontFamily: 'Ping LCG',
                fontSize: 20,
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 32,
              },
            })}
          >
            {translate('FINAL_ERROR')}
          </Typography>
        </View>
      </View>

      <DefaultButton
        title="Home"
        onPress={() => {
          navigation.navigate('home');
        }}
        disabled={false}
        // mb={hp(20)}
      />
    </ScrollContainerWithNavHeader>
  );
};

export const FatortyErrorMessage = baseScreen(fatortyErrorMessage, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
