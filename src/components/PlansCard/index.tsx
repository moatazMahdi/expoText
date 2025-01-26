import { View, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import RowView from '../Wrappers/RowView';
import { plansItem } from './types';

interface PlansCardInterface {
  item: plansItem;
  width?: number;
  height?: number;
  selectable?: boolean;
  mt?: number;
  onPress?: (item: plansItem) => void;
  selectedIds?: plansItem[] | [];
  setHeight?: (height: number) => void;
}

const PlansCard: React.FC<PlansCardInterface> = (props) => {
  const {
    item,
    width,
    mt,
    selectable,
    selectedIds,
    setHeight,
    height,
    onPress,
  } = props;
  const { selectStyle } = useStyles(styles);

  const [BlockCard, setBlockCard] = React.useState(false);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const onCardSelect = () => {
    onPress(item);
  };

  const renderPlanDetails = () => {
    return (
      <Typography
        customStyles={() => ({
          text: selectStyle('planDetailsText'),
        })}
      >
        {item?.description}
      </Typography>
    );
  };

  const renderViewOnly = () => {
    return (
      <View
        style={[
          selectStyle('cardContainer'),
          mt && { marginTop: hp(mt) },
          width && { width: wp(width) },
          height && { height: hp(height) },
        ]}
      >
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}
        >
          {item?.title}
        </Typography>

        <View
          onLayout={(event) => {
            var { height } = event.nativeEvent.layout;
            setHeight(height);
          }}
          style={selectStyle('benefitsContainer')}
        >
          {renderPlanDetails()}
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (selectedIds && selectedIds.length > 1) {
      setBlockCard(true);
    } else setBlockCard(false);
  }, [selectedIds]);

  const checkId = () => {
    let checked = false;
    if (selectedIds.length > 0) {
      selectedIds?.forEach((element: plansItem) => {
        if (element.planID === item.planID) {
          checked = true;
        }
      });
    }
    return checked;
  };

  const renderSelectable = () => {
    return (
      <View style={{ backgroundColor: common.white, borderRadius: 20 }}>
        <Pressable
          onPress={onCardSelect}
          style={[
            selectStyle('cardContainer'),
            mt && { marginTop: hp(mt) },
            width && { width: wp(width) },
            BlockCard && !checkId() && { opacity: 0.4 },
            height && { height: hp(height) },
          ]}
        >
          <RowView jc="space-between">
            <Typography
              customStyles={() => ({
                text: selectStyle('titleText'),
              })}
            >
              {item?.title}
            </Typography>
            <View
              style={[
                selectStyle('circleStyle'),
                checkId() && selectStyle('circleFill'),
              ]}
            />
          </RowView>
          <View
            onLayout={(event) => {
              var { height } = event.nativeEvent.layout;
              setHeight(height);
            }}
            style={selectStyle('benefitsContainer')}
          >
            {renderPlanDetails()}
          </View>
        </Pressable>
      </View>
    );
  };
  return (
    <DropShadowWrapper>
      {selectable ? renderSelectable() : renderViewOnly()}
    </DropShadowWrapper>
  );
};

export default PlansCard;
