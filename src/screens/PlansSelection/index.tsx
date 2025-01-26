import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useNavigationUtils, useLocalization, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import PlansCard from 'src/components/PlansCard';
import {plansItem} from 'src/components/PlansCard/types';
import RowView from 'src/components/Wrappers/RowView';
import SvgView from 'src/components/SvgView';
import DefaultButton from 'src/components/DefaultButton';
import {hp} from 'src/utils/Dimensions/dimen';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {BottomContainer} from 'src/components/BottomContainer';

const plansSelection: React.FC = () => {
  const navigation = useNavigationUtils();
  const stores = useStores();

  const {data, service} = useRoute().params as {data: any; service: any};

  const [selectedIds, setSelectedIds] = React.useState([]);

  const [renderCompareView, setRenderCompareView] = React.useState(false);

  const {translate} = useLocalization();
  const [cardHeights, setCardHeights] = React.useState([]);
  const [biggestHeight, setBiggestHeight] = React.useState(260);

  const {selectStyle} = useStyles(styles);

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  useEffect(() => {
    if (selectedIds && selectedIds.length > 1) {
      setRenderCompareView(true);
    } else setRenderCompareView(false);
  }, [selectedIds]);

  useEffect(() => {
    setCardHeights([]);
  }, [data]);

  useEffect(() => {
    if (cardHeights.length > 0) {
      setBiggestHeight(Math.max(...cardHeights));
    }
  }, [cardHeights]);

  const onSelectPlan = (item: plansItem) => {
    if (selectedIds.length === 2) {
      if (selectedIds?.includes(item)) {
        setSelectedIds(
          selectedIds?.filter(selected => selected.planID !== item.planID),
        );
      }
    }
    if (selectedIds.length < 2) {
      if (selectedIds?.includes(item)) {
        setSelectedIds(
          selectedIds?.filter(selected => selected.planID !== item.planID),
        );
      } else {
        setSelectedIds([...selectedIds, item]);
      }
    }
  };

  const onNavigateComparePlans = () => {
    ApplicationAnalytics(
      {
        eventKey: 'contact_compare_chosen_two_pans',
        type: 'CTA',
        parameters: {
          serviceName: service?.name,
          firstPlan: selectedIds[0]?.title,
          secondPlan: selectedIds[1]?.title,
        },
      },
      stores,
    );
    navigation.navigate('plansCompare', {data: selectedIds});
    setSelectedIds([]);
  };

  const renderCards = ({item}) => {
    return (
      <VerticalFlatListItemWrapper>
        <PlansCard
          setHeight={value => {
            let ch = [...cardHeights];
            ch.push(value);
            setCardHeights(ch);
          }}
          selectedIds={selectedIds}
          onPress={onSelectPlan}
          selectable
          mt={1}
          width={328}
          height={biggestHeight + 130}
          item={item}
        />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        isFetchingData={false}
        flatListProps={{
          data: data ? data : [],
          renderItem: renderCards,
        }}
      />
    );
  };

  const renderClearSelection = () => {
    return (
      <RowView
        onPress={() => {
          setSelectedIds([]);
        }}
        style={selectStyle('clearSelectionContainer')}>
        <SvgView me={5} svgFile={creditech.SelectAll} width={12} height={12} />
        <Typography
          customStyles={() => ({
            text: selectStyle('clearSelectionText'),
          })}>
          {translate('CLEAR_SELECTION')}
        </Typography>
      </RowView>
    );
  };

  const renderCompareButton = () => {
    return (
      <View style={selectStyle('compareButtonView')}>
        <BottomContainer>
          <DefaultButton
            disabled={!renderCompareView}
            onPress={onNavigateComparePlans}
            title={
              renderCompareView
                ? translate('COMPARE')
                : translate('SELECT_TWO_PLANS')
            }
          />
          <DefaultButton
            mt={20}
            onPress={() => navigation.goBack()}
            variant="secondaryBackground"
            title={translate('CANCEL')}
          />
        </BottomContainer>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        shapeVariant="yellow"
        floatBot={renderCompareView ? 160 : 70}
        showFloatingActionButton
        scrollViewStyle={{paddingBottom: hp(biggestHeight)}}
        // navHeaderRightComponent={renderCompareView && renderClearSelection}
        withUserImage
        title={translate('COMPARE_PLANS')}>
        {renderCompareView && renderClearSelection()}
        {renderList()}
      </ScrollContainerWithNavHeader>
      {renderCompareView && renderCompareButton()}
    </View>
  );
};
export const PlansSelection = baseScreen(plansSelection, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
