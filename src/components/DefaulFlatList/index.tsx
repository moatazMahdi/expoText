import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  FlatList,
  FlatListProps,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useLocalization } from 'hooks';
import styles from './styles';

interface DefaultFlatListInterface {
  flatListProps?: FlatListProps<{}>;
  isFetchingData?: boolean;
  horizontal?: boolean;
  style?: ViewStyle | ViewStyle[];
  optimized?: boolean;
  emptyString?: string;
  loadingPadding?: number;
  emptyComponent?: any;
  ref?: any;
  loadingMore?: boolean;
  gap?:number
}

const DefaultFlatList: React.FC<DefaultFlatListInterface> = forwardRef(
  (props, ref) => {
    const {
      isFetchingData,
      flatListProps,
      horizontal,
      loadingPadding,
      style,
      optimized,
      emptyComponent,
      emptyString,
      loadingMore,
      gap
    } = props;

    const { data } = flatListProps;

    const { selectStyle } = useStyles(styles);
    const { translate } = useLocalization();

    const simpleList = useRef();

    const {
      theme: {
        palette: { primary },
      },
    } = useTheme();

    const listFooter = () => () => {
      return loadingMore ? (
        <View
          style={{
            marginTop: 10,
            marginBottom: hp(20),
          }}
        >
          <ActivityIndicator color={primary.value} size={'large'} />

          {/* <Typography
            fontSize={14}
            fontWeight={'700'}
            customStyles={() => ({
              text: {
                color: primary.value,
                textAlign: 'center',
                padding: 5,
              },
            })}
          >
            {`${translate('LOADING')}...`}
          </Typography> */}
        </View>
      ) : null;
    };

    const renderLoadingContent = () => {
      return <ActivityIndicator size="large" color={primary.value} />;
    };

    const renderEmpty = () => {
      return emptyComponent ? (
        emptyComponent()
      ) : emptyString ? (
        <Typography
          customStyles={() => ({
            text: {
              ...selectStyle('internetText'),
              marginStart: horizontal ? wp(20) : 0,
            },
          })}
        >
          {emptyString}
        </Typography>
      ) : null;
    };

    const renderLoadingMoreContent = () => {
      return (
        <View style={[selectStyle('loadingMoreWrapper')]}>
          <ActivityIndicator size="small" color={primary.value} />
        </View>
      );
    };

    const renderNoConnection = () => {
      return (
        <Typography
          customStyles={() => ({
            text: selectStyle('internetText'),
          })}
        >
          {translate('NO_INTERNET_CONNECTION')}
        </Typography>
      );
    };

    useImperativeHandle(ref, () => ({
      scrollToOffset: () => {
        if (simpleList.current)
          return simpleList.current.scrollToOffset({
            offset: 0,
            animated: true,
          });

        return null;
      },
    }));

    const renderData = () => {
      let optimizations = optimized
        ? {
            removeClippedSubviews: true,
            initialNumToRender: 3, // Reduce initial render amount
            maxToRenderPerBatch: 2, // Reduce number in each render batch
            updateCellsBatchingPeriod: 100, // Increase time between renders
            windowSize: 21,
          }
        : {};
      return (
        <FlatList
          ref={simpleList}
          style={horizontal && { alignSelf: 'flex-start' }}
          contentContainerStyle={[
            flatListProps.data &&
              flatListProps.data.length > 0 &&
              selectStyle('flatListStyle'),
            flatListProps.data && flatListProps.data.length > 0
              ? horizontal
                ? { paddingEnd: wp(8), paddingStart: wp(20) ,gap:gap}
                : { marginTop: hp(20) }
              : null,
            style,
          ]}
          horizontal={horizontal}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={loadingMore ? listFooter() : null}
          keyExtractor={(item, index) => index.toString()}
          {...optimizations}
          {...flatListProps}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      );
    };

    return (
      <View style={selectStyle('container')}>
        {true ? (
          <View
            style={[
              selectStyle('loadingContainer'),
              loadingPadding && { marginTop: loadingPadding },
            ]}
          >
            {data?.length === 0 && isFetchingData
              ? renderLoadingContent()
              : renderData()}
          </View>
        ) : (
          <View style={selectStyle('loadingContainer')}>
            {renderNoConnection()}
          </View>
        )}

        {!horizontal && data?.length !== 0 && isFetchingData && (
          <View style={selectStyle('loadingContainer')}>
            {renderLoadingMoreContent()}
          </View>
        )}
      </View>
    );
  },
);

export default DefaultFlatList;
