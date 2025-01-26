import React from 'react';
import { ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import RotateViewBasedOnLocale from '../RotateViewBasedOnLocale';
import { GetStartedButtonInterface } from 'src/Types';
import { Typography, useTheme } from 'elephanz-rn-ui';
import RowView from '../Wrappers/RowView';
import { useLocalization } from 'hooks';
import SvgView from '../SvgView';
import { Assets } from 'assets';

const GetStartedButton: React.FC<GetStartedButtonInterface> = (props) => {
  const { onPress, title, textStyle, ms, svgFile, mb, loading } = props;

  const { translate } = useLocalization();

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
    <RowView onPress={onPress} ms={ms} mt={20} mb={mb ? mb : 0}>
      {!loading && (
        <Typography
          customStyles={() => ({
            text: textStyle,
          })}
        >
          {title ?? translate('GET_STARTED')}
        </Typography>
      )}

      {!loading && (
        <RotateViewBasedOnLocale ms={6}>
          <SvgView
            svgFile={svgFile ?? creditech.BlueLongArrow}
            width={16}
            height={16}
          />
        </RotateViewBasedOnLocale>
      )}

      {loading && <ActivityIndicator size="large" color={common.darkBlue} />}
    </RowView>
  );
};

export default observer(GetStartedButton);
