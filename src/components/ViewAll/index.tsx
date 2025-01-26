import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useLocalization, useStores } from 'hooks';
import DefaultFlatList from '../DefaulFlatList';
import styles from './styles';

interface ViewAllProps {
  title?: string;
  onPress?: () => void;
  data?: any;
  renderItems?: any;
  hideViewAll?: boolean;
  children?: React.ReactNode;
  childrenContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  rightComponent?: () => React.ReactNode;
  rightComponentText?: string;
  loading?: boolean;
  maxNumberOfItemsToRender?: number;
  horizontal?: boolean;
  showTitle?: boolean;
  flatListEmptyString?: string;
  emptyComponent?: () => React.ReactNode;
  style?: ViewStyle;
  NotUpperCaseText?: boolean;
  isVertical?: boolean;
  itemsWrapperStyle?: ViewStyle;
  numColumns?: number;
  isOurServices?: boolean;
  listStyle?:ViewStyle
  notPadding?:boolean

}

const ViewAll: React.FC<ViewAllProps> = (props) => {
  const {
    isOurServices,
    title,
    data,
    renderItems,
    hideViewAll,
    children,
    childrenContainerStyle,
    containerStyle,
    rightComponent,
    rightComponentText,
    onPress,
    loading,
    maxNumberOfItemsToRender,
    horizontal,
    showTitle,
    flatListEmptyString,
    emptyComponent,
    style,
    isVertical,
    itemsWrapperStyle,
    NotUpperCaseText = false,
    numColumns,
    listStyle,
    notPadding
  } = props;

  const {
    theme: {
      palette: {
        common: { darkBlue },
      },
    },
  } = useTheme();

  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const route = useRoute() || {};
  const stores = useStores();

  const returnMAXDataToRender = () => {
    let maxDataToRender = [];
    if (data.length > 0 && maxNumberOfItemsToRender) {
      maxDataToRender = data?.slice(0, maxNumberOfItemsToRender);
    } else {
      maxDataToRender = data;
    }
    return maxDataToRender;
  };

  const renderViewAll = () => {
    return (
      !hideViewAll && (
        <Pressable
          hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
          onPress={() => {
            ApplicationAnalytics(
              {
                eventKey: 'VIEW_ALL',
                type: 'CTA',
                parameters: {
                  ScreenName: route?.name,
                },
              },
              stores,
            );

            onPress();
          }}
          style={selectStyle('viewAllContainer')}
        >
          <Typography
            customStyles={() => ({
              text: selectStyle('ViewAllText'),
            })}
          >
            {rightComponentText ? rightComponentText : translate('VIEW_ALL')}
          </Typography>
        </Pressable>
      )
    );
  };

  // const renderItemsWrapper = (data) => {

  //   return (
  //     <View
  //       style={[
  //         {
  //           paddingEnd: isOurServices && (data.index === 7 || data.index === 3) ? wp(0) : wp(16), marginTop: hp(16), marginBottom: hp(16),
  //         },
  //         itemsWrapperStyle,
  //         // { backgroundColor: darkBlue }
  //       ]}
  //     >
  //       {renderItems(data)}
  //     </View>
  //   );
  // };

  const renderItemsWrapper = (data) => {
    const isStyleForOurServices =
      isOurServices && (data.index === 7 || data.index === 3);
    const dynamicStyles = {
      // paddingEnd: isStyleForOurServices ? wp(0) : wp(16),
      paddingEnd: isStyleForOurServices || notPadding ? wp(0) : wp(16),
      marginTop: isOurServices || notPadding ? hp(0) : hp(16),
      marginBottom: isOurServices  ? hp(0) : hp(16),
    };

    return (
      <View style={[dynamicStyles, itemsWrapperStyle]}>
        {renderItems(data)}
      </View>
    );
  };

  const ViewAllTitle = NotUpperCaseText ? title : title?.toUpperCase();
  return (
    <View style={[selectStyle('container'), containerStyle]}>
      {(data?.length > 0 ||
        emptyComponent ||
        loading ||
        showTitle ||
        flatListEmptyString) && (
          <View style={[selectStyle('headerContainer'), style]}>
            {title ? (
              <Typography
                customStyles={() => ({
                  text: selectStyle('titleText'),
                })}
              >
                {title}
              </Typography>
            ) : null}

            {rightComponent ? rightComponent() : renderViewAll()}
          </View>
        )}
      {data && (
        <DefaultFlatList
          style={[listStyle,{
            ...style,
          }]}
          isFetchingData={loading ? loading : false}
          emptyString={flatListEmptyString}
          flatListProps={{
            numColumns: numColumns,
            horizontal: isVertical ? false : true,
            showsHorizontalScrollIndicator: false,
            data: data ? returnMAXDataToRender() : [],
            renderItem: renderItemsWrapper,
          }}
          horizontal={horizontal}
        />
      )}
      {data &&
        data.length === 0 &&
        emptyComponent &&
        !loading &&
        emptyComponent()}
      {children && (
        <View
          style={[
            title && selectStyle('childrenContainer'),
            childrenContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default ViewAll;
