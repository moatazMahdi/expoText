import React, { useEffect } from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import { useStyles, useTheme, Typography } from 'elephanz-rn-ui';
import { useNavigationUtils, useLocalization } from 'hooks';
import { InstantApprovalProgressProps } from './types';
import { Common } from 'src/assets/images/common';
import styles from './styles';

export const InstantApprovalProgress: React.FC<
  InstantApprovalProgressProps
> = ({
  children,
  showProgress = true,
  step,
  title,
  animateProgress = true,
}) => {
  const progressPercentage = animateProgress ? (step - 1) / 5 : step / 5;
  const [progress, setProgress] = React.useState(progressPercentage);

  const { selectStyle } = useStyles(styles);
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();

  const { width } = Dimensions.get('window');

  const {
    theme: {
      palette: { secondary, common },
      spacing: { spacing },
    },
  } = useTheme();

  useEffect(() => {
    (async () => {
      animateProgress && setTimeout(() => setProgress(step / 5), 500);
    })();
  }, []);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={selectStyle('container')}
    >
      {showProgress && (
        <View>
          <View style={selectStyle('headerContainer')}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Common.backWhite style={selectStyle('backArrow')} />
            </TouchableOpacity>

            <View style={selectStyle('headerTitleContainer')}>
              <Typography
                variant="subtitle1"
                customStyles={() => ({ text: selectStyle('headerTitle') })}
              >
                {title}
              </Typography>
            </View>
          </View>

          <View style={selectStyle('progressContainer')}>
            <Progress.Bar
              progress={progress}
              width={width - 20}
              height={spacing(1.5)}
              borderRadius={spacing(4)}
              useNativeDriver
              color={secondary.value}
              unfilledColor={common.white}
              borderWidth={0}
            />
          </View>
        </View>
      )}

      <Typography
        customStyles={() => ({
          text: {
            ...selectStyle('steps'),
            marginTop: showProgress ? 0 : spacing(6),
          },
        })}
      >
        {`${translate('STEP') + ' ' + step}/5`}
      </Typography>

      <View style={selectStyle('bodyContainer')}>{children}</View>
    </KeyboardAwareScrollView>
  );
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      InstantApprovalProgress: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
