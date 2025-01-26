import { ViewStyle, ScrollView, ScrollViewProps } from 'react-native';
import React from 'react';
import styles from './styles';
import { useStyles } from 'elephanz-rn-ui';
import NavigationHeader from '../../NavigationHeader';
import FloatingActionButton from '../../FloatingActionButton';
import { hp } from 'src/utils/Dimensions/dimen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ScrollContainerWithNavHeaderInterface {
  withUserImage?: boolean;
  children: React.ReactNode;
  safeAreaStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  viewCustomStyle?: ViewStyle;
  title?: string;
  hideHeader?: boolean;
  navHeaderRightComponent?: () => React.ReactNode;
  navHeaderRightComponentWithImage?: () => React.ReactNode;
  scrollViewProps?: ScrollViewProps;
  refreshControl?: React.ReactElement;
  removeCapitalization?: boolean;
  showFloatingActionButton?: boolean;
  view?: boolean;
  floatBot?: number;
  shapeVariant?: 'tangelo' | 'yellow' | 'orange' | 'blueSlate';
  hideBack?: boolean;
  showLogo?: boolean;
  renderSearch?: boolean;
  onPress?: () => void;
  bounces?: boolean;
  noInternetModal?: string;
}

const ScrollContainerWithNavHeader: React.FC<
  ScrollContainerWithNavHeaderInterface
> = (props) => {
  const {
    children,
    withUserImage,
    title,
    hideHeader,
    safeAreaStyle,
    navHeaderRightComponent,
    navHeaderRightComponentWithImage,
    scrollViewStyle,
    refreshControl,
    view,
    showFloatingActionButton,
    floatBot,
    shapeVariant,
    hideBack,
    showLogo,
    renderSearch,
    onPress,
    bounces,
    noInternetModal,
  } = props;

  const { selectStyle } = useStyles(styles);

  return (
    <SafeAreaProvider style={[selectStyle('mainContainer'), safeAreaStyle]}>
      {showFloatingActionButton && (
        <FloatingActionButton bot={floatBot ?? hp(40)} />
      )}
      {!hideHeader && (
        <NavigationHeader
          onPress={onPress}
          renderSearch={renderSearch}
          showLogo={showLogo}
          hideBack={hideBack}
          shapeVariant={shapeVariant ?? 'tangelo'}
          removeCapitalization
          RightComponentWithImage={navHeaderRightComponentWithImage}
          rightComponent={navHeaderRightComponent}
          title={title || ''} //?.toUpperCase()
          withUserImage={withUserImage}
          noInternetModal={noInternetModal}
        />
      )}
      {!view && (
        <ScrollView
          bounces={bounces ?? false}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          style={{ flex: 1 }}
          contentContainerStyle={[
            selectStyle('contentContainer'),
            scrollViewStyle,
          ]}
        >
          {children}
        </ScrollView>
      )}
      {view && children}
    </SafeAreaProvider>
  );
};

export default ScrollContainerWithNavHeader;
