import React, {useEffect, useState} from 'react';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import {useLocalization} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {useRoute} from '@react-navigation/native';
import BranchCard from 'src/components/BranchCard';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import {getNearestLocation} from 'src/utils/HelpersFunctions';
import Geolocation from 'react-native-geolocation-service';
import {hp} from 'src/utils/Dimensions/dimen';

const branches: React.FC = () => {
  const {data} = useRoute().params as {data: any};

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  const [nearestBranch, setNearestBranch] = useState(null);

  const _location = () => {
    Geolocation.getCurrentPosition(
      location => {
        const {latitude, longitude} = location.coords;
        const nearestBranch = getNearestLocation(data, {latitude, longitude});
        setNearestBranch(nearestBranch);
      },
      err => {
        console.log(err);
      },
      {timeout: 20000, enableHighAccuracy: true, maximumAge: 1000},
    );
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ])
        .then(granted => {
          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
          ) {
            _location();
          } else {
            console.log('Permission not granted');
          }
        })
        .catch(err => {
          console.log('error: ', err);
        });
    } else {
      const result = await Geolocation.requestAuthorization('always');
      if (result === 'granted') {
        _location();
      } else {
        //Linking.openURL('app-settings:');
      }
    }
  };

  useEffect(() => {
    Promise.all([getCurrentLocation()]);
    return () => {};
  }, []);

  const renderCards = ({item}) => {
    return (
      <VerticalFlatListItemWrapper>
        <BranchCard mt={1} item={item} />
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

  const renderNearest = () => {
    return (
      <>
        {nearestBranch ? renderSectionTitle(translate('NEAREST_BRANCH')) : null}

        <DefaultFlatList
          isFetchingData={false}
          flatListProps={{
            data: nearestBranch ? [nearestBranch] : [],
            renderItem: renderCards,
          }}
        />
      </>
    );
  };

  const renderSectionTitle = sectionTitle => {
    return (
      <Typography
        customStyles={() => ({text: selectStyle('sectionTitleText')})}>
        {sectionTitle}
      </Typography>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      scrollViewStyle={{paddingTop: hp(20)}}
      showFloatingActionButton
      withUserImage
      title={translate('ALL_BRANCHES')}>
      {(nearestBranch?.longitude === 0 && nearestBranch?.latitude === 0) ||
      !nearestBranch
        ? null
        : renderNearest()}

      {renderSectionTitle(translate('ALL_BRANCHES'))}
      {renderList()}
    </ScrollContainerWithNavHeader>
  );
};
export const Branches = baseScreen(branches, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
